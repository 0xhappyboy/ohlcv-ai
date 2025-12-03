use futures::StreamExt;
use reqwest::Client as HttpClient;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::time::Duration;

use crate::{
    aliyun::{
        AliYunModelType, AliyunAIError, get_model,
        model::{ApiFormat, Model},
        types::AliyunStreamCallback,
    }, 
    types::{ChatMessage, ChatRole, OHLCV},
};

#[derive(Debug, Clone)]
pub struct AliyunConfig {
    pub api_key: String,
    pub model_type: AliYunModelType,
    pub timeout: Duration,
    pub base_url: Option<String>,
}

impl Default for AliyunConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            model_type: AliYunModelType::QWEN_TURBO,
            timeout: Duration::from_secs(30),
            base_url: None,
        }
    }
}

#[derive(Debug, Clone)]
pub struct ChatOptions {
    pub temperature: Option<f32>,
    pub max_tokens: Option<u32>,
    pub stream: bool,
    pub system_prompt: Option<String>,
    pub model_type: Option<AliYunModelType>,
}

impl Default for ChatOptions {
    fn default() -> Self {
        Self {
            temperature: Some(0.7),
            max_tokens: Some(1000),
            stream: false,
            system_prompt: None,
            model_type: None,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct ChatResponse {
    pub id: Option<String>,
    pub object: Option<String>,
    pub created: Option<u64>,
    pub choices: Vec<ChatChoice>,
    pub usage: Option<Usage>,
}

#[derive(Debug, Deserialize)]
pub struct ChatChoice {
    pub index: u32,
    pub message: Option<ChatMessage>,
    pub delta: Option<MessageDelta>,
    pub finish_reason: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct MessageDelta {
    pub content: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct Usage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}

#[derive(Debug, Deserialize)]
pub struct DashScopeResponse {
    pub output: DashScopeOutput,
    pub usage: DashScopeUsage,
}

#[derive(Debug, Deserialize)]
pub struct DashScopeOutput {
    pub text: Option<String>,
    pub choices: Vec<ChatChoice>,
}

#[derive(Debug, Deserialize)]
pub struct DashScopeUsage {
    pub input_tokens: u32,
    pub output_tokens: u32,
}

pub struct AliyunAI {
    config: AliyunConfig,
    http_client: HttpClient,
    current_model: Model,
}

impl AliyunAI {
    pub fn new(config: AliyunConfig) -> Result<Self, AliyunAIError> {
        if config.api_key.is_empty() {
            return Err(AliyunAIError::ConfigError(
                "API Key cannot be empty".to_string(),
            ));
        }
        let model = get_model(config.model_type)
            .ok_or_else(|| AliyunAIError::ModelNotSupported(format!("{:?}", config.model_type)))?;
        let http_client = HttpClient::builder()
            .timeout(config.timeout)
            .build()
            .map_err(|e| {
                AliyunAIError::ConfigError(format!("Failed to create HTTP client: {}", e))
            })?;
        Ok(Self {
            config,
            http_client,
            current_model: model,
        })
    }

    pub fn with_api_key(api_key: String) -> Result<Self, AliyunAIError> {
        Self::new(AliyunConfig {
            api_key,
            ..Default::default()
        })
    }

    pub async fn chat(
        &self,
        message: &str,
        options: Option<ChatOptions>,
    ) -> Result<String, AliyunAIError> {
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
    ) -> Result<serde_json::Value, AliyunAIError> {
        let opts = options.unwrap_or_default();
        let model_type = opts.model_type.unwrap_or(self.config.model_type);
        let model = get_model(model_type)
            .ok_or_else(|| AliyunAIError::ModelNotSupported(format!("{:?}", model_type)))?;
        let temperature = opts.temperature.unwrap_or(0.7);
        let max_tokens = opts.max_tokens.unwrap_or(1000);
        let stream = opts.stream;
        let request_data = match model.format {
            ApiFormat::OpenAI => {
                self.build_openai_request(&model.name, messages, temperature, max_tokens, stream)
            }
            ApiFormat::DashScope => {
                self.build_dashscope_request(&model.name, messages, temperature, max_tokens)
            }
        };
        let response = self
            .make_request(&model.endpoint, &request_data, stream)
            .await?;
        Ok(response)
    }

    pub async fn chat_stream(
        &self,
        messages: &[ChatMessage],
        mut callback: AliyunStreamCallback,
        options: Option<ChatOptions>,
    ) -> Result<(), AliyunAIError> {
        let opts = options.unwrap_or_default();
        let model_type = opts.model_type.unwrap_or(self.config.model_type);
        let model = get_model(model_type)
            .ok_or_else(|| AliyunAIError::ModelNotSupported(format!("{:?}", model_type)))?;
        if model.format != ApiFormat::OpenAI {
            return Err(AliyunAIError::StreamingNotSupported);
        }
        let temperature = opts.temperature.unwrap_or(0.7);
        let max_tokens = opts.max_tokens.unwrap_or(1000);
        let request_data =
            self.build_openai_request(&model.name, messages, temperature, max_tokens, true);
        self.make_stream_request(&model.endpoint, &request_data, &mut callback)
            .await?;
        Ok(())
    }

    pub fn set_model(&mut self, model_type: AliYunModelType) -> Result<(), AliyunAIError> {
        let model = get_model(model_type)
            .ok_or_else(|| AliyunAIError::ModelNotSupported(format!("{:?}", model_type)))?;
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

    pub async fn test_connection(&self) -> Result<(bool, String, Option<String>), AliyunAIError> {
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
    ) -> Result<Vec<OHLCV>, AliyunAIError> {
        let processed_instructions =
            instructions.unwrap_or("Based on these OHLCV data, predict the next period");
        let processed_count = count.unwrap_or(1);
        if processed_count == 0 {
            return Err(AliyunAIError::ConfigError(
                "Count must be positive integer".to_string(),
            ));
        }
        const MAX_COUNT: usize = 50;
        if processed_count > MAX_COUNT {
            return Err(AliyunAIError::ConfigError(format!(
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
            AliyunAIError::ParseError(format!("Failed to serialize OHLCV data: {}", e))
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
            .unwrap_or(1000)
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

    fn build_openai_request(
        &self,
        model: &str,
        messages: &[ChatMessage],
        temperature: f32,
        max_tokens: u32,
        stream: bool,
    ) -> serde_json::Value {
        json!({
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream,
        })
    }

    fn build_dashscope_request(
        &self,
        model: &str,
        messages: &[ChatMessage],
        temperature: f32,
        max_tokens: u32,
    ) -> serde_json::Value {
        json!({
            "model": model,
            "input": {
                "messages": messages
            },
            "parameters": {
                "temperature": temperature,
                "max_tokens": max_tokens,
                "result_format": "message"
            }
        })
    }

    async fn make_request(
        &self,
        endpoint: &str,
        data: &serde_json::Value,
        stream: bool,
    ) -> Result<serde_json::Value, AliyunAIError> {
        let response = self
            .http_client
            .post(endpoint)
            .header("Authorization", format!("Bearer {}", self.config.api_key))
            .header("Content-Type", "application/json; charset=utf-8")
            .header("Accept", "application/json")
            .json(data)
            .send()
            .await
            .map_err(|e| AliyunAIError::NetworkError(format!("HTTP request failed: {}", e)))?;
        let status = response.status();
        if !status.is_success() {
            let error_text = response
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            return Err(AliyunAIError::ApiError(format!(
                "HTTP {}: {}",
                status, error_text
            )));
        }
        if stream {
            let text = response.text().await.map_err(|e| {
                AliyunAIError::NetworkError(format!("Failed to read stream: {}", e))
            })?;
            Ok(json!({"stream": text}))
        } else {
            let json = response.json().await.map_err(|e| {
                AliyunAIError::ParseError(format!("Failed to parse JSON response: {}", e))
            })?;
            Ok(json)
        }
    }

    async fn make_stream_request(
        &self,
        endpoint: &str,
        data: &serde_json::Value,
        callback: &mut AliyunStreamCallback,
    ) -> Result<(), AliyunAIError> {
        let response = self
            .http_client
            .post(endpoint)
            .header("Authorization", format!("Bearer {}", self.config.api_key))
            .header("Content-Type", "application/json; charset=utf-8")
            .header("Accept", "text/event-stream")
            .json(data)
            .send()
            .await
            .map_err(|e| AliyunAIError::NetworkError(format!("HTTP request failed: {}", e)))?;
        let status = response.status();
        if !status.is_success() {
            let response_clone = response;
            let error_text = response_clone
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            return Err(AliyunAIError::ApiError(format!(
                "HTTP {}: {}",
                status, error_text
            )));
        }
        let mut stream = response.bytes_stream();
        let mut buffer = String::new();
        while let Some(chunk) = stream.next().await {
            let chunk = chunk
                .map_err(|e| AliyunAIError::NetworkError(format!("Stream read error: {}", e)))?;
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
                            if let Some(content) = parsed["choices"][0]["delta"]["content"].as_str()
                            {
                                callback(content.to_string(), false);
                            }
                        }
                        Err(_) => {}
                    }
                }
            }
        }
        callback("".to_string(), true);
        Ok(())
    }

    fn extract_content(&self, response: &serde_json::Value) -> Result<String, AliyunAIError> {
        if let Some(content) = response["choices"][0]["message"]["content"].as_str() {
            Ok(content.to_string())
        } else if let Some(content) =
            response["output"]["choices"][0]["message"]["content"].as_str()
        {
            Ok(content.to_string())
        } else if let Some(text) = response["output"]["text"].as_str() {
            Ok(text.to_string())
        } else {
            Err(AliyunAIError::ParseError(
                "Unable to parse response content".to_string(),
            ))
        }
    }

    fn parse_ohlcv_response(
        &self,
        content: &str,
        expected_count: usize,
    ) -> Result<Vec<OHLCV>, AliyunAIError> {
        let json_match = regex::Regex::new(r"\[[\s\S]*\]")
            .unwrap()
            .find(content)
            .map(|m| m.as_str());
        let json_str = json_match.unwrap_or(content);
        let parsed: Vec<serde_json::Value> = serde_json::from_str(json_str)
            .map_err(|e| AliyunAIError::ParseError(format!("Failed to parse JSON: {}", e)))?;
        let mut result = Vec::new();
        for (i, item) in parsed.iter().enumerate() {
            let obj = item.as_object().ok_or_else(|| {
                AliyunAIError::ParseError(format!("Element {} is not an object", i))
            })?;
            let open = obj.get("open").and_then(|v| v.as_f64()).ok_or_else(|| {
                AliyunAIError::ParseError(format!("Element {} missing or invalid 'open' field", i))
            })?;
            let high = obj.get("high").and_then(|v| v.as_f64()).ok_or_else(|| {
                AliyunAIError::ParseError(format!("Element {} missing or invalid 'high' field", i))
            })?;
            let low = obj.get("low").and_then(|v| v.as_f64()).ok_or_else(|| {
                AliyunAIError::ParseError(format!("Element {} missing or invalid 'low' field", i))
            })?;
            let close = obj.get("close").and_then(|v| v.as_f64()).ok_or_else(|| {
                AliyunAIError::ParseError(format!("Element {} missing or invalid 'close' field", i))
            })?;
            let volume = obj.get("volume").and_then(|v| v.as_f64()).ok_or_else(|| {
                AliyunAIError::ParseError(format!(
                    "Element {} missing or invalid 'volume' field",
                    i
                ))
            })?;
            if high < low {
                return Err(AliyunAIError::ParseError(format!(
                    "Element {}: high cannot be lower than low",
                    i
                )));
            }
            if close < low || close > high {
                return Err(AliyunAIError::ParseError(format!(
                    "Element {}: close must be between low and high",
                    i
                )));
            }
            if volume < 0.0 {
                return Err(AliyunAIError::ParseError(format!(
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
            return Err(AliyunAIError::ParseError(format!(
                "AI returned {} OHLCV objects, but expected {}",
                result.len(),
                expected_count
            )));
        }
        Ok(result)
    }
}
