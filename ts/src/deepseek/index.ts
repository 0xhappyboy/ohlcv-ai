import { OHLCV } from "@/types";
import { DeepSeekModelType, DEEPSEEK_MODELS } from "./model";

// Chat message interface
export interface DeepSeekChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    name?: string;
    tool_call_id?: string;
}

// Minimal configuration
export interface DeepSeekConfig {
    apiKey: string;
    modelType?: DeepSeekModelType;
    timeout?: number;
    baseURL?: string;
}

// Chat options
export interface DeepSeekChatOptions {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    systemPrompt?: string;
    modelType?: DeepSeekModelType;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
    tools?: any[];
    toolChoice?: string | object;
}

// Streaming response callback
export type DeepSeekStreamCallback = (chunk: string, isEnd: boolean) => void;

export class DeepSeekAI {
    private apiKey: string;
    private modelType: DeepSeekModelType;
    private timeout: number;
    private baseURL: string;

    /**
     * Constructor - Minimal configuration
     * @param config.apiKey - API key (required)
     * @param config.modelType - Model type, default deepseek-chat
     * @param config.timeout - Timeout, default 30 seconds
     * @param config.baseURL - Base URL for API, default official endpoint
     */
    constructor(config: DeepSeekConfig) {
        this.apiKey = config.apiKey;
        this.modelType = config.modelType || DeepSeekModelType.DEEPSEEK_CHAT;
        this.timeout = config.timeout || 30000;
        this.baseURL = config.baseURL || 'https://api.deepseek.com';
        if (!this.apiKey) {
            throw new Error('API Key cannot be empty');
        }
        const modelConfig = DEEPSEEK_MODELS.get(this.modelType);
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
    async chat(message: string, options?: DeepSeekChatOptions): Promise<string> {
        const messages: DeepSeekChatMessage[] = [];
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: message });
        const response = await this.chatCompletion(messages, {
            temperature: options?.temperature,
            maxTokens: options?.maxTokens,
            stream: false,
            modelType: options?.modelType,
            topP: options?.topP,
            frequencyPenalty: options?.frequencyPenalty,
            presencePenalty: options?.presencePenalty,
            stop: options?.stop,
            tools: options?.tools,
            toolChoice: options?.toolChoice
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
        messages: DeepSeekChatMessage[],
        options?: DeepSeekChatOptions
    ): Promise<any> {
        const modelType = options?.modelType || this.modelType;
        const modelConfig = DEEPSEEK_MODELS.get(modelType);
        if (!modelConfig) {
            throw new Error(`Unsupported model type: ${modelType}`);
        }
        const temperature = options?.temperature ?? 0.7;
        const maxTokens = options?.maxTokens ?? 2000;
        const stream = options?.stream ?? false;
        const topP = options?.topP ?? 1.0;
        const frequencyPenalty = options?.frequencyPenalty ?? 0.0;
        const presencePenalty = options?.presencePenalty ?? 0.0;
        const stop = options?.stop;
        const tools = options?.tools;
        const toolChoice = options?.toolChoice;
        const endpoint = modelConfig.endpoint;
        const requestData = this.buildOpenAIRequest(
            modelConfig.name,
            messages,
            temperature,
            maxTokens,
            stream,
            topP,
            frequencyPenalty,
            presencePenalty,
            stop,
            tools,
            toolChoice
        );
        try {
            const response = await this.makeRequest(endpoint, requestData, stream);
            return response;
        } catch (error: any) {
            throw new Error(`DeepSeek AI request failed: ${error.message}`);
        }
    }

    /**
     * Streaming conversation
     * @param messages - Message history
     * @param callback - Streaming callback function
     * @param options - Chat options
     */
    async chatStream(
        messages: DeepSeekChatMessage[],
        callback: DeepSeekStreamCallback,
        options?: DeepSeekChatOptions
    ): Promise<void> {
        const modelType = options?.modelType || this.modelType;
        const modelConfig = DEEPSEEK_MODELS.get(modelType);
        if (!modelConfig) {
            throw new Error(`Unsupported model type: ${modelType}`);
        }
        const temperature = options?.temperature ?? 0.7;
        const maxTokens = options?.maxTokens ?? 2000;
        const topP = options?.topP ?? 1.0;
        const frequencyPenalty = options?.frequencyPenalty ?? 0.0;
        const presencePenalty = options?.presencePenalty ?? 0.0;
        const requestData = this.buildOpenAIRequest(
            modelConfig.name,
            messages,
            temperature,
            maxTokens,
            true,
            topP,
            frequencyPenalty,
            presencePenalty,
            options?.stop,
            options?.tools,
            options?.toolChoice
        );
        try {
            await this.makeStreamRequest(modelConfig.endpoint, requestData, callback);
        } catch (error: any) {
            throw new Error(`Streaming request failed: ${error.message}`);
        }
    }

    /**
     * Specialized method for processing OHLCV arrays
     * @param ohlcvArray - OHLCV data array
     * @param instructions - Processing instructions (optional)
     * @param count - Number of OHLCV data items to return (optional, default: 1)
     * @param options - Chat options
     * @returns Predicted OHLCV array
     */
    async predictingOHLCV(
        ohlcvArray: OHLCV[],
        instructions?: string,
        count?: number,
        options?: DeepSeekChatOptions
    ): Promise<OHLCV[]> {
        const processedInstructions = instructions ||
            "Based on these OHLCV data, predict the next period";
        const processedCount = count || 1;
        if (!Number.isInteger(processedCount) || processedCount <= 0) {
            throw new Error(`Invalid count parameter: ${processedCount}. Must be a positive integer.`);
        }
        const MAX_COUNT = 50;
        if (processedCount > MAX_COUNT) {
            throw new Error(`Count parameter too large: ${processedCount}. Maximum allowed is ${MAX_COUNT}.`);
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
        const messages: DeepSeekChatMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ];
        try {
            const estimatedTokens = processedCount * 50 + 100;
            const maxTokens = Math.max(options?.maxTokens || 2000, estimatedTokens);
            const response = await this.chatCompletion(messages, {
                temperature: options?.temperature || 0.3,
                maxTokens,
                stream: false,
                modelType: options?.modelType || DeepSeekModelType.DEEPSEEK_FINANCE,
                topP: options?.topP,
                frequencyPenalty: options?.frequencyPenalty,
                presencePenalty: options?.presencePenalty
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
     * Switch model
     * @param modelType - New model type
     */
    setModel(modelType: DeepSeekModelType): void {
        const modelConfig = DEEPSEEK_MODELS.get(modelType);
        if (!modelConfig) {
            throw new Error(`Unsupported model type: ${modelType}`);
        }
        this.modelType = modelType;
    }

    /**
     * Get current model configuration
     */
    getCurrentModel(): { name: string; displayName: string; description?: string } {
        const modelConfig = DEEPSEEK_MODELS.get(this.modelType);
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
        messages: DeepSeekChatMessage[],
        temperature: number,
        maxTokens: number,
        stream: boolean,
        topP?: number,
        frequencyPenalty?: number,
        presencePenalty?: number,
        stop?: string[],
        tools?: any[],
        toolChoice?: string | object
    ): any {
        const request: any = {
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream
        };
        if (topP !== undefined) request.top_p = topP;
        if (frequencyPenalty !== undefined) request.frequency_penalty = frequencyPenalty;
        if (presencePenalty !== undefined) request.presence_penalty = presencePenalty;
        if (stop) request.stop = stop;
        if (tools) request.tools = tools;
        if (toolChoice) request.tool_choice = toolChoice;
        return request;
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
        callback: DeepSeekStreamCallback
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
        } else if (response.choices?.[0]?.delta?.content) {
            return response.choices[0].delta.content;
        } else {
            throw new Error('Unable to parse response content');
        }
    }

    private parseOHLCVResponse(content: string): OHLCV[] {
        try {
            const parsed = JSON.parse(content);
            if (!Array.isArray(parsed)) {
                throw new Error('Response is not in array format');
            }
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
export function createDeepSeekAI(apiKey: string, modelType?: DeepSeekModelType): DeepSeekAI {
    return new DeepSeekAI({ apiKey, modelType });
}