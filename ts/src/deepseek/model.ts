export enum DeepSeekModelType {
    // Chat models
    DEEPSEEK_CHAT = 'deepseek-chat',
    DEEPSEEK_CHAT_LITE = 'deepseek-chat-lite',
    DEEPSEEK_CHAT_PRO = 'deepseek-chat-pro',
    DEEPSEEK_CHAT_MAX = 'deepseek-chat-max',
    // Coder models
    DEEPSEEK_CODER = 'deepseek-coder',
    DEEPSEEK_CODER_LITE = 'deepseek-coder-lite',
    DEEPSEEK_CODER_PRO = 'deepseek-coder-pro',
    // Math models
    DEEPSEEK_MATH = 'deepseek-math',
    DEEPSEEK_MATH_PRO = 'deepseek-math-pro',
    // Reasoning models
    DEEPSEEK_REASONER = 'deepseek-reasoner',
    DEEPSEEK_REASONER_PRO = 'deepseek-reasoner-pro',
    // Vision models
    DEEPSEEK_VISION = 'deepseek-vision',
    DEEPSEEK_VISION_PRO = 'deepseek-vision-pro',
    // Specialized models
    DEEPSEEK_FINANCE = 'deepseek-finance',
    DEEPSEEK_LAW = 'deepseek-law',
    DEEPSEEK_MEDICAL = 'deepseek-medical',
    DEEPSEEK_RESEARCH = 'deepseek-research',
    // Multimodal models
    DEEPSEEK_OMNI = 'deepseek-omni',
    DEEPSEEK_OMNI_PRO = 'deepseek-omni-pro',
    // Legacy models
    DEEPSEEK_LLM = 'deepseek-llm',
    DEEPSEEK_LLM_67B = 'deepseek-llm-67b',
    DEEPSEEK_LLM_131B = 'deepseek-llm-131b'
}

export interface DeepSeekModel {
    name: string;
    displayName: string;
    endpoint: string;
    endpoints?: string[];
    format: 'openai' | 'deepseek';
    description?: string;
    maxTokens?: number;
    contextLength?: number;
    capabilities?: string[];
    version?: string;
}

