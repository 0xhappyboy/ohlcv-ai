export enum AliYunModelType {
    QWEN_TURBO = 'qwen-turbo',
    QWEN_PLUS = 'qwen-plus',
    QWEN_MAX = 'qwen-max',
    QWEN_MAX_LONGCONTEXT = 'qwen-max-longcontext',
    QWEN_2_5B = 'qwen2.5-0.5b',
    QWEN_2_5B_INSTRUCT = 'qwen2.5-0.5b-instruct',
    QWEN_2_5B_7B = 'qwen2.5-7b',
    QWEN_2_5B_7B_INSTRUCT = 'qwen2.5-7b-instruct',
    QWEN_2_5B_14B = 'qwen2.5-14b',
    QWEN_2_5B_14B_INSTRUCT = 'qwen2.5-14b-instruct',
    QWEN_2_5B_32B = 'qwen2.5-32b',
    QWEN_2_5B_32B_INSTRUCT = 'qwen2.5-32b-instruct',
    QWEN_2_5B_72B = 'qwen2.5-72b',
    QWEN_2_5B_72B_INSTRUCT = 'qwen2.5-72b-instruct',
    QWEN_2_5B_CODER = 'qwen2.5-coder',
    QWEN_2_5B_CODER_7B = 'qwen2.5-coder-7b',
    QWEN_2_5B_CODER_14B = 'qwen2.5-coder-14b',
    QWEN_2_5B_CODER_32B = 'qwen2.5-coder-32b',
    QWEN_VL_LITE = 'qwen-vl-lite',
    QWEN_VL_PLUS = 'qwen-vl-plus',
    QWEN_VL_MAX = 'qwen-vl-max',
    QWEN_AUDIO_TURBO = 'qwen-audio-turbo',
    QWEN_AUDIO_CHAT = 'qwen-audio-chat',
    QWEN_MATH_7B = 'qwen-math-7b',
    LLAMA2_7B_CHAT_V2 = 'llama2-7b-chat-v2',
    BAICHUAN2_7B_CHAT_V1 = 'baichuan2-7b-chat-v1',
    QWEN_FINANCIAL = 'qwen-financial',
    QWEN_FINANCIAL_14B = 'qwen-financial-14b',
    QWEN_FINANCIAL_32B = 'qwen-financial-32b',
    QWEN_MEDICAL = 'qwen-medical',
    QWEN_MEDICAL_14B = 'qwen-medical-14b',
    QWEN_MEDICAL_32B = 'qwen-medical-32b',
    QWEN_OMNI = 'qwen-omni',
    QWEN_OMNI_PRO = 'qwen-omni-pro'
}

export interface Model {
    name: string;
    displayName: string;
    endpoint: string;
    endpoints?: string[];
    format: 'openai' | 'dashscope';
    description?: string;
    maxTokens?: number;
    contextLength?: number;
    capabilities?: string[];
}

