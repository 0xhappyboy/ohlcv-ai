import { ChatMessage, OHLCV } from '..';
import { AliYunModelType, ALIYUN_MODELS } from './model';

// Minimal configuration
export interface AliyunConfig {
  apiKey: string;
  modelType?: AliYunModelType;
  timeout?: number;
}

// Chat options
export interface AliYunChatOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
  modelType?: AliYunModelType; // Add modelType option
}

// Streaming response callback
export type AliYunStreamCallback = (chunk: string, isEnd: boolean) => void;

export class AliyunAI {
  private apiKey: string;
  private modelType: AliYunModelType;
  private timeout: number;

  /**
   * Constructor - Minimal configuration
   * @param config.apiKey - API key (required)
   * @param config.modelType - Model type, default qwen-turbo
   * @param config.timeout - Timeout, default 30 seconds
   */
  constructor(config: AliyunConfig) {
    this.apiKey = config.apiKey;
    this.modelType = config.modelType || AliYunModelType.QWEN_TURBO;
    this.timeout = config.timeout || 30000;
    if (!this.apiKey) {
      throw new Error('API Key cannot be empty');
    }
    const modelConfig = ALIYUN_MODELS.get(this.modelType);
    if (!modelConfig) {
      throw new Error(`Unsupported model type: ${this.modelType}`);
    }
  }

  /**
 * Simplest method: single conversation
 * @param message - User message
 * @param i18n - Language restriction for AI response
 * @param options - Chat options
 * @returns AI response
 */
  async chat(message: string, i18n: 'en' | 'cn', options?: AliYunChatOptions): Promise<string> {
    const messages: ChatMessage[] = [];
    const languagePrompt = i18n === 'en' ? 'Please respond in English only.' :
      i18n === 'cn' ? '请使用中文回答。' : '';
    if (options?.systemPrompt || languagePrompt) {
      const systemMessage = [options?.systemPrompt, languagePrompt]
        .filter(Boolean)
        .join('\n');
      messages.push({ role: 'system', content: systemMessage });
    }
    messages.push({ role: 'user', content: message });
    const response = await this.chatCompletion(messages, i18n, {
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      stream: false,
      modelType: options?.modelType
    });
    return this.extractContent(response);
  }

  /**
   * Multi-turn conversation
   * @param messages - Message history
   * @param i18n - Language restriction for AI response
   * @param options - Chat options
   * @returns Complete API response
   */
  async chatCompletion(
    messages: ChatMessage[],
    i18n: 'en' | 'cn',
    options?: {
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
      modelType?: AliYunModelType;
    }
  ): Promise<any> {
    const modelType = options?.modelType || this.modelType;
    const modelConfig = ALIYUN_MODELS.get(modelType);
    if (!modelConfig) {
      throw new Error(`Unsupported model type: ${modelType}`);
    }
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens ?? 1000;
    const stream = options?.stream ?? false;
    const languagePrompt = i18n === 'en' ? 'Please respond in English only.' :
      i18n === 'cn' ? '请使用中文回答。' : '';
    if (languagePrompt) {
      const hasSystemMessage = messages.some(msg => msg.role === 'system');
      if (hasSystemMessage) {
        messages = messages.map(msg => {
          if (msg.role === 'system') {
            return {
              ...msg,
              content: `${msg.content}\n${languagePrompt}`
            };
          }
          return msg;
        });
      } else {
        messages.unshift({ role: 'system', content: languagePrompt });
      }
    }
    const endpoint = modelConfig.endpoint;
    const format = modelConfig.format;
    const requestData = format === 'openai'
      ? this.buildOpenAIRequest(modelConfig.name, messages, temperature, maxTokens, stream)
      : this.buildDashScopeRequest(modelConfig.name, messages, temperature, maxTokens);
    try {
      const response = await this.makeRequest(endpoint, requestData, stream);
      return response;
    } catch (error: any) {
      throw new Error(`Aliyun AI request failed: ${error.message}`);
    }
  }

