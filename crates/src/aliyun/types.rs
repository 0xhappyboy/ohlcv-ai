pub type AliyunStreamCallback = Box<dyn FnMut(String, bool) + Send>;

#[derive(Debug, thiserror::Error)]
pub enum AliyunAIError {
    #[error("API request failed: {0}")]
    ApiError(String),
    #[error("Network error: {0}")]
    NetworkError(String),
    #[error("Parse error: {0}")]
    ParseError(String),
    #[error("Invalid configuration: {0}")]
    ConfigError(String),
    #[error("Timeout: {0}")]
    TimeoutError(String),
    #[error("Model not supported: {0}")]
    ModelNotSupported(String),
    #[error("Streaming not supported")]
    StreamingNotSupported,
}