export const ALIYUN_MODELS: Map<AliYunModelType, Model> = new Map([
    [
        AliYunModelType.QWEN_TURBO,
        {
            name: AliYunModelType.QWEN_TURBO,
            displayName: 'Qwen-Turbo',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            endpoints: [
                'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
                'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
            ],
            format: 'openai',
            description: 'Lightweight version, fast response speed, suitable for general conversation scenarios',
            maxTokens: 2000,
            contextLength: 8000,
            capabilities: ['text-generation', 'chat']
        }
    ],
    [
        AliYunModelType.QWEN_PLUS,
        {
            name: AliYunModelType.QWEN_PLUS,
            displayName: 'Qwen-Plus',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            endpoints: [
                'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
            ],
            format: 'openai',
            description: 'Enhanced version, suitable for complex tasks and long text processing',
            maxTokens: 6000,
            contextLength: 32000,
            capabilities: ['text-generation', 'chat', 'reasoning']
        }
    ],
    [
        AliYunModelType.QWEN_MAX,
        {
            name: AliYunModelType.QWEN_MAX,
            displayName: 'Qwen-Max',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            endpoints: [
                'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
            ],
            format: 'openai',
            description: 'Maximum version, strongest capabilities, suitable for high-demand professional tasks',
            maxTokens: 8000,
            contextLength: 32000,
            capabilities: ['text-generation', 'chat', 'reasoning', 'coding', 'analysis']
        }
    ],
    [
        AliYunModelType.QWEN_MAX_LONGCONTEXT,
        {
            name: AliYunModelType.QWEN_MAX_LONGCONTEXT,
            displayName: 'Qwen-Max-LongContext',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            endpoints: [
                'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
            ],
            format: 'openai',
            description: 'Supports 128K long context, suitable for long document processing',
            maxTokens: 8000,
            contextLength: 128000,
            capabilities: ['text-generation', 'chat', 'document-analysis']
        }
    ],
    // Qwen2.5 series models
    [
        AliYunModelType.QWEN_2_5B,
        {
            name: AliYunModelType.QWEN_2_5B,
            displayName: 'Qwen2.5-0.5B',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Ultra-lightweight 0.5B parameter model for edge devices',
            maxTokens: 4000,
            contextLength: 32000,
            capabilities: ['text-generation', 'chat']
        }
    ],
    [
        AliYunModelType.QWEN_2_5B_INSTRUCT,
        {
            name: AliYunModelType.QWEN_2_5B_INSTRUCT,
            displayName: 'Qwen2.5-0.5B-Instruct',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Instruction-tuned 0.5B model for specific tasks',
            maxTokens: 4000,
            contextLength: 32000,
            capabilities: ['instruction-following', 'chat']
        }
    ],
    [
        AliYunModelType.QWEN_2_5B_7B,
        {
            name: AliYunModelType.QWEN_2_5B_7B,
            displayName: 'Qwen2.5-7B',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: '7B parameter base model, balanced performance and efficiency',
            maxTokens: 6000,
            contextLength: 32000,
            capabilities: ['text-generation', 'reasoning']
        }
    ],
    [
        AliYunModelType.QWEN_2_5B_7B_INSTRUCT,
        {
            name: AliYunModelType.QWEN_2_5B_7B_INSTRUCT,
            displayName: 'Qwen2.5-7B-Instruct',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Instruction-tuned 7B model for chat and tasks',
            maxTokens: 6000,
            contextLength: 32000,
            capabilities: ['chat', 'instruction-following', 'coding']
        }
    ],
    [
        AliYunModelType.QWEN_2_5B_14B,
        {
            name: AliYunModelType.QWEN_2_5B_14B,
            displayName: 'Qwen2.5-14B',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: '14B parameter model with enhanced capabilities',
            maxTokens: 8000,
            contextLength: 32000,
            capabilities: ['text-generation', 'analysis', 'reasoning']
        }
    ],
    [
        AliYunModelType.QWEN_2_5B_32B,
        {
            name: AliYunModelType.QWEN_2_5B_32B,
            displayName: 'Qwen2.5-32B',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: '32B parameter high-performance model',
            maxTokens: 8000,
            contextLength: 32000,
            capabilities: ['text-generation', 'complex-reasoning', 'analysis']
        }
    ],
    [
        AliYunModelType.QWEN_2_5B_72B,
        {
            name: AliYunModelType.QWEN_2_5B_72B,
            displayName: 'Qwen2.5-72B',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: '72B parameter state-of-the-art model',
            maxTokens: 8000,
            contextLength: 32000,
            capabilities: ['text-generation', 'expert-analysis', 'research']
        }
    ],
    // Qwen2.5 Coder series
    [
        AliYunModelType.QWEN_2_5B_CODER,
        {
            name: AliYunModelType.QWEN_2_5B_CODER,
            displayName: 'Qwen2.5-Coder',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Specialized code generation model',
            maxTokens: 8000,
            contextLength: 32000,
            capabilities: ['code-generation', 'code-explanation', 'debugging']
        }
    ],
    [
        AliYunModelType.QWEN_2_5B_CODER_7B,
        {
            name: AliYunModelType.QWEN_2_5B_CODER_7B,
            displayName: 'Qwen2.5-Coder-7B',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: '7B parameter code generation model',
            maxTokens: 8000,
            contextLength: 32000,
            capabilities: ['code-generation', 'programming']
        }
    ],
    [
        AliYunModelType.QWEN_2_5B_CODER_14B,
        {
            name: AliYunModelType.QWEN_2_5B_CODER_14B,
            displayName: 'Qwen2.5-Coder-14B',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: '14B parameter advanced code generation model',
            maxTokens: 8000,
            contextLength: 32000,
            capabilities: ['code-generation', 'code-review', 'optimization']
        }
    ],
    // Vision-Language models
    [
        AliYunModelType.QWEN_VL_LITE,
        {
            name: AliYunModelType.QWEN_VL_LITE,
            displayName: 'Qwen-VL-Lite',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Lightweight vision-language model for basic image understanding',
            maxTokens: 2000,
            contextLength: 8000,
            capabilities: ['image-understanding', 'visual-qa']
        }
    ],
    [
        AliYunModelType.QWEN_VL_PLUS,
        {
            name: AliYunModelType.QWEN_VL_PLUS,
            displayName: 'Qwen-VL-Plus',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Vision-language model supporting image understanding',
            maxTokens: 4000,
            contextLength: 32000,
            capabilities: ['image-understanding', 'document-analysis', 'visual-reasoning']
        }
    ],
    [
        AliYunModelType.QWEN_VL_MAX,
        {
            name: AliYunModelType.QWEN_VL_MAX,
            displayName: 'Qwen-VL-Max',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Most powerful vision-language model',
            maxTokens: 8000,
            contextLength: 32000,
            capabilities: ['image-understanding', 'video-analysis', 'multimodal-reasoning']
        }
    ],
    // Audio models
    [
        AliYunModelType.QWEN_AUDIO_TURBO,
        {
            name: AliYunModelType.QWEN_AUDIO_TURBO,
            displayName: 'Qwen-Audio-Turbo',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Fast audio processing and speech-to-text model',
            maxTokens: 2000,
            contextLength: 8000,
            capabilities: ['speech-recognition', 'audio-analysis']
        }
    ],
    [
        AliYunModelType.QWEN_AUDIO_CHAT,
        {
            name: AliYunModelType.QWEN_AUDIO_CHAT,
            displayName: 'Qwen-Audio-Chat',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Audio conversation and processing model',
            maxTokens: 4000,
            contextLength: 32000,
            capabilities: ['audio-chat', 'voice-assistant', 'speech-synthesis']
        }
    ],
    // Specialized models
    [
        AliYunModelType.QWEN_MATH_7B,
        {
            name: AliYunModelType.QWEN_MATH_7B,
            displayName: 'Qwen-Math-7B',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Specialized for mathematical reasoning and problem solving',
            maxTokens: 4000,
            contextLength: 32000,
            capabilities: ['mathematical-reasoning', 'problem-solving']
        }
    ],
    [
        AliYunModelType.LLAMA2_7B_CHAT_V2,
        {
            name: AliYunModelType.LLAMA2_7B_CHAT_V2,
            displayName: 'LLaMA2-7B-Chat',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Meta\'s LLaMA2-7B model',
            maxTokens: 2000,
            contextLength: 8000,
            capabilities: ['chat', 'text-generation']
        }
    ],
    [
        AliYunModelType.BAICHUAN2_7B_CHAT_V1,
        {
            name: AliYunModelType.BAICHUAN2_7B_CHAT_V1,
            displayName: 'Baichuan2-7B-Chat',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Baichuan AI\'s Baichuan2-7B model',
            maxTokens: 2000,
            contextLength: 8000,
            capabilities: ['chat', 'chinese-nlp']
        }
    ],
    [
        AliYunModelType.QWEN_FINANCIAL,
        {
            name: AliYunModelType.QWEN_FINANCIAL,
            displayName: 'Qwen-Financial',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Specialized for financial analysis and market insights',
            maxTokens: 6000,
            contextLength: 32000,
            capabilities: ['financial-analysis', 'market-prediction', 'risk-assessment']
        }
    ],
    [
        AliYunModelType.QWEN_MEDICAL,
        {
            name: AliYunModelType.QWEN_MEDICAL,
            displayName: 'Qwen-Medical',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Specialized for medical consultation and health analysis',
            maxTokens: 6000,
            contextLength: 32000,
            capabilities: ['medical-consultation', 'health-analysis', 'diagnostic-support']
        }
    ],
    // Omni models (multimodal)
    [
        AliYunModelType.QWEN_OMNI,
        {
            name: AliYunModelType.QWEN_OMNI,
            displayName: 'Qwen-Omni',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Omnidirectional multimodal model supporting text, image, audio',
            maxTokens: 8000,
            contextLength: 64000,
            capabilities: ['text-generation', 'image-understanding', 'audio-processing', 'multimodal']
        }
    ],
    [
        AliYunModelType.QWEN_OMNI_PRO,
        {
            name: AliYunModelType.QWEN_OMNI_PRO,
            displayName: 'Qwen-Omni-Pro',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            format: 'openai',
            description: 'Professional omnidirectional multimodal model with advanced capabilities',
            maxTokens: 16000,
            contextLength: 128000,
            capabilities: ['text-generation', 'multimodal', 'complex-reasoning', 'expert-analysis']
        }
    ]
]);

