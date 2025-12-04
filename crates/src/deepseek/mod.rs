//!
//! ### Example 1: Basic Dialogue
//!
//! ```rust,no_run
//! use deepseek_sdk::DeepSeekAI;
//! use deepseek_sdk::model::DeepSeekModelType;
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let ai = DeepSeekAI::with_api_key("your-deepseek-api-key".to_string())?;
//!     let response = ai.chat("hello！", None).await?;
//!     println!("Response: {}", response);
//!     Ok(())
//! }
//! ```
//!
//! ### Example 2: Streaming Dialogue
//!
//! ```rust,no_run
//! use deepseek_sdk::{DeepSeekAI, DeepSeekStreamCallback};
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let ai = DeepSeekAI::with_api_key("your-deepseek-api-key".to_string())?;
//!     let messages = vec![
//!         ChatMessage {
//!             role: ChatRole::System,
//!             content: "hello".to_string(),
//!         },
//!         ChatMessage {
//!             role: ChatRole::User,
//!             content: "hello".to_string(),
//!         },
//!     ];
//!     let callback: DeepSeekStreamCallback = Box::new(|chunk, done| {
//!         if !done {
//!             print!("{}", chunk);
//!         } else {
//!             println!("\n\n[Stream completed]");
//!         }
//!     });
//!     ai.chat_stream(&messages, callback, None).await?;
//!     Ok(())
//! }
//! ```
//!
//! ### Example 3: Financial Forecasting
//!
//! ```rust,no_run
//! use deepseek_sdk::{DeepSeekAI, DeepSeekConfig, ChatOptions};
//! use deepseek_sdk::model::DeepSeekModelType;
//! use deepseek_sdk::types::OHLCV;
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let config = DeepSeekConfig {
//!         api_key: "your-deepseek-api-key".to_string(),
//!         model_type: DeepSeekModelType::DeepSeekFinancial,
//!         ..Default::default()
//!     };
//!     
//!     let ai = DeepSeekAI::new(config)?;
//!     
//!     let historical_data = vec![
//!         OHLCV { open: 100.0, high: 105.0, low: 98.0, close: 102.0, volume: 1000000.0 },
//!         OHLCV { open: 102.0, high: 108.0, low: 101.0, close: 106.0, volume: 1200000.0 },
//!         OHLCV { open: 106.0, high: 110.0, low: 104.0, close: 108.0, volume: 1100000.0 },
//!     ];
//!     
//!     let predictions = ai.predict_ohlcv(
//!         &historical_data,
//!         Some("Predicting future price trends based on technical analysis"),
//!         Some(3),
//!         None
//!     ).await?;
//!     
//!     println!("Predictions: {:?}", predictions);
//!     
//!     Ok(())
//! }
//! ```
//!
//! ### Example 4: Custom Configuration
//!
//! ```rust,no_run
//! use deepseek_sdk::{DeepSeekAI, DeepSeekConfig, ChatOptions};
//! use deepseek_sdk::model::DeepSeekModelType;
//! use std::time::Duration;
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let config = DeepSeekConfig {
//!         api_key: "your-deepseek-api-key".to_string(),
//!         model_type: DeepSeekModelType::DeepSeekCoder,
//!         timeout: Duration::from_secs(120),
//!         base_url: Some("https://api.deepseek.com".to_string()),
//!         organization_id: Some("org-123".to_string()),
//!         project_id: Some("proj-456".to_string()),
//!     };
//!     let ai = DeepSeekAI::new(config)?;
//!     let options = ChatOptions {
//!         temperature: Some(0.3),
//!         max_tokens: Some(4096),
//!         top_p: Some(0.95),
//!         stream: false,
//!         system_prompt: Some("You are a professional Rust programming assistant".to_string()),
//!         model_type: Some(DeepSeekModelType::DeepSeekCoder),
//!         ..Default::default()
//!     };
//!     let response = ai.chat("How to implement an efficient Rust hash table?", Some(options)).await?;
//!     println!("Response: {}", response);
//!     Ok(())
//! }
//! ```
pub mod client;
pub mod model;
pub mod types;

pub use client::{ChatOptions, DeepSeekAI, DeepSeekConfig};
pub use model::{DeepSeekModelType, get_all_models, get_available_model_types, get_model};
pub use types::DeepSeekError;

/// Quickly create a DeepSeek AI client
///
/// # Params
/// - `api_key`: DeepSeek api key
/// - `model_type`: Optional, model type, defaults to DeepSeekChat
///
/// # Example
/// ```rust
/// use deepseek_sdk::{create_deepseek_ai, DeepSeekModelType};
///
/// let ai = create_deepseek_ai(
///     "your-api-key".to_string(),
///     Some(DeepSeekModelType::DeepSeekCoder)
/// )?;
/// ```
pub fn create_deepseek_ai(
    api_key: String,
    model_type: Option<DeepSeekModelType>,
) -> Result<DeepSeekAI, DeepSeekError> {
    let config = DeepSeekConfig {
        api_key,
        model_type: model_type.unwrap_or(DeepSeekModelType::DeepSeekChat),
        ..Default::default()
    };
    DeepSeekAI::new(config)
}

/// Create a DeepSeek AI client (free model) using the default configuration.
pub fn create_default_deepseek_ai(api_key: String) -> Result<DeepSeekAI, DeepSeekError> {
    DeepSeekAI::with_api_key(api_key)
}

pub use crate::types::{ChatMessage, ChatRole, OHLCV};
