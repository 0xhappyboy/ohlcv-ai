use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum AliYunModelType {
    QWEN_TURBO,
    QWEN_PLUS,
    QWEN_MAX,
    QWEN_MAX_LONGCONTEXT,
    QWEN_2_5B,
    QWEN_2_5B_INSTRUCT,
    QWEN_2_5B_7B,
    QWEN_2_5B_7B_INSTRUCT,
    QWEN_2_5B_14B,
    QWEN_2_5B_14B_INSTRUCT,
    QWEN_2_5B_32B,
    QWEN_2_5B_32B_INSTRUCT,
    QWEN_2_5B_72B,
    QWEN_2_5B_72B_INSTRUCT,
    QWEN_2_5B_CODER,
    QWEN_2_5B_CODER_7B,
    QWEN_2_5B_CODER_14B,
    QWEN_2_5B_CODER_32B,
    QWEN_VL_LITE,
    QWEN_VL_PLUS,
    QWEN_VL_MAX,
    QWEN_AUDIO_TURBO,
    QWEN_AUDIO_CHAT,
    QWEN_MATH_7B,
    LLAMA2_7B_CHAT_V2,
    BAICHUAN2_7B_CHAT_V1,
    QWEN_FINANCIAL,
    QWEN_FINANCIAL_14B,
    QWEN_FINANCIAL_32B,
    QWEN_MEDICAL,
    QWEN_MEDICAL_14B,
    QWEN_MEDICAL_32B,
    QWEN_OMNI,
    QWEN_OMNI_PRO,
}