export function getModel(type: AliYunModelType): Model | undefined {
    return ALIYUN_MODELS.get(type);
}

export function getAllModels(): Model[] {
    return Array.from(ALIYUN_MODELS.values());
}

export function getModelByName(name: string): Model | undefined {
    for (const model of ALIYUN_MODELS.values()) {
        if (model.name === name) {
            return model;
        }
    }
    return undefined;
}

export function getAvailableAliYunModelTypes(): AliYunModelType[] {
    return Array.from(ALIYUN_MODELS.keys());
}

// Helper functions for specific model categories
export function getTextModels(): Model[] {
    return getAllModels().filter(model => 
        model.capabilities?.includes('text-generation') && 
        !model.capabilities?.includes('image-understanding') &&
        !model.capabilities?.includes('audio-processing')
    );
}

export function getVisionModels(): Model[] {
    return getAllModels().filter(model => 
        model.capabilities?.includes('image-understanding')
    );
}

export function getAudioModels(): Model[] {
    return getAllModels().filter(model => 
        model.capabilities?.includes('audio-processing') ||
        model.capabilities?.includes('speech-recognition')
    );
}

export function getCodingModels(): Model[] {
    return getAllModels().filter(model => 
        model.capabilities?.includes('code-generation') ||
        model.capabilities?.includes('programming')
    );
}

export function getSpecializedModels(): Model[] {
    const specializedCapabilities = [
        'financial-analysis', 
        'medical-consultation', 
        'mathematical-reasoning'
    ];
    return getAllModels().filter(model => 
        model.capabilities?.some(cap => specializedCapabilities.includes(cap))
    );
}

export function getMultimodalModels(): Model[] {
    return getAllModels().filter(model => 
        model.capabilities?.includes('multimodal')
    );
}