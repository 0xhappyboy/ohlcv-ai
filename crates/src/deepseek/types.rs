pub type DeepSeekStreamCallback = Box<dyn FnMut(String, bool) + Send>;

#[derive(Debug, thiserror::Error)]
pub enum DeepSeekError {
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
    
    #[error("Rate limit exceeded: {0}")]
    RateLimitError(String),
    
    #[error("Authentication failed: {0}")]
    AuthError(String),
    
    #[error("Context length exceeded: {0}")]
    ContextLengthError(String),
}