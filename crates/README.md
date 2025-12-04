<h1 align="center">
    Ohlcv AI
</h1>
<h4 align="center">
🧠AI agents focused on processing ohlcv data structures.
</h4>
<p align="center">
  <a href="https://github.com/0xhappyboy/ohlcv-ai/tree/main/crates/LICENSE"><img src="https://img.shields.io/badge/License-Apache2.0-d1d1f6.svg?style=flat&labelColor=1C2C2E&color=BEC5C9&logo=googledocs&label=license&logoColor=BEC5C9" alt="License"></a>
</p>
<p align="center">
<a href="https://github.com/0xhappyboy/ohlcv-ai/blob/main/crates/README_zh-CN.md">简体中文</a> | <a href="https://github.com/0xhappyboy/ohlcv-ai/blob/main/crates/README.md">English</a>
</p>

# Aliyun

## Example

## Predicting ohlcv data

```rust
use aliyun_ai::AliyunAI;
use aliyun_ai::model::AliYunModelType;
use std::error::Error;
use tokio;

// OHLCV data structure (should match the library's OHLCV struct)
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct OHLCV {
    open: f64,
    high: f64,
    low: f64,
    close: f64,
    volume: f64,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // 1. Create Alibaba Cloud AI client
    let api_key = std::env::var("ALIYUN_API_KEY")
        .unwrap_or_else(|_| "your-api-key-here".to_string());

    let ai = AliyunAI::with_api_key(api_key)?;

    // 2. Prepare historical OHLCV data (sample data)
    let historical_data = vec![
        OHLCV {
            open: 100.0,
            high: 105.0,
            low: 98.0,
            close: 102.0,
            volume: 1000000.0,
        },
        OHLCV {
            open: 102.0,
            high: 108.0,
            low: 101.0,
            close: 106.0,
            volume: 1200000.0,
        },
        OHLCV {
            open: 106.0,
            high: 112.0,
            low: 104.0,
            close: 110.0,
            volume: 1500000.0,
        },
        OHLCV {
            open: 110.0,
            high: 115.0,
            low: 108.0,
            close: 113.0,
            volume: 1300000.0,
        },
        OHLCV {
            open: 113.0,
            high: 118.0,
            low: 111.0,
            close: 116.0,
            volume: 1400000.0,
        },
        OHLCV {
            open: 116.0,
            high: 122.0,
            low: 115.0,
            close: 120.0,
            volume: 1600000.0,
        },
        OHLCV {
            open: 120.0,
            high: 125.0,
            low: 118.0,
            close: 123.0,
            volume: 1700000.0,
        },
        OHLCV {
            open: 123.0,
            high: 128.0,
            low: 121.0,
            close: 126.0,
            volume: 1800000.0,
        },
        OHLCV {
            open: 126.0,
            high: 132.0,
            low: 124.0,
            close: 130.0,
            volume: 2000000.0,
        },
        OHLCV {
            open: 130.0,
            high: 135.0,
            low: 128.0,
            close: 133.0,
            volume: 1900000.0,
        },
    ];

    println!("Historical OHLCV Data ({} periods):", historical_data.len());
    for (i, data) in historical_data.iter().enumerate() {
        println!(
            "Period {}: O={:.2}, H={:.2}, L={:.2}, C={:.2}, V={:.0}",
            i + 1,
            data.open,
            data.high,
            data.low,
            data.close,
            data.volume
        );
    }

    // 3. Simple prediction (default instructions)
    println!("\n=== Simple Prediction (Next 1 Period) ===");
    let predictions = ai.predict_ohlcv(&historical_data, None, Some(1), None).await?;

    println!("Prediction Result (Next Period):");
    for (i, pred) in predictions.iter().enumerate() {
        println!(
            "Prediction {}: O={:.2}, H={:.2}, L={:.2}, C={:.2}, V={:.0}",
            i + 1,
            pred.open,
            pred.high,
            pred.low,
            pred.close,
            pred.volume
        );
    }

    // 4. Technical analysis prediction for multiple periods
    println!("\n=== Technical Analysis Prediction (Next 3 Periods) ===");
    let technical_instruction = "Based on these OHLCV data, perform technical analysis including trend identification, support/resistance levels, and momentum indicators. Provide realistic predictions that follow typical market patterns.";

    let predictions_3 = ai.predict_ohlcv(
        &historical_data,
        Some(technical_instruction),
        Some(3),
        None,
    ).await?;

    println!("Technical Analysis Prediction Results (Next 3 Periods):");
    for (i, pred) in predictions_3.iter().enumerate() {
        println!(
            "Prediction {}: O={:.2}, H={:.2}, L={:.2}, C={:.2}, V={:.0}",
            i + 1,
            pred.open,
            pred.high,
            pred.low,
            pred.close,
            pred.volume
        );
    }

    // 5. Professional prediction using financial model
    println!("\n=== Financial Model Prediction (Next 5 Periods) ===");

    // Create new configuration using financial model
    let config = aliyun_ai::AliyunConfig {
        api_key: ai.get_config().api_key.clone(),
        model_type: AliYunModelType::QWEN_FINANCIAL, // Use financial model
        timeout: std::time::Duration::from_secs(60),
        base_url: None,
    };

    let financial_ai = AliyunAI::new(config)?;

    let financial_instruction = "As a financial analysis expert, analyze this historical OHLCV data considering market trends, volatility patterns, and typical price behavior. Provide realistic future predictions that account for momentum, volume patterns, and typical market psychology.";

    let financial_predictions = financial_ai.predict_ohlcv(
        &historical_data,
        Some(financial_instruction),
        Some(5),
        None,
    ).await?;

    println!("Financial Model Prediction Results (Next 5 Periods):");
    for (i, pred) in financial_predictions.iter().enumerate() {
        println!(
            "Prediction {}: O={:.2}, H={:.2}, L={:.2}, C={:.2}, V={:.0}",
            i + 1,
            pred.open,
            pred.high,
            pred.low,
            pred.close,
            pred.volume
        );
    }

    // 6. Calculate prediction statistics
    if !financial_predictions.is_empty() {
        let avg_volume: f64 = financial_predictions.iter()
            .map(|p| p.volume)
            .sum::<f64>() / financial_predictions.len() as f64;

        let price_changes: Vec<f64> = financial_predictions.windows(2)
            .map(|w| (w[1].close - w[0].close) / w[0].close * 100.0)
            .collect();

        let avg_change: f64 = if !price_changes.is_empty() {
            price_changes.iter().sum::<f64>() / price_changes.len() as f64
        } else { 0.0 };

        println!("\n=== Prediction Statistics ===");
        println!("Number of Predicted Periods: {}", financial_predictions.len());
        println!("Average Predicted Volume: {:.0}", avg_volume);
        if !price_changes.is_empty() {
            println!("Average Price Change Rate: {:.2}%", avg_change);
        }

        // Calculate prediction range
        let all_closes: Vec<f64> = financial_predictions.iter()
            .map(|p| p.close)
            .collect();
        let min_close = all_closes.iter().fold(f64::INFINITY, |a, &b| a.min(b));
        let max_close = all_closes.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));
        let price_range = max_close - min_close;

        println!("Predicted Close Price Range: {:.2} - {:.2} (Range: {:.2})",
                 min_close, max_close, price_range);

        // Calculate volatility
        let returns_std = if price_changes.len() > 1 {
            let mean = price_changes.iter().sum::<f64>() / price_changes.len() as f64;
            let variance: f64 = price_changes.iter()
                .map(|x| (x - mean).powi(2))
                .sum::<f64>() / (price_changes.len() - 1) as f64;
            variance.sqrt()
        } else { 0.0 };

        println!("Predicted Volatility (Std Dev of Returns): {:.2}%", returns_std);
    }

    // 7. Connection test (optional)
    println!("\n=== Connection Test ===");
    match ai.test_connection().await {
        Ok((success, model, response)) => {
            if success {
                println!("Connection Successful! Model: {}, Response: {:?}", model, response);
            } else {
                println!("Connection Test Failed! Model: {}, Error: {:?}", model, response);
            }
        }
        Err(e) => println!("Connection Test Error: {}", e),
    }

    // 8. Example with custom options
    println!("\n=== Custom Options Example ===");
    let custom_options = aliyun_ai::ChatOptions {
        temperature: Some(0.2), // Lower temperature for more consistent predictions
        max_tokens: Some(2000),
        stream: false,
        system_prompt: None,
        model_type: Some(AliYunModelType::QWEN_PLUS), // Use Qwen-Plus model
    };

    let custom_predictions = ai.predict_ohlcv(
        &historical_data,
        Some("Predict next 2 periods based on current trend"),
        Some(2),
        Some(custom_options),
    ).await?;

    println!("Custom Options Prediction Results:");
    for (i, pred) in custom_predictions.iter().enumerate() {
        println!(
            "Prediction {}: O={:.2}, H={:.2}, L={:.2}, C={:.2}, V={:.0}",
            i + 1,
            pred.open,
            pred.high,
            pred.low,
            pred.close,
            pred.volume
        );
    }

    Ok(())
}

// Additional utility function for loading data from CSV
#[allow(dead_code)]
async fn load_ohlcv_from_csv(file_path: &str) -> Result<Vec<OHLCV>, Box<dyn Error>> {
    use csv::ReaderBuilder;

    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_path(file_path)?;

    let mut data = Vec::new();

    for result in rdr.deserialize() {
        let record: OHLCV = result?;
        data.push(record);
    }

    Ok(data)
}

// Example showing error handling
#[allow(dead_code)]
async fn predict_with_error_handling() {
    let ai = match AliyunAI::with_api_key("test-key".to_string()) {
        Ok(client) => client,
        Err(e) => {
            eprintln!("Failed to create client: {}", e);
            return;
        }
    };

    let sample_data = vec![OHLCV {
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 102.0,
        volume: 1000000.0,
    }];

    match ai.predict_ohlcv(&sample_data, None, Some(1), None).await {
        Ok(predictions) => {
            println!("Prediction successful: {:?}", predictions);
        }
        Err(aliyun_ai::AliyunAIError::ConfigError(msg)) => {
            eprintln!("Configuration error: {}", msg);
        }
        Err(aliyun_ai::AliyunAIError::ApiError(msg)) => {
            eprintln!("API error: {}", msg);
        }
        Err(aliyun_ai::AliyunAIError::NetworkError(msg)) => {
            eprintln!("Network error: {}", msg);
        }
        Err(aliyun_ai::AliyunAIError::ParseError(msg)) => {
            eprintln!("Parse error: {}", msg);
        }
        Err(e) => {
            eprintln!("Other error: {}", e);
        }
    }
}
```

# DeepSeek

## Predicting ohlcv data

```rust
use deepseek_sdk::{DeepSeekAI, DeepSeekConfig, ChatOptions};
use deepseek_sdk::model::DeepSeekModelType;
use deepseek_sdk::types::OHLCV;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = DeepSeekConfig {
        api_key: "your-deepseek-api-key".to_string(),
        model_type: DeepSeekModelType::DeepSeekFinancial,
        ..Default::default()
    };
    let ai = DeepSeekAI::new(config)?;
    let historical_data = vec![
        OHLCV { open: 100.0, high: 105.0, low: 98.0, close: 102.0, volume: 1000000.0 },
        OHLCV { open: 102.0, high: 108.0, low: 101.0, close: 106.0, volume: 1200000.0 },
        OHLCV { open: 106.0, high: 110.0, low: 104.0, close: 108.0, volume: 1100000.0 },
    ];
    let predictions = ai.predict_ohlcv(
        &historical_data,
        Some("Predicting future price trends based on technical analysis"),
        Some(3),
        None
    ).await?;
    println!("Predictions: {:?}", predictions);
    Ok(())
}
```
