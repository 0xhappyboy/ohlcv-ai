# Ohlcv AI

🧠AI agents focused on processing ohlcv data structures.

# Aliyun

## Example 1

```rust
use aliyun_ai::AliyunAI;
use aliyun_ai::model::AliYunModelType;
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // create client
    let ai = AliyunAI::with_api_key("your-api-key".to_string())?;
    // chat
    let response = ai.chat("hello!", None).await?;
    println!("Response: {}", response);
    let ohlcv_data = vec![]; // OHLCV type
    let predictions = ai.predict_ohlcv(&ohlcv_data, None, Some(5), None).await?;
    Ok(())
}
```

## Example 2

```rust
use aliyun_ai::{AliyunAI, create_aliyun_ai};
use aliyun_ai::model::AliYunModelType;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let ai = create_aliyun_ai("your-api-key".to_string(), Some(AliYunModelType::QWEN_TURBO))?;
    // chat
    let response = ai.chat("hello!", None).await?;
    println!("Response: {}", response);
    let config = aliyun_ai::AliyunConfig {
        api_key: "your-api-key".to_string(),
        model_type: AliYunModelType::QWEN_PLUS,
        timeout: std::time::Duration::from_secs(60),
        base_url: None,
    };
    let ai2 = AliyunAI::new(config)?;
    Ok(())
}
```