impl AliYunModelType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::QWEN_TURBO => "qwen-turbo",
            Self::QWEN_PLUS => "qwen-plus",
            Self::QWEN_MAX => "qwen-max",
            Self::QWEN_MAX_LONGCONTEXT => "qwen-max-longcontext",
            Self::QWEN_2_5B => "qwen2.5-0.5b",
            Self::QWEN_2_5B_INSTRUCT => "qwen2.5-0.5b-instruct",
            Self::QWEN_2_5B_7B => "qwen2.5-7b",
            Self::QWEN_2_5B_7B_INSTRUCT => "qwen2.5-7b-instruct",
            Self::QWEN_2_5B_14B => "qwen2.5-14b",
            Self::QWEN_2_5B_14B_INSTRUCT => "qwen2.5-14b-instruct",
            Self::QWEN_2_5B_32B => "qwen2.5-32b",
            Self::QWEN_2_5B_32B_INSTRUCT => "qwen2.5-32b-instruct",
            Self::QWEN_2_5B_72B => "qwen2.5-72b",
            Self::QWEN_2_5B_72B_INSTRUCT => "qwen2.5-72b-instruct",
            Self::QWEN_2_5B_CODER => "qwen2.5-coder",
            Self::QWEN_2_5B_CODER_7B => "qwen2.5-coder-7b",
            Self::QWEN_2_5B_CODER_14B => "qwen2.5-coder-14b",
            Self::QWEN_2_5B_CODER_32B => "qwen2.5-coder-32b",
            Self::QWEN_VL_LITE => "qwen-vl-lite",
            Self::QWEN_VL_PLUS => "qwen-vl-plus",
            Self::QWEN_VL_MAX => "qwen-vl-max",
            Self::QWEN_AUDIO_TURBO => "qwen-audio-turbo",
            Self::QWEN_AUDIO_CHAT => "qwen-audio-chat",
            Self::QWEN_MATH_7B => "qwen-math-7b",
            Self::LLAMA2_7B_CHAT_V2 => "llama2-7b-chat-v2",
            Self::BAICHUAN2_7B_CHAT_V1 => "baichuan2-7b-chat-v1",
            Self::QWEN_FINANCIAL => "qwen-financial",
            Self::QWEN_FINANCIAL_14B => "qwen-financial-14b",
            Self::QWEN_FINANCIAL_32B => "qwen-financial-32b",
            Self::QWEN_MEDICAL => "qwen-medical",
            Self::QWEN_MEDICAL_14B => "qwen-medical-14b",
            Self::QWEN_MEDICAL_32B => "qwen-medical-32b",
            Self::QWEN_OMNI => "qwen-omni",
            Self::QWEN_OMNI_PRO => "qwen-omni-pro",
        }
    }
    
    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "qwen-turbo" => Some(Self::QWEN_TURBO),
            "qwen-plus" => Some(Self::QWEN_PLUS),
            "qwen-max" => Some(Self::QWEN_MAX),
            "qwen-max-longcontext" => Some(Self::QWEN_MAX_LONGCONTEXT),
            "qwen2.5-0.5b" => Some(Self::QWEN_2_5B),
            "qwen2.5-0.5b-instruct" => Some(Self::QWEN_2_5B_INSTRUCT),
            "qwen2.5-7b" => Some(Self::QWEN_2_5B_7B),
            "qwen2.5-7b-instruct" => Some(Self::QWEN_2_5B_7B_INSTRUCT),
            "qwen2.5-14b" => Some(Self::QWEN_2_5B_14B),
            "qwen2.5-14b-instruct" => Some(Self::QWEN_2_5B_14B_INSTRUCT),
            "qwen2.5-32b" => Some(Self::QWEN_2_5B_32B),
            "qwen2.5-32b-instruct" => Some(Self::QWEN_2_5B_32B_INSTRUCT),
            "qwen2.5-72b" => Some(Self::QWEN_2_5B_72B),
            "qwen2.5-72b-instruct" => Some(Self::QWEN_2_5B_72B_INSTRUCT),
            "qwen2.5-coder" => Some(Self::QWEN_2_5B_CODER),
            "qwen2.5-coder-7b" => Some(Self::QWEN_2_5B_CODER_7B),
            "qwen2.5-coder-14b" => Some(Self::QWEN_2_5B_CODER_14B),
            "qwen2.5-coder-32b" => Some(Self::QWEN_2_5B_CODER_32B),
            "qwen-vl-lite" => Some(Self::QWEN_VL_LITE),
            "qwen-vl-plus" => Some(Self::QWEN_VL_PLUS),
            "qwen-vl-max" => Some(Self::QWEN_VL_MAX),
            "qwen-audio-turbo" => Some(Self::QWEN_AUDIO_TURBO),
            "qwen-audio-chat" => Some(Self::QWEN_AUDIO_CHAT),
            "qwen-math-7b" => Some(Self::QWEN_MATH_7B),
            "llama2-7b-chat-v2" => Some(Self::LLAMA2_7B_CHAT_V2),
            "baichuan2-7b-chat-v1" => Some(Self::BAICHUAN2_7B_CHAT_V1),
            "qwen-financial" => Some(Self::QWEN_FINANCIAL),
            "qwen-financial-14b" => Some(Self::QWEN_FINANCIAL_14B),
            "qwen-financial-32b" => Some(Self::QWEN_FINANCIAL_32B),
            "qwen-medical" => Some(Self::QWEN_MEDICAL),
            "qwen-medical-14b" => Some(Self::QWEN_MEDICAL_14B),
            "qwen-medical-32b" => Some(Self::QWEN_MEDICAL_32B),
            "qwen-omni" => Some(Self::QWEN_OMNI),
            "qwen-omni-pro" => Some(Self::QWEN_OMNI_PRO),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ApiFormat {
    OpenAI,
    DashScope,
}

#[derive(Debug, Clone)]
pub struct Model {
    pub name: String,
    pub display_name: String,
    pub endpoint: String,
    pub endpoints: Vec<String>,
    pub format: ApiFormat,
    pub description: Option<String>,
    pub max_tokens: Option<u32>,
    pub context_length: Option<u32>,
    pub capabilities: Vec<String>,
}

