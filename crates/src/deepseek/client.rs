use futures::StreamExt;
use reqwest::Client as HttpClient;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::time::Duration;

use crate::{
    deepseek::{
        DeepSeekError, DeepSeekModelType, get_model,
        model::{ApiFormat, Model},
        types::DeepSeekStreamCallback,
    },
    types::{ChatMessage, ChatRole, OHLCV},
};

#[derive(Debug, Clone)]
pub struct DeepSeekConfig {
    pub api_key: String,
    pub model_type: DeepSeekModelType,
    pub timeout: Duration,
    pub base_url: Option<String>,
    pub organization_id: Option<String>,
    pub project_id: Option<String>,
}

impl Default for DeepSeekConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            model_type: DeepSeekModelType::DeepSeekChat,
            timeout: Duration::from_secs(60),
            base_url: Some("https://api.deepseek.com".to_string()),
            organization_id: None,
            project_id: None,
        }
    }
}

#[derive(Debug, Clone)]
pub struct ChatOptions {
    pub temperature: Option<f32>,
    pub max_tokens: Option<u32>,
    pub top_p: Option<f32>,
    pub frequency_penalty: Option<f32>,
    pub presence_penalty: Option<f32>,
    pub stream: bool,
    pub system_prompt: Option<String>,
    pub model_type: Option<DeepSeekModelType>,
    pub stop: Option<Vec<String>>,
    pub logprobs: Option<bool>,
    pub top_logprobs: Option<u32>,
}

