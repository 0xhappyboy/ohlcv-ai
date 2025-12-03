//! # Example 1
//!
//! ```rust
//! use aliyun_ai::AliyunAI;
//! use aliyun_ai::model::AliYunModelType;
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     // create client
//!     let ai = AliyunAI::with_api_key("your-api-key".to_string())?;
//!     
//!     // chat
//!     let response = ai.chat("hello!", None).await?;
//!     println!("Response: {}", response);
//!     
//!     let ohlcv_data = vec![]; // OHLCV type
//!     let predictions = ai.predict_ohlcv(&ohlcv_data, None, Some(5), None).await?;
//!     
//!     Ok(())
//! }
//! ```
//!
//! # Example 2
//!
//! ```rust,no_run
//! use aliyun_ai::{AliyunAI, create_aliyun_ai};
//! use aliyun_ai::model::AliYunModelType;
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let ai = create_aliyun_ai("your-api-key".to_string(), Some(AliYunModelType::QWEN_TURBO))?;
//!     
//!     // chat
//!     let response = ai.chat("hello!", None).await?;
//!     println!("Response: {}", response);
//!     
//!     let config = aliyun_ai::AliyunConfig {
//!         api_key: "your-api-key".to_string(),
//!         model_type: AliYunModelType::QWEN_PLUS,
//!         timeout: std::time::Duration::from_secs(60),
//!         base_url: None,
//!     };
//!     
//!     let ai2 = AliyunAI::new(config)?;
//!     
//!     Ok(())
//! }
//! ```
pub mod client;
pub mod model;
pub mod types;

pub use client::{AliyunAI, AliyunConfig, ChatOptions};
pub use model::{AliYunModelType, get_all_models, get_available_model_types, get_model};
pub use types::AliyunAIError;

pub fn create_aliyun_ai(
    api_key: String,
    model_type: Option<AliYunModelType>,
) -> Result<AliyunAI, AliyunAIError> {
    let config = AliyunConfig {
        api_key,
        model_type: model_type.unwrap_or(AliYunModelType::QWEN_TURBO),
        ..Default::default()
    };
    AliyunAI::new(config)
}