  /**
   * Streaming conversation (only supports OpenAI format)
   * @param messages - Message history
   * @param callback - Streaming callback function
   * @param i18n - Language restriction for AI response
   * @param options - Chat options
   */
  async chatStream(
    messages: ChatMessage[],
    callback: AliYunStreamCallback,
    i18n: 'en' | 'cn',
    options?: {
      temperature?: number;
      maxTokens?: number;
      modelType?: AliYunModelType;
    }
  ): Promise<void> {
    const modelType = options?.modelType || this.modelType;
    const modelConfig = ALIYUN_MODELS.get(modelType);
    if (!modelConfig) {
      throw new Error(`Unsupported model type: ${modelType}`);
    }
    if (modelConfig.format !== 'openai') {
      throw new Error('Streaming conversation only supports OpenAI format models');
    }
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens ?? 1000;
    const languagePrompt = i18n === 'en' ? 'Please respond in English only.' :
      i18n === 'cn' ? '请使用中文回答。' : '';
    if (languagePrompt) {
      const hasSystemMessage = messages.some(msg => msg.role === 'system');
      if (hasSystemMessage) {
        messages = messages.map(msg => {
          if (msg.role === 'system') {
            return {
              ...msg,
              content: `${msg.content}\n${languagePrompt}`
            };
          }
          return msg;
        });
      } else {
        messages.unshift({ role: 'system', content: languagePrompt });
      }
    }
    const requestData = this.buildOpenAIRequest(
      modelConfig.name,
      messages,
      temperature,
      maxTokens,
      true
    );
    try {
      await this.makeStreamRequest(modelConfig.endpoint, requestData, callback);
    } catch (error: any) {
      throw new Error(`Streaming request failed: ${error.message}`);
    }
  }

