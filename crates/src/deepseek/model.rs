use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum DeepSeekModelType {
    DeepSeekChat,
    DeepSeekCoder,
    DeepSeekReasoner,
    DeepSeekMath,
    DeepSeekFinancial,
    DeepSeekMedical,
    DeepSeekCreative,
    DeepSeekEnterprise,
    DeepSeekOmni,
}

impl DeepSeekModelType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::DeepSeekChat => "deepseek-chat",
            Self::DeepSeekCoder => "deepseek-coder",
            Self::DeepSeekReasoner => "deepseek-reasoner",
            Self::DeepSeekMath => "deepseek-math",
            Self::DeepSeekFinancial => "deepseek-financial",
            Self::DeepSeekMedical => "deepseek-medical",
            Self::DeepSeekCreative => "deepseek-creative",
            Self::DeepSeekEnterprise => "deepseek-enterprise",
            Self::DeepSeekOmni => "deepseek-omni",
        }
    }
    
    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "deepseek-chat" => Some(Self::DeepSeekChat),
            "deepseek-coder" => Some(Self::DeepSeekCoder),
            "deepseek-reasoner" => Some(Self::DeepSeekReasoner),
            "deepseek-math" => Some(Self::DeepSeekMath),
            "deepseek-financial" => Some(Self::DeepSeekFinancial),
            "deepseek-medical" => Some(Self::DeepSeekMedical),
            "deepseek-creative" => Some(Self::DeepSeekCreative),
            "deepseek-enterprise" => Some(Self::DeepSeekEnterprise),
            "deepseek-omni" => Some(Self::DeepSeekOmni),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ApiFormat {
    OpenAI,
    DeepSeekNative,
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
    pub is_free_tier: bool,
    pub supports_streaming: bool,
    pub supports_function_calling: bool,
}

