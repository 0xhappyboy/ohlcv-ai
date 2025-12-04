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
<a href="./README_zh-CN.md">简体中文</a> | <a href="./README.md">English</a>
</p>

# Aliyun

## Predicting ohlcv data

```rust
use aliyun_ai::AliyunAI;
use aliyun_ai::model::AliYunModelType;
use std::error::Error;
use tokio;

// 定义OHLCV数据结构（确保与库中的OHLCV结构匹配）
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
    // 1. 创建阿里云AI客户端
    let api_key = std::env::var("ALIYUN_API_KEY")
        .unwrap_or_else(|_| "your-api-key-here".to_string());
    let ai = create_aliyun_ai(api_key, Some(AliYunModelType::QWEN_TURBO))?;
    // 2. 准备历史OHLCV数据（示例数据）
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
    // 3. 使用简单预测（默认指令）
    println!("\n=== 简单预测（未来1个周期）===");
    let predictions = ai.predict_ohlcv(&historical_data, None, Some(1), None).await?;
    println!("预测结果（下1个周期）:");
    for (i, pred) in predictions.iter().enumerate() {
        println!(
            "预测 {}: O={:.2}, H={:.2}, L={:.2}, C={:.2}, V={:.0}",
            i + 1,
            pred.open,
            pred.high,
            pred.low,
            pred.close,
            pred.volume
        );
    }
    // 4. 使用技术分析指令预测多个周期
    println!("\n=== 技术分析预测（未来3个周期）===");
    let technical_instruction = "Based on these OHLCV data, perform technical analysis including trend identification, support/resistance levels, and momentum indicators. Provide realistic predictions that follow typical market patterns.";
    let predictions_3 = ai.predict_ohlcv(
        &historical_data,
        Some(technical_instruction),
        Some(3),
        None,
    ).await?;
    println!("技术分析预测结果（下3个周期）:");
    for (i, pred) in predictions_3.iter().enumerate() {
        println!(
            "预测 {}: O={:.2}, H={:.2}, L={:.2}, C={:.2}, V={:.0}",
            i + 1,
            pred.open,
            pred.high,
            pred.low,
            pred.close,
            pred.volume
        );
    }
    // 5. 使用金融模型进行更专业的预测
    println!("\n=== 使用金融模型预测（未来5个周期）===");
    // 创建新的配置使用金融模型
    let config = aliyun_ai::AliyunConfig {
        api_key: ai.get_config().api_key.clone(),
        model_type: AliYunModelType::QWEN_FINANCIAL, // 使用金融专业模型
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
    println!("金融模型预测结果（下5个周期）:");
    for (i, pred) in financial_predictions.iter().enumerate() {
        println!(
            "预测 {}: O={:.2}, H={:.2}, L={:.2}, C={:.2}, V={:.0}",
            i + 1,
            pred.open,
            pred.high,
            pred.low,
            pred.close,
            pred.volume
        );
    }
    // 6. 计算预测统计信息
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
        println!("\n=== 预测统计信息 ===");
        println!("预测周期数: {}", financial_predictions.len());
        println!("平均预测成交量: {:.0}", avg_volume);
        if !price_changes.is_empty() {
            println!("平均价格变化率: {:.2}%", avg_change);
        }
        // 计算预测范围
        let all_closes: Vec<f64> = financial_predictions.iter()
            .map(|p| p.close)
            .collect();
        let min_close = all_closes.iter().fold(f64::INFINITY, |a, &b| a.min(b));
        let max_close = all_closes.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));
        let price_range = max_close - min_close;
        println!("预测收盘价范围: {:.2} - {:.2} (范围: {:.2})",
                 min_close, max_close, price_range);
    }
    // 7. 测试连接（可选）
    println!("\n=== 连接测试 ===");
    match ai.test_connection().await {
        Ok((success, model, response)) => {
            if success {
                println!("连接成功! 模型: {}, 响应: {:?}", model, response);
            } else {
                println!("连接测试失败! 模型: {}, 错误: {:?}", model, response);
            }
        }
        Err(e) => println!("连接测试出错: {}", e),
    }

    Ok(())
}
```

# DeepSeek

## 预测 OHLCV 数据

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
