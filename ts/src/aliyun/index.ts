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
   * @param options - Chat options
   * @returns AI response
   */
  async chat(message: string, options?: AliYunChatOptions): Promise<string> {
    const messages: ChatMessage[] = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: message });
    const response = await this.chatCompletion(messages, {
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      stream: false
    });
    return this.extractContent(response);
  }

  /**
   * Multi-turn conversation
   * @param messages - Message history
   * @param options - Chat options
   * @returns Complete API response
   */
  async chatCompletion(
    messages: ChatMessage[],
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
   * @param options - Chat options
   */
  async chatStream(
    messages: ChatMessage[],
    callback: AliYunStreamCallback,
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
      const response = await this.chat('Hello, respond with "OK" if you can hear me.');
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

  /**
   * Specialized method for processing OHLCV arrays
   * @param ohlcvArray - OHLCV data array
   * @param instructions - Processing instructions, supports Chinese and English (optional, default: "Based on these OHLCV data, predict the next period")
   * @param count - Number of OHLCV data items to return (optional, default: 1)
   * @param options - Chat options
   * @returns Predicted OHLCV array
   */
  async predictingOHLCV(
    ohlcvArray: OHLCV[],
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
    const systemPrompt = `You are a professional financial data analysis AI. The user will give you an array of OHLCV (Open, High, Low, Close, Volume) data.
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
      const response = await this.chatCompletion(messages, {
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
}

/**
 * Factory function for quick instance creation
 */
export function createAliyunAI(apiKey: string, modelType?: AliYunModelType): AliyunAI {
  return new AliyunAI({ apiKey, modelType });
}