pub fn get_deepseek_models() -> HashMap<DeepSeekModelType, Model> {
    let mut models = HashMap::new();
    // DeepSeek-Chat
    models.insert(
        DeepSeekModelType::DeepSeekChat,
        Model {
            name: "deepseek-chat".to_string(),
            display_name: "DeepSeek Chat".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("A general-purpose dialogue model with excellent performance, suitable for everyday conversations and question-and-answer sessions.".to_string()),
            max_tokens: Some(4096),
            context_length: Some(16384),
            capabilities: vec![
                "chat".to_string(),
                "text-generation".to_string(),
                "qa".to_string(),
                "translation".to_string(),
                "summarization".to_string(),
            ],
            is_free_tier: true,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    // DeepSeek-Coder
    models.insert(
        DeepSeekModelType::DeepSeekCoder,
        Model {
            name: "deepseek-coder".to_string(),
            display_name: "DeepSeek Coder".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Professional code generation model, supporting multiple programming languages.".to_string()),
            max_tokens: Some(8192),
            context_length: Some(32768),
            capabilities: vec![
                "code-generation".to_string(),
                "code-completion".to_string(),
                "debugging".to_string(),
                "code-explanation".to_string(),
                "refactoring".to_string(),
            ],
            is_free_tier: false,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    // DeepSeek-Reasoner
    models.insert(
        DeepSeekModelType::DeepSeekReasoner,
        Model {
            name: "deepseek-reasoner".to_string(),
            display_name: "DeepSeek Reasoner".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Deep reasoning models are suitable for complex logic analysis and problem solving.".to_string()),
            max_tokens: Some(8192),
            context_length: Some(32768),
            capabilities: vec![
                "complex-reasoning".to_string(),
                "problem-solving".to_string(),
                "logical-analysis".to_string(),
                "decision-making".to_string(),
            ],
            is_free_tier: false,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    // DeepSeek-Math
    models.insert(
        DeepSeekModelType::DeepSeekMath,
        Model {
            name: "deepseek-math".to_string(),
            display_name: "DeepSeek Math".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("A specialized mathematical model that supports complex mathematical calculations and proofs.".to_string()),
            max_tokens: Some(4096),
            context_length: Some(16384),
            capabilities: vec![
                "mathematical-reasoning".to_string(),
                "calculation".to_string(),
                "proof-generation".to_string(),
                "scientific-computing".to_string(),
            ],
            is_free_tier: false,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    // DeepSeek-Financial
    models.insert(
        DeepSeekModelType::DeepSeekFinancial,
        Model {
            name: "deepseek-financial".to_string(),
            display_name: "DeepSeek Financial".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Dedicated financial analysis models to support market analysis and forecasting.".to_string()),
            max_tokens: Some(8192),
            context_length: Some(32768),
            capabilities: vec![
                "financial-analysis".to_string(),
                "market-prediction".to_string(),
                "risk-assessment".to_string(),
                "portfolio-optimization".to_string(),
                "financial-reporting".to_string(),
            ],
            is_free_tier: false,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    // DeepSeek-Medical
    models.insert(
        DeepSeekModelType::DeepSeekMedical,
        Model {
            name: "deepseek-medical".to_string(),
            display_name: "DeepSeek Medical".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("A dedicated medical and health model that supports diagnostic assistance and health consultation.".to_string()),
            max_tokens: Some(8192),
            context_length: Some(32768),
            capabilities: vec![
                "medical-consultation".to_string(),
                "diagnostic-support".to_string(),
                "health-analysis".to_string(),
                "medical-research".to_string(),
            ],
            is_free_tier: false,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    // DeepSeek-Creative
    models.insert(
        DeepSeekModelType::DeepSeekCreative,
        Model {
            name: "deepseek-creative".to_string(),
            display_name: "DeepSeek Creative".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Creative writing model, suitable for story writing, poetry and creative content.".to_string()),
            max_tokens: Some(16384),
            context_length: Some(65536),
            capabilities: vec![
                "creative-writing".to_string(),
                "story-generation".to_string(),
                "poetry".to_string(),
                "content-creation".to_string(),
                "marketing-copy".to_string(),
            ],
            is_free_tier: false,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    // DeepSeek-Enterprise
    models.insert(
        DeepSeekModelType::DeepSeekEnterprise,
        Model {
            name: "deepseek-enterprise".to_string(),
            display_name: "DeepSeek Enterprise".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("Enterprise-grade model, highest performance, suitable for mission-critical applications".to_string()),
            max_tokens: Some(32768),
            context_length: Some(131072),
            capabilities: vec![
                "enterprise-ai".to_string(),
                "business-intelligence".to_string(),
                "data-analysis".to_string(),
                "document-processing".to_string(),
                "decision-support".to_string(),
            ],
            is_free_tier: false,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    // DeepSeek-Omni
    models.insert(
        DeepSeekModelType::DeepSeekOmni,
        Model {
            name: "deepseek-omni".to_string(),
            display_name: "DeepSeek Omni".to_string(),
            endpoint: "https://api.deepseek.com/v1/chat/completions".to_string(),
            endpoints: vec![
                "https://api.deepseek.com/v1/chat/completions".to_string(),
            ],
            format: ApiFormat::OpenAI,
            description: Some("An all-around model that balances performance and cost, suitable for a variety of application scenarios.".to_string()),
            max_tokens: Some(16384),
            context_length: Some(65536),
            capabilities: vec![
                "multipurpose".to_string(),
                "general-ai".to_string(),
                "versatile".to_string(),
                "balanced-performance".to_string(),
            ],
            is_free_tier: false,
            supports_streaming: true,
            supports_function_calling: true,
        },
    );
    models
}

pub fn get_model(model_type: DeepSeekModelType) -> Option<Model> {
    get_deepseek_models().get(&model_type).cloned()
}

pub fn get_model_by_name(name: &str) -> Option<Model> {
    get_deepseek_models()
        .values()
        .find(|m| m.name == name)
        .cloned()
}

pub fn get_all_models() -> Vec<Model> {
    get_deepseek_models().values().cloned().collect()
}

pub fn get_available_model_types() -> Vec<DeepSeekModelType> {
    get_deepseek_models().keys().cloned().collect()
}

pub fn get_free_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| model.is_free_tier)
        .collect()
}

pub fn get_premium_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| !model.is_free_tier)
        .collect()
}

pub fn get_coding_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| model.capabilities.contains(&"code-generation".to_string()))
        .collect()
}

pub fn get_specialized_models() -> Vec<Model> {
    let specialized_capabilities = vec![
        "financial-analysis".to_string(),
        "medical-consultation".to_string(),
        "mathematical-reasoning".to_string(),
    ];
    get_all_models()
        .into_iter()
        .filter(|model| 
            model.capabilities.iter().any(|cap| specialized_capabilities.contains(cap))
        )
        .collect()
}

pub fn get_long_context_models() -> Vec<Model> {
    get_all_models()
        .into_iter()
        .filter(|model| model.context_length.unwrap_or(0) >= 32768)
        .collect()
}