pub fn get_aliyun_models() -> HashMap<AliYunModelType, Model> {
    let mut models = HashMap::new();
    
    // Qwen-Turbo
    models.insert(
        AliYunModelType::QWEN_TURBO,
        Model {
            name: "qwen-turbo".to_string(),
            display_name: "Qwen-Turbo".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
                "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Lightweight version, fast response speed, suitable for general conversation scenarios".to_string()),
            max_tokens: Some(2000),
            context_length: Some(8000),
            capabilities: vec!["text-generation".to_string(), "chat".to_string()],
        },
    );
    
    // Qwen-Plus
    models.insert(
        AliYunModelType::QWEN_PLUS,
        Model {
            name: "qwen-plus".to_string(),
            display_name: "Qwen-Plus".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Enhanced version, suitable for complex tasks and long text processing".to_string()),
            max_tokens: Some(6000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "chat".to_string(), "reasoning".to_string()],
        },
    );
    
    // Qwen-Max
    models.insert(
        AliYunModelType::QWEN_MAX,
        Model {
            name: "qwen-max".to_string(),
            display_name: "Qwen-Max".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Maximum version, strongest capabilities, suitable for high-demand professional tasks".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "chat".to_string(), "reasoning".to_string(), "coding".to_string(), "analysis".to_string()],
        },
    );
    
    // Qwen-Max-LongContext
    models.insert(
        AliYunModelType::QWEN_MAX_LONGCONTEXT,
        Model {
            name: "qwen-max-longcontext".to_string(),
            display_name: "Qwen-Max-LongContext".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Supports 128K long context, suitable for long document processing".to_string()),
            max_tokens: Some(8000),
            context_length: Some(128000),
            capabilities: vec!["text-generation".to_string(), "chat".to_string(), "document-analysis".to_string()],
        },
    );
    
    // Qwen2.5-0.5B
    models.insert(
        AliYunModelType::QWEN_2_5B,
        Model {
            name: "qwen2.5-0.5b".to_string(),
            display_name: "Qwen2.5-0.5B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Ultra-lightweight 0.5B parameter model for edge devices".to_string()),
            max_tokens: Some(4000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "chat".to_string()],
        },
    );
    
    // Qwen2.5-0.5B-Instruct
    models.insert(
        AliYunModelType::QWEN_2_5B_INSTRUCT,
        Model {
            name: "qwen2.5-0.5b-instruct".to_string(),
            display_name: "Qwen2.5-0.5B-Instruct".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Instruction-tuned 0.5B model for specific tasks".to_string()),
            max_tokens: Some(4000),
            context_length: Some(32000),
            capabilities: vec!["instruction-following".to_string(), "chat".to_string()],
        },
    );
    
    // Qwen2.5-7B
    models.insert(
        AliYunModelType::QWEN_2_5B_7B,
        Model {
            name: "qwen2.5-7b".to_string(),
            display_name: "Qwen2.5-7B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("7B parameter base model, balanced performance and efficiency".to_string()),
            max_tokens: Some(6000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "reasoning".to_string()],
        },
    );
    
    // Qwen2.5-7B-Instruct
    models.insert(
        AliYunModelType::QWEN_2_5B_7B_INSTRUCT,
        Model {
            name: "qwen2.5-7b-instruct".to_string(),
            display_name: "Qwen2.5-7B-Instruct".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Instruction-tuned 7B model for chat and tasks".to_string()),
            max_tokens: Some(6000),
            context_length: Some(32000),
            capabilities: vec!["chat".to_string(), "instruction-following".to_string(), "coding".to_string()],
        },
    );
    
    // Qwen2.5-14B
    models.insert(
        AliYunModelType::QWEN_2_5B_14B,
        Model {
            name: "qwen2.5-14b".to_string(),
            display_name: "Qwen2.5-14B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("14B parameter model with enhanced capabilities".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "analysis".to_string(), "reasoning".to_string()],
        },
    );
    
    // Qwen2.5-14B-Instruct
    models.insert(
        AliYunModelType::QWEN_2_5B_14B_INSTRUCT,
        Model {
            name: "qwen2.5-14b-instruct".to_string(),
            display_name: "Qwen2.5-14B-Instruct".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Instruction-tuned 14B model with enhanced capabilities".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "analysis".to_string(), "reasoning".to_string(), "instruction-following".to_string()],
        },
    );
    
    // Qwen2.5-32B
    models.insert(
        AliYunModelType::QWEN_2_5B_32B,
        Model {
            name: "qwen2.5-32b".to_string(),
            display_name: "Qwen2.5-32B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("32B parameter high-performance model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "complex-reasoning".to_string(), "analysis".to_string()],
        },
    );
    
    // Qwen2.5-32B-Instruct
    models.insert(
        AliYunModelType::QWEN_2_5B_32B_INSTRUCT,
        Model {
            name: "qwen2.5-32b-instruct".to_string(),
            display_name: "Qwen2.5-32B-Instruct".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Instruction-tuned 32B high-performance model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "complex-reasoning".to_string(), "analysis".to_string(), "instruction-following".to_string()],
        },
    );
    
    // Qwen2.5-72B
    models.insert(
        AliYunModelType::QWEN_2_5B_72B,
        Model {
            name: "qwen2.5-72b".to_string(),
            display_name: "Qwen2.5-72B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("72B parameter state-of-the-art model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "expert-analysis".to_string(), "research".to_string()],
        },
    );
    
    // Qwen2.5-72B-Instruct
    models.insert(
        AliYunModelType::QWEN_2_5B_72B_INSTRUCT,
        Model {
            name: "qwen2.5-72b-instruct".to_string(),
            display_name: "Qwen2.5-72B-Instruct".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Instruction-tuned 72B state-of-the-art model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["text-generation".to_string(), "expert-analysis".to_string(), "research".to_string(), "instruction-following".to_string()],
        },
    );
    
    // Qwen2.5-Coder
    models.insert(
        AliYunModelType::QWEN_2_5B_CODER,
        Model {
            name: "qwen2.5-coder".to_string(),
            display_name: "Qwen2.5-Coder".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Specialized code generation model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["code-generation".to_string(), "code-explanation".to_string(), "debugging".to_string()],
        },
    );
    
    // Qwen2.5-Coder-7B
    models.insert(
        AliYunModelType::QWEN_2_5B_CODER_7B,
        Model {
            name: "qwen2.5-coder-7b".to_string(),
            display_name: "Qwen2.5-Coder-7B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("7B parameter code generation model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["code-generation".to_string(), "programming".to_string()],
        },
    );
    
    // Qwen2.5-Coder-14B
    models.insert(
        AliYunModelType::QWEN_2_5B_CODER_14B,
        Model {
            name: "qwen2.5-coder-14b".to_string(),
            display_name: "Qwen2.5-Coder-14B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("14B parameter advanced code generation model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["code-generation".to_string(), "code-review".to_string(), "optimization".to_string()],
        },
    );
    
    // Qwen2.5-Coder-32B
    models.insert(
        AliYunModelType::QWEN_2_5B_CODER_32B,
        Model {
            name: "qwen2.5-coder-32b".to_string(),
            display_name: "Qwen2.5-Coder-32B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("32B parameter professional code generation model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["code-generation".to_string(), "code-review".to_string(), "optimization".to_string(), "software-architecture".to_string()],
        },
    );
    
    // Qwen-VL-Lite
    models.insert(
        AliYunModelType::QWEN_VL_LITE,
        Model {
            name: "qwen-vl-lite".to_string(),
            display_name: "Qwen-VL-Lite".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Lightweight vision-language model for basic image understanding".to_string()),
            max_tokens: Some(2000),
            context_length: Some(8000),
            capabilities: vec!["image-understanding".to_string(), "visual-qa".to_string()],
        },
    );
    
    // Qwen-VL-Plus
    models.insert(
        AliYunModelType::QWEN_VL_PLUS,
        Model {
            name: "qwen-vl-plus".to_string(),
            display_name: "Qwen-VL-Plus".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Vision-language model supporting image understanding".to_string()),
            max_tokens: Some(4000),
            context_length: Some(32000),
            capabilities: vec!["image-understanding".to_string(), "document-analysis".to_string(), "visual-reasoning".to_string()],
        },
    );
    
    // Qwen-VL-Max
    models.insert(
        AliYunModelType::QWEN_VL_MAX,
        Model {
            name: "qwen-vl-max".to_string(),
            display_name: "Qwen-VL-Max".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Most powerful vision-language model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["image-understanding".to_string(), "video-analysis".to_string(), "multimodal-reasoning".to_string()],
        },
    );
    
    // Qwen-Audio-Turbo
    models.insert(
        AliYunModelType::QWEN_AUDIO_TURBO,
        Model {
            name: "qwen-audio-turbo".to_string(),
            display_name: "Qwen-Audio-Turbo".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Fast audio processing and speech-to-text model".to_string()),
            max_tokens: Some(2000),
            context_length: Some(8000),
            capabilities: vec!["speech-recognition".to_string(), "audio-analysis".to_string()],
        },
    );
    
    // Qwen-Audio-Chat
    models.insert(
        AliYunModelType::QWEN_AUDIO_CHAT,
        Model {
            name: "qwen-audio-chat".to_string(),
            display_name: "Qwen-Audio-Chat".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Audio conversation and processing model".to_string()),
            max_tokens: Some(4000),
            context_length: Some(32000),
            capabilities: vec!["audio-chat".to_string(), "voice-assistant".to_string(), "speech-synthesis".to_string()],
        },
    );
    
    // Qwen-Math-7B
    models.insert(
        AliYunModelType::QWEN_MATH_7B,
        Model {
            name: "qwen-math-7b".to_string(),
            display_name: "Qwen-Math-7B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Specialized for mathematical reasoning and problem solving".to_string()),
            max_tokens: Some(4000),
            context_length: Some(32000),
            capabilities: vec!["mathematical-reasoning".to_string(), "problem-solving".to_string()],
        },
    );
    
    // LLaMA2-7B-Chat-V2
    models.insert(
        AliYunModelType::LLAMA2_7B_CHAT_V2,
        Model {
            name: "llama2-7b-chat-v2".to_string(),
            display_name: "LLaMA2-7B-Chat".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Meta's LLaMA2-7B model".to_string()),
            max_tokens: Some(2000),
            context_length: Some(8000),
            capabilities: vec!["chat".to_string(), "text-generation".to_string()],
        },
    );
    
    // Baichuan2-7B-Chat-V1
    models.insert(
        AliYunModelType::BAICHUAN2_7B_CHAT_V1,
        Model {
            name: "baichuan2-7b-chat-v1".to_string(),
            display_name: "Baichuan2-7B-Chat".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Baichuan AI's Baichuan2-7B model".to_string()),
            max_tokens: Some(2000),
            context_length: Some(8000),
            capabilities: vec!["chat".to_string(), "chinese-nlp".to_string()],
        },
    );
    
    // Qwen-Financial
    models.insert(
        AliYunModelType::QWEN_FINANCIAL,
        Model {
            name: "qwen-financial".to_string(),
            display_name: "Qwen-Financial".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Specialized for financial analysis and market insights".to_string()),
            max_tokens: Some(6000),
            context_length: Some(32000),
            capabilities: vec!["financial-analysis".to_string(), "market-prediction".to_string(), "risk-assessment".to_string()],
        },
    );
    
    // Qwen-Financial-14B
    models.insert(
        AliYunModelType::QWEN_FINANCIAL_14B,
        Model {
            name: "qwen-financial-14b".to_string(),
            display_name: "Qwen-Financial-14B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("14B parameter specialized financial analysis model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["financial-analysis".to_string(), "market-prediction".to_string(), "risk-assessment".to_string(), "quantitative-analysis".to_string()],
        },
    );
    
    // Qwen-Financial-32B
    models.insert(
        AliYunModelType::QWEN_FINANCIAL_32B,
        Model {
            name: "qwen-financial-32b".to_string(),
            display_name: "Qwen-Financial-32B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("32B parameter advanced financial analysis model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["financial-analysis".to_string(), "market-prediction".to_string(), "risk-assessment".to_string(), "quantitative-analysis".to_string(), "portfolio-optimization".to_string()],
        },
    );
    
    // Qwen-Medical
    models.insert(
        AliYunModelType::QWEN_MEDICAL,
        Model {
            name: "qwen-medical".to_string(),
            display_name: "Qwen-Medical".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Specialized for medical consultation and health analysis".to_string()),
            max_tokens: Some(6000),
            context_length: Some(32000),
            capabilities: vec!["medical-consultation".to_string(), "health-analysis".to_string(), "diagnostic-support".to_string()],
        },
    );
    
    // Qwen-Medical-14B
    models.insert(
        AliYunModelType::QWEN_MEDICAL_14B,
        Model {
            name: "qwen-medical-14b".to_string(),
            display_name: "Qwen-Medical-14B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("14B parameter specialized medical consultation model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["medical-consultation".to_string(), "health-analysis".to_string(), "diagnostic-support".to_string(), "medical-research".to_string()],
        },
    );
    
    // Qwen-Medical-32B
    models.insert(
        AliYunModelType::QWEN_MEDICAL_32B,
        Model {
            name: "qwen-medical-32b".to_string(),
            display_name: "Qwen-Medical-32B".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("32B parameter advanced medical consultation model".to_string()),
            max_tokens: Some(8000),
            context_length: Some(32000),
            capabilities: vec!["medical-consultation".to_string(), "health-analysis".to_string(), "diagnostic-support".to_string(), "medical-research".to_string(), "clinical-decision-support".to_string()],
        },
    );
    
    // Qwen-Omni
    models.insert(
        AliYunModelType::QWEN_OMNI,
        Model {
            name: "qwen-omni".to_string(),
            display_name: "Qwen-Omni".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Omnidirectional multimodal model supporting text, image, audio".to_string()),
            max_tokens: Some(8000),
            context_length: Some(64000),
            capabilities: vec!["text-generation".to_string(), "image-understanding".to_string(), "audio-processing".to_string(), "multimodal".to_string()],
        },
    );
    
    // Qwen-Omni-Pro
    models.insert(
        AliYunModelType::QWEN_OMNI_PRO,
        Model {
            name: "qwen-omni-pro".to_string(),
            display_name: "Qwen-Omni-Pro".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Professional omnidirectional multimodal model with advanced capabilities".to_string()),
            max_tokens: Some(16000),
            context_length: Some(128000),
            capabilities: vec!["text-generation".to_string(), "multimodal".to_string(), "complex-reasoning".to_string(), "expert-analysis".to_string()],
        },
    );
    
    models
}