impl Default for ChatOptions {
    fn default() -> Self {
        Self {
            temperature: Some(0.7),
            max_tokens: Some(2000),
            top_p: Some(0.9),
            frequency_penalty: Some(0.0),
            presence_penalty: Some(0.0),
            stream: false,
            system_prompt: None,
            model_type: None,
            stop: None,
            logprobs: None,
            top_logprobs: None,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct ChatResponse {
    pub id: String,
    pub object: String,
    pub created: u64,
    pub model: String,
    pub choices: Vec<ChatChoice>,
    pub usage: Usage,
    pub system_fingerprint: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ChatChoice {
    pub index: u32,
    pub message: ChatMessage,
    pub finish_reason: Option<String>,
    pub logprobs: Option<LogProbs>,
}

#[derive(Debug, Deserialize)]
pub struct LogProbs {
    pub content: Vec<LogProbContent>,
}

#[derive(Debug, Deserialize)]
pub struct LogProbContent {
    pub token: String,
    pub logprob: f64,
    pub bytes: Option<Vec<u8>>,
}

#[derive(Debug, Deserialize)]
pub struct Usage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}

#[derive(Debug, Deserialize)]
pub struct StreamDelta {
    pub role: Option<String>,
    pub content: Option<String>,
}

pub struct DeepSeekAI {
    config: DeepSeekConfig,
    http_client: HttpClient,
    current_model: Model,
}

impl DeepSeekAI {
    pub fn new(config: DeepSeekConfig) -> Result<Self, DeepSeekError> {
        if config.api_key.is_empty() {
            return Err(DeepSeekError::ConfigError(
                "API Key cannot be empty".to_string(),
            ));
        }
        let model = get_model(config.model_type)
            .ok_or_else(|| DeepSeekError::ModelNotSupported(format!("{:?}", config.model_type)))?;
        let http_client = HttpClient::builder()
            .timeout(config.timeout)
            .user_agent("DeepSeek-Rust-SDK/1.0")
            .build()
            .map_err(|e| {
                DeepSeekError::ConfigError(format!("Failed to create HTTP client: {}", e))
            })?;
        Ok(Self {
            config,
            http_client,
            current_model: model,
        })
    }

    pub fn with_api_key(api_key: String) -> Result<Self, DeepSeekError> {
        Self::new(DeepSeekConfig {
            api_key,
            ..Default::default()
        })
    }

    pub async fn chat(
        &self,
        message: &str,
        options: Option<ChatOptions>,
    ) -> Result<String, DeepSeekError> {
        let opts = options.unwrap_or_default();
        let mut messages = Vec::new();
        if let Some(system_prompt) = &opts.system_prompt {
            messages.push(ChatMessage {
                role: ChatRole::System,
                content: system_prompt.clone(),
            });
        }
        messages.push(ChatMessage {
            role: ChatRole::User,
            content: message.to_string(),
        });
        let response = self.chat_completion(&messages, Some(opts)).await?;
        self.extract_content(&response)
    }

    pub async fn chat_completion(
        &self,
        messages: &[ChatMessage],
        options: Option<ChatOptions>,
    ) -> Result<serde_json::Value, DeepSeekError> {
        let opts = options.unwrap_or_default();
        let model_type = opts.model_type.unwrap_or(self.config.model_type);
        let model = get_model(model_type)
            .ok_or_else(|| DeepSeekError::ModelNotSupported(format!("{:?}", model_type)))?;
        if opts.stream && !model.supports_streaming {
            return Err(DeepSeekError::StreamingNotSupported);
        }
        let request_data = self.build_request(&model.name, messages, &opts);
        let response = self
            .make_request(&model.endpoint, &request_data, opts.stream)
            .await?;
        Ok(response)
    }

    pub async fn chat_stream(
        &self,
        messages: &[ChatMessage],
        mut callback: DeepSeekStreamCallback,
        options: Option<ChatOptions>,
    ) -> Result<(), DeepSeekError> {
        let opts = options.unwrap_or_default();
        let model_type = opts.model_type.unwrap_or(self.config.model_type);
        let model = get_model(model_type)
            .ok_or_else(|| DeepSeekError::ModelNotSupported(format!("{:?}", model_type)))?;
        if !model.supports_streaming {
            return Err(DeepSeekError::StreamingNotSupported);
        }
        let request_data = self.build_request(
            &model.name,
            messages,
            &ChatOptions {
                stream: true,
                ..opts
            },
        );
        self.make_stream_request(&model.endpoint, &request_data, &mut callback)
            .await?;
        Ok(())
    }

    pub fn set_model(&mut self, model_type: DeepSeekModelType) -> Result<(), DeepSeekError> {
        let model = get_model(model_type)
            .ok_or_else(|| DeepSeekError::ModelNotSupported(format!("{:?}", model_type)))?;
        self.current_model = model;
        self.config.model_type = model_type;
        Ok(())
    }

    pub fn get_current_model(&self) -> (String, String, Option<String>) {
        (
            self.current_model.name.clone(),
            self.current_model.display_name.clone(),
            self.current_model.description.clone(),
        )
    }

    pub async fn test_connection(&self) -> Result<(bool, String, Option<String>), DeepSeekError> {
        match self
            .chat("Hello, respond with \"OK\" if you can hear me.", None)
            .await
        {
            Ok(response) => Ok((
                true,
                self.config.model_type.as_str().to_string(),
                Some(response),
            )),
            Err(e) => Ok((
                false,
                self.config.model_type.as_str().to_string(),
                Some(e.to_string()),
            )),
        }
    }

    pub async fn predict_ohlcv(
        &self,
        ohlcv_array: &[OHLCV],
        instructions: Option<&str>,
        count: Option<usize>,
        options: Option<ChatOptions>,
    ) -> Result<Vec<OHLCV>, DeepSeekError> {
        let processed_instructions =
            instructions.unwrap_or("Based on these OHLCV data, predict the next period");
        let processed_count = count.unwrap_or(1);
        if processed_count == 0 {
            return Err(DeepSeekError::ConfigError(
                "Count must be positive integer".to_string(),
            ));
        }
        const MAX_COUNT: usize = 50;
        if processed_count > MAX_COUNT {
            return Err(DeepSeekError::ConfigError(format!(
                "Count parameter too large: {}. Maximum allowed is {}",
                processed_count, MAX_COUNT
            )));
        }
        let count_message = if processed_count == 1 {
            "Return EXACTLY 1 OHLCV object for the next period.".to_string()
        } else {
            format!(
                "Return EXACTLY {} consecutive OHLCV objects for the next {} periods.",
                processed_count, processed_count
            )
        };
        let system_prompt = format!(
            r#"You are a professional financial data analysis AI. The user will give you an array of OHLCV (Open, High, Low, Close, Volume) data.
Your task: {}
CRITICAL RULES:
1. {}
2. Return ONLY a JSON array of OHLCV objects, NO explanations, comments, or other text
3. The OHLCV array format must match: [{{open, high, low, close, volume}}, ...]
4. All numbers must be valid numbers
5. Ensure technical rationality (high >= low, high >= close >= low, volume >= 0)
6. Maintain consistency with historical trends and patterns
7. For technical analysis, provide reasonable values based on typical patterns
8. Do not include markdown formatting, only pure JSON
{}"#,
            processed_instructions,
            count_message,
            if processed_count == 1 {
                r#"Example of valid response for 1 period:
[{"open": 115.5, "high": 118.0, "low": 114.0, "close": 117.0, "volume": 1350000}]"#
            } else {
                &format!(
                    r#"Example of valid response for {} periods:
[
  {{"open": 115.5, "high": 118.0, "low": 114.0, "close": 117.0, "volume": 1350000}},
  {{"open": 117.5, "high": 120.0, "low": 116.0, "close": 119.0, "volume": 1400000}}
  {} more OHLCV objects following the same pattern
]"#,
                    processed_count,
                    if processed_count > 2 {
                        format!("{}", processed_count - 2)
                    } else {
                        String::new()
                    }
                )
            }
        );
        let data_string = serde_json::to_string_pretty(ohlcv_array).map_err(|e| {
            DeepSeekError::ParseError(format!("Failed to serialize OHLCV data: {}", e))
        })?;
        let user_message = format!(
            "Here is the historical OHLCV data ({} periods):\n{}\nPlease process this data according to the system instructions. Remember to return EXACTLY {} OHLCV object(s) in a JSON array with no additional text.",
            ohlcv_array.len(),
            data_string,
            processed_count
        );
        let messages = vec![
            ChatMessage {
                role: ChatRole::System,
                content: system_prompt,
            },
            ChatMessage {
                role: ChatRole::User,
                content: user_message,
            },
        ];
        let estimated_tokens = (processed_count * 50 + 100) as u32;
        let max_tokens = options
            .as_ref()
            .and_then(|o| o.max_tokens)
            .unwrap_or(2000)
            .max(estimated_tokens);
        let mut chat_options = options.unwrap_or_default();
        chat_options.max_tokens = Some(max_tokens);
        chat_options.temperature = Some(chat_options.temperature.unwrap_or(0.3));
        chat_options.system_prompt = None;
        let response = self.chat_completion(&messages, Some(chat_options)).await?;
        let content = self.extract_content(&response)?;
        let result = self.parse_ohlcv_response(&content, processed_count)?;
        Ok(result)
    }

    fn build_request(
        &self,
        model: &str,
        messages: &[ChatMessage],
        options: &ChatOptions,
    ) -> serde_json::Value {
        let mut request = json!({
            "model": model,
            "messages": messages,
            "temperature": options.temperature.unwrap_or(0.7),
            "max_tokens": options.max_tokens,
            "top_p": options.top_p,
            "frequency_penalty": options.frequency_penalty,
            "presence_penalty": options.presence_penalty,
            "stream": options.stream,
        });
        if let Some(stop) = &options.stop {
            request["stop"] = json!(stop);
        }
        if let Some(logprobs) = options.logprobs {
            request["logprobs"] = json!(logprobs);
        }
        if let Some(top_logprobs) = options.top_logprobs {
            request["top_logprobs"] = json!(top_logprobs);
        }
        request
    }

    async fn make_request(
        &self,
        endpoint: &str,
        data: &serde_json::Value,
        stream: bool,
    ) -> Result<serde_json::Value, DeepSeekError> {
        let mut request = self
            .http_client
            .post(endpoint)
            .header("Authorization", format!("Bearer {}", self.config.api_key))
            .header("Content-Type", "application/json; charset=utf-8")
            .header("Accept", "application/json");
        // Add organization header if provided
        if let Some(org_id) = &self.config.organization_id {
            request = request.header("OpenAI-Organization", org_id);
        }
        // Add project header if provided
        if let Some(project_id) = &self.config.project_id {
            request = request.header("OpenAI-Project", project_id);
        }
        let response = request
            .json(data)
            .send()
            .await
            .map_err(|e| DeepSeekError::NetworkError(format!("HTTP request failed: {}", e)))?;
        let status = response.status();
        if status == 429 {
            return Err(DeepSeekError::RateLimitError(
                "Rate limit exceeded".to_string(),
            ));
        }
        if status == 401 {
            return Err(DeepSeekError::AuthError(
                "Authentication failed. Please check your API key.".to_string(),
            ));
        }
        if !status.is_success() {
            let error_text = response
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            // Check for context length error
            if error_text.contains("context_length") {
                return Err(DeepSeekError::ContextLengthError(
                    "Context length exceeded".to_string(),
                ));
            }
            return Err(DeepSeekError::ApiError(format!(
                "HTTP {}: {}",
                status, error_text
            )));
        }
        if stream {
            let text = response.text().await.map_err(|e| {
                DeepSeekError::NetworkError(format!("Failed to read stream: {}", e))
            })?;
            Ok(json!({"stream": text}))
        } else {
            let json = response.json().await.map_err(|e| {
                DeepSeekError::ParseError(format!("Failed to parse JSON response: {}", e))
            })?;
            Ok(json)
        }
    }

    async fn make_stream_request(
        &self,
        endpoint: &str,
        data: &serde_json::Value,
        callback: &mut DeepSeekStreamCallback,
    ) -> Result<(), DeepSeekError> {
        let mut request = self
            .http_client
            .post(endpoint)
            .header("Authorization", format!("Bearer {}", self.config.api_key))
            .header("Content-Type", "application/json; charset=utf-8")
            .header("Accept", "text/event-stream")
            .header("Cache-Control", "no-cache");
        if let Some(org_id) = &self.config.organization_id {
            request = request.header("OpenAI-Organization", org_id);
        }
        if let Some(project_id) = &self.config.project_id {
            request = request.header("OpenAI-Project", project_id);
        }
        let response = request
            .json(data)
            .send()
            .await
            .map_err(|e| DeepSeekError::NetworkError(format!("HTTP request failed: {}", e)))?;
        let status = response.status();
        if !status.is_success() {
            let response_clone = response;
            let error_text = response_clone
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            return Err(DeepSeekError::ApiError(format!(
                "HTTP {}: {}",
                status, error_text
            )));
        }
        let mut stream = response.bytes_stream();
        let mut buffer = String::new();
        while let Some(chunk) = stream.next().await {
            let chunk = chunk
                .map_err(|e| DeepSeekError::NetworkError(format!("Stream read error: {}", e)))?;
            let chunk_str = String::from_utf8_lossy(&chunk);
            let mut temp_buffer = std::mem::take(&mut buffer);
            temp_buffer.push_str(&chunk_str);
            let lines: Vec<&str> = temp_buffer.split('\n').collect();
            if let Some(last) = lines.last() {
                buffer = last.to_string();
            } else {
                buffer.clear();
            }
            for line in lines.iter().take(lines.len().saturating_sub(1)) {
                if line.starts_with("data: ") {
                    let data = &line[6..];
                    if data == "[DONE]" {
                        callback("".to_string(), true);
                        return Ok(());
                    }
                    match serde_json::from_str::<serde_json::Value>(data) {
                        Ok(parsed) => {
                            if let Some(choices) = parsed.get("choices") {
                                if let Some(choice) = choices.get(0) {
                                    if let Some(delta) = choice.get("delta") {
                                        if let Some(content) = delta.get("content") {
                                            if let Some(content_str) = content.as_str() {
                                                callback(content_str.to_string(), false);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        Err(e) => {
                            // Log parse error but continue processing
                            eprintln!("Failed to parse stream data: {}", e);
                        }
                    }
                }
            }
        }
        callback("".to_string(), true);
        Ok(())
    }

    fn extract_content(&self, response: &serde_json::Value) -> Result<String, DeepSeekError> {
        if let Some(content) = response["choices"][0]["message"]["content"].as_str() {
            Ok(content.to_string())
        } else {
            Err(DeepSeekError::ParseError(
                "Unable to parse response content".to_string(),
            ))
        }
    }

    fn parse_ohlcv_response(
        &self,
        content: &str,
        expected_count: usize,
    ) -> Result<Vec<OHLCV>, DeepSeekError> {
        // Extract JSON array from response
        let json_match = regex::Regex::new(r"\[[\s\S]*\]")
            .unwrap()
            .find(content)
            .map(|m| m.as_str());
        let json_str = json_match.unwrap_or(content);
        let parsed: Vec<serde_json::Value> = serde_json::from_str(json_str)
            .map_err(|e| DeepSeekError::ParseError(format!("Failed to parse JSON: {}", e)))?;
        let mut result = Vec::new();
        for (i, item) in parsed.iter().enumerate() {
            let obj = item.as_object().ok_or_else(|| {
                DeepSeekError::ParseError(format!("Element {} is not an object", i))
            })?;
            let open = obj.get("open").and_then(|v| v.as_f64()).ok_or_else(|| {
                DeepSeekError::ParseError(format!("Element {} missing or invalid 'open' field", i))
            })?;
            let high = obj.get("high").and_then(|v| v.as_f64()).ok_or_else(|| {
                DeepSeekError::ParseError(format!("Element {} missing or invalid 'high' field", i))
            })?;
            let low = obj.get("low").and_then(|v| v.as_f64()).ok_or_else(|| {
                DeepSeekError::ParseError(format!("Element {} missing or invalid 'low' field", i))
            })?;
            let close = obj.get("close").and_then(|v| v.as_f64()).ok_or_else(|| {
                DeepSeekError::ParseError(format!("Element {} missing or invalid 'close' field", i))
            })?;
            let volume = obj.get("volume").and_then(|v| v.as_f64()).ok_or_else(|| {
                DeepSeekError::ParseError(format!(
                    "Element {} missing or invalid 'volume' field",
                    i
                ))
            })?;
            // Validate OHLCV data
            if high < low {
                return Err(DeepSeekError::ParseError(format!(
                    "Element {}: high cannot be lower than low",
                    i
                )));
            }
            if close < low || close > high {
                return Err(DeepSeekError::ParseError(format!(
                    "Element {}: close must be between low and high",
                    i
                )));
            }
            if volume < 0.0 {
                return Err(DeepSeekError::ParseError(format!(
                    "Element {}: volume must be non-negative",
                    i
                )));
            }
            result.push(OHLCV {
                open,
                high,
                low,
                close,
                volume,
            });
        }
        if result.len() != expected_count {
            return Err(DeepSeekError::ParseError(format!(
                "AI returned {} OHLCV objects, but expected {}",
                result.len(),
                expected_count
            )));
        }
        Ok(result)
    }

    // Additional DeepSeek specific methods
    pub async fn get_models(&self) -> Result<Vec<Model>, DeepSeekError> {
        // DeepSeek doesn't have a models endpoint like OpenAI,
        // so we return our predefined models
        Ok(crate::deepseek::model::get_all_models())
    }

    pub async fn get_usage(&self) -> Result<serde_json::Value, DeepSeekError> {
        // Placeholder for usage API
        // Note: DeepSeek may not have a usage endpoint
        Ok(json!({
            "status": "not_implemented",
            "message": "Usage API is not available for DeepSeek"
        }))
    }

    pub async fn chat_with_history(
        &self,
        messages: &[ChatMessage],
        options: Option<ChatOptions>,
    ) -> Result<String, DeepSeekError> {
        // Helper method for chat with conversation history
        let response = self.chat_completion(messages, options).await?;
        self.extract_content(&response)
    }

    pub async fn batch_chat(
        &self,
        messages_list: Vec<Vec<ChatMessage>>,
        options: Option<ChatOptions>,
    ) -> Result<Vec<String>, DeepSeekError> {
        // Process multiple chat conversations in sequence
        let mut results = Vec::new();
        for messages in messages_list {
            let response = self.chat_completion(&messages, options.clone()).await?;
            let content = self.extract_content(&response)?;
            results.push(content);
        }
        Ok(results)
    }
}