export const DEEPSEEK_MODELS: Map<DeepSeekModelType, DeepSeekModel> = new Map([
    // Chat models
    [
        DeepSeekModelType.DEEPSEEK_CHAT,
        {
            name: DeepSeekModelType.DEEPSEEK_CHAT,
            displayName: 'DeepSeek Chat',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            endpoints: [
                'https://api.deepseek.com/v1/chat/completions'
            ],
            format: 'openai',
            description: 'General purpose chat model for everyday conversations and tasks',
            maxTokens: 4096,
            contextLength: 16000,
            capabilities: ['chat', 'text-generation', 'reasoning'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_CHAT_LITE,
        {
            name: DeepSeekModelType.DEEPSEEK_CHAT_LITE,
            displayName: 'DeepSeek Chat Lite',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Lightweight chat model optimized for speed and efficiency',
            maxTokens: 2048,
            contextLength: 8000,
            capabilities: ['chat', 'text-generation'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_CHAT_PRO,
        {
            name: DeepSeekModelType.DEEPSEEK_CHAT_PRO,
            displayName: 'DeepSeek Chat Pro',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Professional chat model with enhanced reasoning capabilities',
            maxTokens: 8192,
            contextLength: 32000,
            capabilities: ['chat', 'text-generation', 'complex-reasoning', 'analysis'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_CHAT_MAX,
        {
            name: DeepSeekModelType.DEEPSEEK_CHAT_MAX,
            displayName: 'DeepSeek Chat Max',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Maximum capability chat model for most demanding tasks',
            maxTokens: 16384,
            contextLength: 64000,
            capabilities: ['chat', 'text-generation', 'expert-analysis', 'research'],
            version: '2025-01'
        }
    ],
    // Coder models
    [
        DeepSeekModelType.DEEPSEEK_CODER,
        {
            name: DeepSeekModelType.DEEPSEEK_CODER,
            displayName: 'DeepSeek Coder',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Specialized model for code generation and programming tasks',
            maxTokens: 16384,
            contextLength: 64000,
            capabilities: ['code-generation', 'programming', 'debugging', 'code-review'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_CODER_LITE,
        {
            name: DeepSeekModelType.DEEPSEEK_CODER_LITE,
            displayName: 'DeepSeek Coder Lite',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Lightweight code generation model',
            maxTokens: 4096,
            contextLength: 16000,
            capabilities: ['code-generation', 'programming'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_CODER_PRO,
        {
            name: DeepSeekModelType.DEEPSEEK_CODER_PRO,
            displayName: 'DeepSeek Coder Pro',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Professional code generation model with advanced features',
            maxTokens: 32768,
            contextLength: 128000,
            capabilities: ['code-generation', 'programming', 'system-design', 'architecture'],
            version: '2025-01'
        }
    ],
    
    // Math models
    [
        DeepSeekModelType.DEEPSEEK_MATH,
        {
            name: DeepSeekModelType.DEEPSEEK_MATH,
            displayName: 'DeepSeek Math',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Specialized model for mathematical reasoning and problem solving',
            maxTokens: 8192,
            contextLength: 32000,
            capabilities: ['mathematical-reasoning', 'problem-solving', 'calculations'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_MATH_PRO,
        {
            name: DeepSeekModelType.DEEPSEEK_MATH_PRO,
            displayName: 'DeepSeek Math Pro',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Advanced mathematical reasoning model for complex problems',
            maxTokens: 16384,
            contextLength: 64000,
            capabilities: ['mathematical-reasoning', 'advanced-calculus', 'statistics'],
            version: '2025-01'
        }
    ],
    
    // Reasoning models
    [
        DeepSeekModelType.DEEPSEEK_REASONER,
        {
            name: DeepSeekModelType.DEEPSEEK_REASONER,
            displayName: 'DeepSeek Reasoner',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Dedicated reasoning model for logical analysis',
            maxTokens: 8192,
            contextLength: 32000,
            capabilities: ['logical-reasoning', 'analysis', 'decision-making'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_REASONER_PRO,
        {
            name: DeepSeekModelType.DEEPSEEK_REASONER_PRO,
            displayName: 'DeepSeek Reasoner Pro',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Advanced reasoning model for complex logical problems',
            maxTokens: 16384,
            contextLength: 64000,
            capabilities: ['complex-reasoning', 'scientific-analysis', 'research'],
            version: '2025-01'
        }
    ],
    
    // Vision models
    [
        DeepSeekModelType.DEEPSEEK_VISION,
        {
            name: DeepSeekModelType.DEEPSEEK_VISION,
            displayName: 'DeepSeek Vision',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Vision model for image understanding and analysis',
            maxTokens: 4096,
            contextLength: 16000,
            capabilities: ['image-understanding', 'visual-qa', 'document-analysis'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_VISION_PRO,
        {
            name: DeepSeekModelType.DEEPSEEK_VISION_PRO,
            displayName: 'DeepSeek Vision Pro',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Advanced vision model for complex visual tasks',
            maxTokens: 8192,
            contextLength: 32000,
            capabilities: ['image-understanding', 'video-analysis', 'visual-reasoning'],
            version: '2025-01'
        }
    ],
    
    // Specialized models
    [
        DeepSeekModelType.DEEPSEEK_FINANCE,
        {
            name: DeepSeekModelType.DEEPSEEK_FINANCE,
            displayName: 'DeepSeek Finance',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Specialized for financial analysis, market prediction, and investment insights',
            maxTokens: 8192,
            contextLength: 32000,
            capabilities: ['financial-analysis', 'market-prediction', 'risk-assessment', 'investment-advice'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_LAW,
        {
            name: DeepSeekModelType.DEEPSEEK_LAW,
            displayName: 'DeepSeek Law',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Specialized for legal analysis, contract review, and legal research',
            maxTokens: 16384,
            contextLength: 64000,
            capabilities: ['legal-analysis', 'contract-review', 'legal-research'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_MEDICAL,
        {
            name: DeepSeekModelType.DEEPSEEK_MEDICAL,
            displayName: 'DeepSeek Medical',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Specialized for medical consultation, diagnosis support, and health analysis',
            maxTokens: 8192,
            contextLength: 32000,
            capabilities: ['medical-consultation', 'diagnostic-support', 'health-analysis'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_RESEARCH,
        {
            name: DeepSeekModelType.DEEPSEEK_RESEARCH,
            displayName: 'DeepSeek Research',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Specialized for academic research and scientific analysis',
            maxTokens: 32768,
            contextLength: 128000,
            capabilities: ['academic-research', 'scientific-analysis', 'paper-writing'],
            version: '2025-01'
        }
    ],
    
    // Multimodal models
    [
        DeepSeekModelType.DEEPSEEK_OMNI,
        {
            name: DeepSeekModelType.DEEPSEEK_OMNI,
            displayName: 'DeepSeek Omni',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Multimodal model supporting text, image, and audio',
            maxTokens: 16384,
            contextLength: 64000,
            capabilities: ['text-generation', 'image-understanding', 'audio-processing', 'multimodal'],
            version: '2025-01'
        }
    ],
    [
        DeepSeekModelType.DEEPSEEK_OMNI_PRO,
        {
            name: DeepSeekModelType.DEEPSEEK_OMNI_PRO,
            displayName: 'DeepSeek Omni Pro',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Professional multimodal model with advanced capabilities',
            maxTokens: 32768,
            contextLength: 128000,
            capabilities: ['text-generation', 'multimodal', 'complex-reasoning', 'expert-analysis'],
            version: '2025-01'
        }
    ],
    
    // Legacy models
    [
        DeepSeekModelType.DEEPSEEK_LLM,
        {
            name: DeepSeekModelType.DEEPSEEK_LLM,
            displayName: 'DeepSeek LLM',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            format: 'openai',
            description: 'Base large language model',
            maxTokens: 4096,
            contextLength: 16000,
            capabilities: ['text-generation'],
            version: '2024-12'
        }
    ]
]);

export function getDeepSeekModel(type: DeepSeekModelType): DeepSeekModel | undefined {
    return DEEPSEEK_MODELS.get(type);
}

export function getAllDeepSeekModels(): DeepSeekModel[] {
    return Array.from(DEEPSEEK_MODELS.values());
}

export function getDeepSeekModelByName(name: string): DeepSeekModel | undefined {
    for (const model of DEEPSEEK_MODELS.values()) {
        if (model.name === name) {
            return model;
        }
    }
    return undefined;
}

export function getAvailableDeepSeekModelTypes(): DeepSeekModelType[] {
    return Array.from(DEEPSEEK_MODELS.keys());
}

// Helper functions for specific model categories
export function getDeepSeekTextModels(): DeepSeekModel[] {
    return getAllDeepSeekModels().filter(model => 
        model.capabilities?.includes('text-generation') && 
        !model.capabilities?.includes('image-understanding') &&
        !model.capabilities?.includes('audio-processing')
    );
}

export function getDeepSeekCodingModels(): DeepSeekModel[] {
    return getAllDeepSeekModels().filter(model => 
        model.capabilities?.includes('code-generation') ||
        model.capabilities?.includes('programming')
    );
}

export function getDeepSeekReasoningModels(): DeepSeekModel[] {
    return getAllDeepSeekModels().filter(model => 
        model.capabilities?.includes('reasoning') ||
        model.capabilities?.includes('logical-reasoning') ||
        model.capabilities?.includes('complex-reasoning')
    );
}

export function getDeepSeekFinancialModels(): DeepSeekModel[] {
    return getAllDeepSeekModels().filter(model => 
        model.capabilities?.includes('financial-analysis') ||
        model.capabilities?.includes('market-prediction')
    );
}

export function getDeepSeekSpecializedModels(): DeepSeekModel[] {
    const specializedCapabilities = [
        'financial-analysis', 
        'medical-consultation', 
        'mathematical-reasoning',
        'legal-analysis',
        'academic-research'
    ];
    return getAllDeepSeekModels().filter(model => 
        model.capabilities?.some(cap => specializedCapabilities.includes(cap))
    );
}

export function getDeepSeekMultimodalModels(): DeepSeekModel[] {
    return getAllDeepSeekModels().filter(model => 
        model.capabilities?.includes('multimodal')
    );
}

export function getBestModelForTask(taskType: string): DeepSeekModel | undefined {
    const models = getAllDeepSeekModels();
    
    switch (taskType.toLowerCase()) {
        case 'chat':
        case 'conversation':
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_CHAT_PRO);
            
        case 'coding':
        case 'programming':
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_CODER);
            
        case 'reasoning':
        case 'analysis':
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_REASONER_PRO);
            
        case 'finance':
        case 'financial':
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_FINANCE);
            
        case 'math':
        case 'mathematics':
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_MATH_PRO);
            
        case 'vision':
        case 'image':
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_VISION_PRO);
            
        case 'multimodal':
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_OMNI_PRO);
            
        case 'research':
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_RESEARCH);
            
        default:
            return models.find(m => m.name === DeepSeekModelType.DEEPSEEK_CHAT);
    }
}