pub fn get_model(model_type: AliYunModelType) -> Option<Model> {
    get_aliyun_models().get(&model_type).cloned()
}

pub fn get_model_by_name(name: &str) -> Option<Model> {
    get_aliyun_models()
        .values()
        .find(|m| m.name == name)
        .cloned()
}

pub fn get_all_models() -> Vec<Model> {
    get_aliyun_models().values().cloned().collect()
}

pub fn get_available_model_types() -> Vec<AliYunModelType> {
    get_aliyun_models().keys().cloned().collect()
}

// Helper functions for specific model categories
pub fn get_text_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| 
            model.capabilities.contains(&"text-generation".to_string()) && 
            !model.capabilities.contains(&"image-understanding".to_string()) &&
            !model.capabilities.contains(&"audio-processing".to_string())
        )
        .collect()
}

pub fn get_vision_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| 
            model.capabilities.contains(&"image-understanding".to_string())
        )
        .collect()
}

pub fn get_audio_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| 
            model.capabilities.contains(&"audio-processing".to_string()) ||
            model.capabilities.contains(&"speech-recognition".to_string())
        )
        .collect()
}

pub fn get_coding_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| 
            model.capabilities.contains(&"code-generation".to_string()) ||
            model.capabilities.contains(&"programming".to_string())
        )
        .collect()
}

pub fn get_specialized_models() -> Vec<Model> {
    let specialized_capabilities = vec![
        "financial-analysis".to_string(), 
        "medical-consultation".to_string(), 
        "mathematical-reasoning".to_string()
    ];
    get_all_models()
        .into_iter()
        .filter(|model| 
            model.capabilities.iter().any(|cap| specialized_capabilities.contains(cap))
        )
        .collect()
}

pub fn get_multimodal_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| 
            model.capabilities.contains(&"multimodal".to_string())
        )
        .collect()
}