  /**
   * Analyze OHLCV data and return AI analysis results
   * @param ohlcvArray - OHLCV data array
   * @param i18n - Language restriction for AI response
   * @param analysisType - Analysis type (optional, default: "comprehensive")
   *   - "trend": Trend analysis
   *   - "volume": Volume analysis
   *   - "technical": Technical analysis
   *   - "comprehensive": Comprehensive analysis
   * @param message - User's subjective request or specific question (optional)
   * @param options - Chat options
   * @returns AI analysis result of OHLCV data (text description)
   */
  async analyzeOHLCV(
    ohlcvArray: OHLCV[],
    i18n: 'en' | 'cn',
    analysisType?: 'trend' | 'volume' | 'technical' | 'comprehensive',
    message?: string,
    options?: AliYunChatOptions
  ): Promise<string> {
    const processedAnalysisType = analysisType || 'comprehensive';
    const periodCount = ohlcvArray.length;
    const analysisInstructions: Record<string, string> = {
      'trend': i18n === 'en'
        ? 'Provide a detailed trend analysis of this OHLCV data, including price direction, support/resistance levels, and trend strength.'
        : '提供详细的OHLCV数据趋势分析，包括价格方向、支撑/阻力位和趋势强度。',
      'volume': i18n === 'en'
        ? 'Analyze the volume patterns in this OHLCV data, including volume trends, unusual volume spikes, and volume-price relationships.'
        : '分析OHLCV数据中的成交量模式，包括成交量趋势、异常成交量波动和量价关系。',
      'technical': i18n === 'en'
        ? 'Perform technical analysis on this OHLCV data, identifying potential technical indicators, patterns, and trading signals.'
        : '对OHLCV数据进行技术分析，识别潜在的技术指标、图表形态和交易信号。',
      'comprehensive': i18n === 'en'
        ? 'Provide a comprehensive analysis of this OHLCV data, covering trends, volume, technical aspects, and potential market implications.'
        : '提供全面的OHLCV数据分析，涵盖趋势、成交量、技术面和潜在市场影响。'
    };
    const instruction = analysisInstructions[processedAnalysisType];
    const languagePrompt = i18n === 'en'
      ? 'Please provide your analysis in English.'
      : '请用中文进行分析。';
    let dataInfo = '';
    if (periodCount > 0) {
      const firstItem = ohlcvArray[0];
      const lastItem = ohlcvArray[periodCount - 1];
      const priceChange = lastItem.close - firstItem.close;
      const priceChangePercent = (priceChange / firstItem.close) * 100;
      let highestHigh = firstItem.high;
      let lowestLow = firstItem.low;
      let totalVolume = 0;
      for (const item of ohlcvArray) {
        if (item.high > highestHigh) highestHigh = item.high;
        if (item.low < lowestLow) lowestLow = item.low;
        totalVolume += item.volume;
      }
      const avgVolume = totalVolume / periodCount;
      dataInfo = i18n === 'en'
        ? `This dataset contains ${periodCount} periods of OHLCV data.
Price range: ${lowestLow.toFixed(2)} - ${highestHigh.toFixed(2)}
Overall price change: ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (${priceChange >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%)
Average volume: ${avgVolume.toFixed(0)}`
        : `该数据集包含 ${periodCount} 个周期的OHLCV数据。
价格范围：${lowestLow.toFixed(2)} - ${highestHigh.toFixed(2)}
总体价格变化：${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (${priceChange >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%)
平均成交量：${avgVolume.toFixed(0)}`;
    }
    let systemPrompt = i18n === 'en'
      ? `You are a professional financial data analyst. Your task is to analyze OHLCV (Open, High, Low, Close, Volume) data and provide insights.
Analysis focus: ${instruction}
${dataInfo ? `Data characteristics:\n${dataInfo}\n\n` : ''}
Please provide:
1. Clear and structured analysis
2. Key observations from the data
3. Potential implications or insights
4. Recommendations or considerations (if applicable)
Format your response as a well-organized text analysis.`
      : `您是一位专业的金融数据分析师。您的任务是分析OHLCV（开盘价、最高价、最低价、收盘价、成交量）数据并提供见解。
分析重点：${instruction}
${dataInfo ? `数据特征：\n${dataInfo}\n\n` : ''}
请提供：
1. 清晰且有结构的分析
2. 数据的关键观察结果
3. 潜在的启示或见解
4. 建议或注意事项（如适用）
请以组织良好的文本分析形式回复。`;
    if (languagePrompt) {
      systemPrompt += `\n\n${languagePrompt}`;
    }
    const dataString = JSON.stringify(ohlcvArray, null, 2);
    let userMessage = '';
    if (message) {
      userMessage = i18n === 'en'
        ? `Here is the OHLCV data (${periodCount} periods):
${dataString}
My specific question or request: ${message}
Please analyze this data considering my request above.`
        : `这是OHLCV数据（${periodCount}个周期）：
${dataString}
我的具体问题或需求：${message}
请根据我的上述需求分析这些数据。`;
    } else {
      userMessage = i18n === 'en'
        ? `Here is the OHLCV data (${periodCount} periods):
${dataString}
Please analyze this data as requested.`
        : `这是OHLCV数据（${periodCount}个周期）：
${dataString}
请按要求分析这些数据。`;
    }
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];
    try {
      const response = await this.chatCompletion(messages, i18n, {
        temperature: options?.temperature || 0.5,
        maxTokens: options?.maxTokens || 1500,
        stream: false,
        modelType: options?.modelType
      });
      const content = this.extractContent(response);
      return content;
    } catch (error: any) {
      throw new Error(`OHLCV analysis failed: ${error.message}`);
    }
  }

  /**
     * Enhanced version: Analyze OHLCV and return structured results (optional)
     * @param ohlcvArray - OHLCV data array
     * @param i18n - Language restriction for AI response
     * @param analysisType - Analysis type
     * @param message - User's subjective request or specific question
     * @param structured - Whether to return structured results (default: false)
     * @param options - Chat options
     * @returns AI analysis results
     */
  async analyzeOHLCVEnhanced(
    ohlcvArray: OHLCV[],
    i18n: 'en' | 'cn',
    analysisType?: 'trend' | 'volume' | 'technical' | 'comprehensive',
    message?: string,
    structured: boolean = false,
    options?: AliYunChatOptions
  ): Promise<string | { summary: string; details: string[]; recommendations: string[] }> {
    if (structured) {
      const systemPrompt = i18n === 'en'
        ? `You are a professional financial data analyst. Analyze the OHLCV data and provide a structured response with:
1. Summary (brief overview)
2. Details (key observations, 3-5 points)
3. Recommendations (actionable insights, 2-3 points)
Format as JSON: {"summary": "...", "details": ["...", "..."], "recommendations": ["...", "..."]}`
        : `您是一位专业的金融数据分析师。分析OHLCV数据并提供结构化响应：
1. 总结（简要概述）
2. 详情（关键观察结果，3-5点）
3. 建议（可操作的见解，2-3点）
格式化为JSON：{"summary": "...", "details": ["...", "..."], "recommendations": ["...", "..."]}`;
      const dataString = JSON.stringify(ohlcvArray, null, 2);
      let userMessage = i18n === 'en'
        ? `Analyze this OHLCV data (${ohlcvArray.length} periods):\n${dataString}`
        : `分析此OHLCV数据（${ohlcvArray.length}个周期）：\n${dataString}`;
      if (message) {
        userMessage += i18n === 'en'
          ? `\n\nAdditional request: ${message}`
          : `\n\n附加要求：${message}`;
      }
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];
      try {
        const response = await this.chatCompletion(messages, i18n, {
          temperature: options?.temperature || 0.4,
          maxTokens: options?.maxTokens || 1200,
          stream: false,
          modelType: options?.modelType
        });
        const content = this.extractContent(response);
        try {
          const parsed = JSON.parse(content);
          if (parsed.summary && Array.isArray(parsed.details) && Array.isArray(parsed.recommendations)) {
            return parsed;
          }
        } catch {
        }
        return content;
      } catch (error: any) {
        throw new Error(`Structured OHLCV analysis failed: ${error.message}`);
      }
    }
    return this.analyzeOHLCV(ohlcvArray, i18n, analysisType, message, options);
  }

  /**
   * Specialized method for processing OHLCV arrays
   * @param ohlcvArray - OHLCV data array
   * @param i18n - Language restriction for AI response
   * @param instructions - Processing instructions, supports Chinese and English (optional, default: "Based on these OHLCV data, predict the next period")
   * @param count - Number of OHLCV data items to return (optional, default: 1)
   * @param options - Chat options
   * @returns Predicted OHLCV array
   */
  async predictingOHLCV(
    ohlcvArray: OHLCV[],
    i18n: 'en' | 'cn',
    instructions?: string,
    count?: number,
    options?: AliYunChatOptions
  ): Promise<OHLCV[]> {
    const processedInstructions = instructions ||
      "Based on these OHLCV data, predict the next period";
    const processedCount = count || 1;
    if (!Number.isInteger(processedCount) || processedCount <= 0) {
      throw new Error(`Invalid count parameter: ${processedCount}. Must be a positive integer.`);
    }
    const MAX_COUNT = 50;
    if (processedCount > MAX_COUNT) {
      throw new Error(`Count parameter too large: ${processedCount}. Maximum allowed is ${MAX_COUNT}. Please reduce the count or split your request.`);
    }
    const countMessage = processedCount === 1
      ? "Return EXACTLY 1 OHLCV object for the next period."
      : `Return EXACTLY ${processedCount} consecutive OHLCV objects for the next ${processedCount} periods.`;
    const languagePrompt = i18n === 'en' ? 'Please respond in English only.' :
      i18n === 'cn' ? '请使用中文回答。' : '';
    let systemPrompt = `You are a professional financial data analysis AI. The user will give you an array of OHLCV (Open, High, Low, Close, Volume) data.
Your task: ${processedInstructions}
CRITICAL RULES:
1. ${countMessage}
2. Return ONLY a JSON array of OHLCV objects, NO explanations, comments, or other text
3. The OHLCV array format must match: [{open, high, low, close, volume}, ...]
4. All numbers must be valid numbers
5. Ensure technical rationality (high >= low, high >= close >= low, volume >= 0)
6. Maintain consistency with historical trends and patterns
7. For technical analysis, provide reasonable values based on typical patterns
8. Do not include markdown formatting, only pure JSON
${processedCount === 1 ?
        `Example of valid response for 1 period:
[{"open": 115.5, "high": 118.0, "low": 114.0, "close": 117.0, "volume": 1350000}]` :
        `Example of valid response for ${processedCount} periods:
[
  {"open": 115.5, "high": 118.0, "low": 114.0, "close": 117.0, "volume": 1350000},
  {"open": 117.5, "high": 120.0, "low": 116.0, "close": 119.0, "volume": 1400000}
  ${processedCount > 2 ? `,
  ... ${processedCount - 2} more OHLCV objects following the same pattern` : ''}
]`}`;
    if (languagePrompt) {
      systemPrompt = `${systemPrompt}\n\n${languagePrompt}`;
    }
    const dataString = JSON.stringify(ohlcvArray, null, 2);
    const userMessage = `Here is the historical OHLCV data (${ohlcvArray.length} periods):
${dataString}
Please process this data according to the system instructions. Remember to return EXACTLY ${processedCount} OHLCV object(s) in a JSON array with no additional text.`;
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];
    try {
      const estimatedTokens = processedCount * 50 + 100;
      const maxTokens = Math.max(options?.maxTokens || 1000, estimatedTokens);
      const response = await this.chatCompletion(messages, i18n, {
        temperature: options?.temperature || 0.3,
        maxTokens,
        stream: false,
        modelType: options?.modelType
      });
      const content = this.extractContent(response);
      const result = this.parseOHLCVResponse(content);
      if (result.length !== processedCount) {
        throw new Error(`AI returned ${result.length} OHLCV objects, but expected ${processedCount}.`);
      }
      return result;
    } catch (error: any) {
      throw new Error(`OHLCV analysis failed: ${error.message}`);
    }
  }

  /**
   * Parse AI returned OHLCV response
   * @private
   */
  private parseOHLCVResponse(content: string): OHLCV[] {
    try {
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not in array format');
      }
      // Validate each element is a valid OHLCV object
      const result = parsed.map((item, index) => {
        if (typeof item !== 'object' || item === null) {
          throw new Error(`Element ${index} is not a valid object`);
        }
        const { open, high, low, close, volume } = item;
        const requiredFields = ['open', 'high', 'low', 'close', 'volume'];
        for (const field of requiredFields) {
          if (typeof item[field] !== 'number' || isNaN(item[field])) {
            throw new Error(`Element ${index} field ${field} is not a valid number`);
          }
        }
        // Validate data rationality
        if (high < low) {
          throw new Error(`Element ${index}: high cannot be lower than low`);
        }
        if (close < low || close > high) {
          throw new Error(`Element ${index}: close must be between low and high`);
        }
        return {
          open: Number(open),
          high: Number(high),
          low: Number(low),
          close: Number(close),
          volume: Number(volume)
        };
      });
      return result;
    } catch (error) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return this.parseOHLCVResponse(jsonMatch[0]);
      }
      throw new Error(`Unable to parse AI returned OHLCV data: ${error}\nOriginal content: ${content.substring(0, 200)}...`);
    }
  }

  /**
   * Switch model
   * @param modelType - New model type
   */
  setModel(modelType: AliYunModelType): void {
    const modelConfig = ALIYUN_MODELS.get(modelType);
    if (!modelConfig) {
      throw new Error(`Unsupported model type: ${modelType}`);
    }
    this.modelType = modelType;
  }

  /**
   * Get current model configuration
   */
  getCurrentModel(): { name: string; displayName: string; description?: string } {
    const modelConfig = ALIYUN_MODELS.get(this.modelType);
    if (!modelConfig) {
      throw new Error(`Model configuration does not exist: ${this.modelType}`);
    }
    return {
      name: modelConfig.name,
      displayName: modelConfig.displayName,
      description: modelConfig.description
    };
  }

  /**
   * Test connection
   * @returns Connection test result
   */
  async testConnection(): Promise<{
    success: boolean;
    model: string;
    response?: string;
    error?: string;
  }> {
    try {
      const response = await this.chat('Hello, respond with "OK" if you can hear me.', 'en');
      return {
        success: true,
        model: this.modelType,
        response: response
      };
    } catch (error: any) {
      return {
        success: false,
        model: this.modelType,
        error: error.message
      };
    }
  }

  private buildOpenAIRequest(
    model: string,
    messages: ChatMessage[],
    temperature: number,
    maxTokens: number,
    stream: boolean
  ): any {
    return {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream
    };
  }

  private buildDashScopeRequest(
    model: string,
    messages: ChatMessage[],
    temperature: number,
    maxTokens: number
  ): any {
    return {
      model,
      input: { messages },
      parameters: {
        temperature,
        max_tokens: maxTokens,
        result_format: 'message'
      }
    };
  }

  private async makeRequest(endpoint: string, data: any, stream: boolean): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      if (stream) {
        return response.body;
      }
      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout (${this.timeout}ms)`);
      }
      throw error;
    }
  }

  private async makeStreamRequest(
    endpoint: string,
    data: any,
    callback: AliYunStreamCallback
  ): Promise<void> {
    const response = await this.makeRequest(endpoint, data, true);
    if (!response) {
      throw new Error('Failed to get streaming response');
    }
    const reader = response.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          callback('', true);
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              callback('', true);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                callback(parsed.choices[0].delta.content, false);
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private extractContent(response: any): string {
    if (response.choices?.[0]?.message?.content) {
      return response.choices[0].message.content;
    } else if (response.output?.choices?.[0]?.message?.content) {
      return response.output.choices[0].message.content;
    } else if (response.output?.text) {
      return response.output.text;
    } else {
      throw new Error('Unable to parse response content');
    }
  }

}

/**
 * Factory function for quick instance creation
 */
export function createAliyunAI(apiKey: string, modelType?: AliYunModelType): AliyunAI {
  return new AliyunAI({ apiKey, modelType });
}