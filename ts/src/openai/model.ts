export enum OpenAIModelType {
  // GPT-4 Series
  GPT4 = 'gpt-4',
  GPT4_0314 = 'gpt-4-0314',
  GPT4_0613 = 'gpt-4-0613',
  GPT4_32K = 'gpt-4-32k',
  GPT4_32K_0314 = 'gpt-4-32k-0314',
  GPT4_32K_0613 = 'gpt-4-32k-0613',
  GPT4_TURBO = 'gpt-4-turbo',
  GPT4_TURBO_PREVIEW = 'gpt-4-turbo-preview',
  GPT4_TURBO_2024_04_09 = 'gpt-4-turbo-2024-04-09',
  GPT4_OMNI = 'gpt-4o',
  GPT4_OMNI_2024_05_13 = 'gpt-4o-2024-05-13',
  GPT4_OMNI_MINI = 'gpt-4o-mini',
  GPT4_OMNI_MINI_2024_07_18 = 'gpt-4o-mini-2024-07-18',
  // GPT-3.5 Series
  GPT3_5_TURBO = 'gpt-3.5-turbo',
  GPT3_5_TURBO_0125 = 'gpt-3.5-turbo-0125',
  GPT3_5_TURBO_1106 = 'gpt-3.5-turbo-1106',
  GPT3_5_TURBO_INSTRUCT = 'gpt-3.5-turbo-instruct',
  GPT3_5_TURBO_16K = 'gpt-3.5-turbo-16k',
  GPT3_5_TURBO_16K_0613 = 'gpt-3.5-turbo-16k-0613',
  // GPT-3 Series
  DAVINCI_002 = 'davinci-002',
  BABBAGE_002 = 'babbage-002',
  TEXT_DAVINCI_003 = 'text-davinci-003',
  TEXT_DAVINCI_002 = 'text-davinci-002',
  TEXT_DAVINCI_001 = 'text-davinci-001',
  TEXT_CURIE_001 = 'text-curie-001',
  TEXT_BABBAGE_001 = 'text-babbage-001',
  TEXT_ADA_001 = 'text-ada-001',
  // Embedding Models
  TEXT_EMBEDDING_ADA_002 = 'text-embedding-ada-002',
  TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small',
  TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large',
  // DALL-E Image Generation
  DALL_E_2 = 'dall-e-2',
  DALL_E_3 = 'dall-e-3',
  // Whisper Audio
  WHISPER_1 = 'whisper-1',
  // TTS Text-to-Speech
  TTS_1 = 'tts-1',
  TTS_1_HD = 'tts-1-hd',
  // Moderation Models
  MODERATION_LATEST = 'text-moderation-latest',
  MODERATION_STABLE = 'text-moderation-stable',

  // Fine-tuned Models
  GPT3_5_TURBO_FINETUNED = 'ft:gpt-3.5-turbo-0125:personal:',
  GPT4_FINETUNED = 'ft:gpt-4-0125-preview:personal:',

  // Vision Models
  GPT4_VISION_PREVIEW = 'gpt-4-vision-preview',
}

export interface OpenAIModel {
  name: string;
  displayName: string;
  endpoint: string;
  format: 'openai';
  description: string;
  maxTokens?: number;
  contextLength?: number;
  capabilities: string[];
  inputCostPer1KTokens?: number;  // Input token cost (USD per 1K tokens)
  outputCostPer1KTokens?: number; // Output token cost (USD per 1K tokens)
  supportedFeatures?: string[];   // Supported API features
}

export const OPENAI_MODELS: Map<OpenAIModelType, OpenAIModel> = new Map([
  // GPT-4 Series
  [
    OpenAIModelType.GPT4,
    {
      name: OpenAIModelType.GPT4,
      displayName: 'GPT-4',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      format: 'openai',
      description: 'Powerful multi-purpose model for complex tasks',
      maxTokens: 8192,
      contextLength: 8192,
      capabilities: ['chat', 'text-generation', 'reasoning', 'analysis'],
      inputCostPer1KTokens: 0.03,
      outputCostPer1KTokens: 0.06,
      supportedFeatures: ['chat', 'function-calling']
    }
  ],
  [
    OpenAIModelType.GPT4_TURBO,
    {
      name: OpenAIModelType.GPT4_TURBO,
      displayName: 'GPT-4 Turbo',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      format: 'openai',
      description: 'Enhanced GPT-4 with 128K context, knowledge cutoff April 2023',
      maxTokens: 4096,
      contextLength: 128000,
      capabilities: ['chat', 'text-generation', 'reasoning', 'analysis', 'vision'],
      inputCostPer1KTokens: 0.01,
      outputCostPer1KTokens: 0.03,
      supportedFeatures: ['chat', 'function-calling', 'vision', 'json-mode']
    }
  ],
  [
    OpenAIModelType.GPT4_OMNI,
    {
      name: OpenAIModelType.GPT4_OMNI,
      displayName: 'GPT-4o',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      format: 'openai',
      description: 'Versatile model supporting text, images, audio with fast response',
      maxTokens: 4096,
      contextLength: 128000,
      capabilities: ['chat', 'text-generation', 'vision', 'audio-processing', 'multimodal'],
      inputCostPer1KTokens: 0.005,
      outputCostPer1KTokens: 0.015,
      supportedFeatures: ['chat', 'function-calling', 'vision', 'audio', 'json-mode']
    }
  ],
  [
    OpenAIModelType.GPT4_OMNI_MINI,
    {
      name: OpenAIModelType.GPT4_OMNI_MINI,
      displayName: 'GPT-4o Mini',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      format: 'openai',
      description: 'Compact and efficient version of GPT-4o with lower cost',
      maxTokens: 16384,
      contextLength: 128000,
      capabilities: ['chat', 'text-generation', 'vision'],
      inputCostPer1KTokens: 0.00015,
      outputCostPer1KTokens: 0.0006,
      supportedFeatures: ['chat', 'function-calling', 'vision', 'json-mode']
    }
  ],

  // GPT-3.5 Series
  [
    OpenAIModelType.GPT3_5_TURBO,
    {
      name: OpenAIModelType.GPT3_5_TURBO,
      displayName: 'GPT-3.5 Turbo',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      format: 'openai',
      description: 'Fast and cost-effective, suitable for most conversational tasks',
      maxTokens: 4096,
      contextLength: 16385,
      capabilities: ['chat', 'text-generation', 'code-generation'],
      inputCostPer1KTokens: 0.0005,
      outputCostPer1KTokens: 0.0015,
      supportedFeatures: ['chat', 'function-calling']
    }
  ],
  [
    OpenAIModelType.GPT3_5_TURBO_INSTRUCT,
    {
      name: OpenAIModelType.GPT3_5_TURBO_INSTRUCT,
      displayName: 'GPT-3.5 Turbo Instruct',
      endpoint: 'https://api.openai.com/v1/completions',
      format: 'openai',
      description: 'Instruction-tuned version for text completion tasks',
      maxTokens: 4096,
      contextLength: 4097,
      capabilities: ['text-completion', 'instruction-following'],
      inputCostPer1KTokens: 0.0015,
      outputCostPer1KTokens: 0.0020,
      supportedFeatures: ['completions']
    }
  ],

  // Embedding Models
  [
    OpenAIModelType.TEXT_EMBEDDING_ADA_002,
    {
      name: OpenAIModelType.TEXT_EMBEDDING_ADA_002,
      displayName: 'Text Embedding Ada 002',
      endpoint: 'https://api.openai.com/v1/embeddings',
      format: 'openai',
      description: 'Text embedding model, 1536 dimensions, suitable for retrieval and similarity',
      contextLength: 8191,
      capabilities: ['embeddings', 'semantic-search'],
      inputCostPer1KTokens: 0.0001,
      supportedFeatures: ['embeddings']
    }
  ],
  [
    OpenAIModelType.TEXT_EMBEDDING_3_SMALL,
    {
      name: OpenAIModelType.TEXT_EMBEDDING_3_SMALL,
      displayName: 'Text Embedding 3 Small',
      endpoint: 'https://api.openai.com/v1/embeddings',
      format: 'openai',
      description: 'Small text embedding model, 1536 dimensions, balance of performance and cost',
      contextLength: 8191,
      capabilities: ['embeddings', 'semantic-search'],
      inputCostPer1KTokens: 0.00002,
      supportedFeatures: ['embeddings']
    }
  ],

  // DALL-E Image Generation
  [
    OpenAIModelType.DALL_E_3,
    {
      name: OpenAIModelType.DALL_E_3,
      displayName: 'DALL-E 3',
      endpoint: 'https://api.openai.com/v1/images/generations',
      format: 'openai',
      description: 'Advanced image generation model producing high-quality, high-resolution images',
      capabilities: ['image-generation', 'creative-design'],
      inputCostPer1KTokens: 0.04, // Cost per image
      supportedFeatures: ['image-generation', 'variations', 'edits']
    }
  ],

  // Whisper Speech Recognition
  [
    OpenAIModelType.WHISPER_1,
    {
      name: OpenAIModelType.WHISPER_1,
      displayName: 'Whisper',
      endpoint: 'https://api.openai.com/v1/audio/transcriptions',
      format: 'openai',
      description: 'Speech recognition model supporting multilingual transcription and translation',
      capabilities: ['speech-recognition', 'audio-transcription', 'translation'],
      inputCostPer1KTokens: 0.006, // Cost per minute of audio
      supportedFeatures: ['transcriptions', 'translations']
    }
  ],

  // TTS Text-to-Speech
  [
    OpenAIModelType.TTS_1_HD,
    {
      name: OpenAIModelType.TTS_1_HD,
      displayName: 'TTS-1 HD',
      endpoint: 'https://api.openai.com/v1/audio/speech',
      format: 'openai',
      description: 'High-quality text-to-speech with multiple voice options',
      capabilities: ['speech-synthesis', 'text-to-speech'],
      inputCostPer1KTokens: 0.015, // Cost per thousand characters
      supportedFeatures: ['speech', 'voice-selection']
    }
  ],

  // Moderation Models
  [
    OpenAIModelType.MODERATION_LATEST,
    {
      name: OpenAIModelType.MODERATION_LATEST,
      displayName: 'Moderation Latest',
      endpoint: 'https://api.openai.com/v1/moderations',
      format: 'openai',
      description: 'Content moderation model for detecting harmful content',
      capabilities: ['content-moderation', 'safety'],
      inputCostPer1KTokens: 0.0001,
      supportedFeatures: ['moderation']
    }
  ],
]);

// Helper functions
export function getOpenAIModel(type: OpenAIModelType): OpenAIModel | undefined {
  return OPENAI_MODELS.get(type);
}

export function getAllOpenAIModels(): OpenAIModel[] {
  return Array.from(OPENAI_MODELS.values());
}

export function getOpenAIModelByName(name: string): OpenAIModel | undefined {
  for (const model of OPENAI_MODELS.values()) {
    if (model.name === name) {
      return model;
    }
  }
  return undefined;
}

export function getAvailableOpenAIModelTypes(): OpenAIModelType[] {
  return Array.from(OPENAI_MODELS.keys());
}

// Category-based helper functions
export function getChatModels(): OpenAIModel[] {
  return getAllOpenAIModels().filter(model =>
    model.capabilities.includes('chat')
  );
}

export function getCompletionModels(): OpenAIModel[] {
  return getAllOpenAIModels().filter(model =>
    model.capabilities.includes('text-completion')
  );
}

export function getEmbeddingModels(): OpenAIModel[] {
  return getAllOpenAIModels().filter(model =>
    model.capabilities.includes('embeddings')
  );
}

export function getVisionModelsOpenAI(): OpenAIModel[] {
  return getAllOpenAIModels().filter(model =>
    model.capabilities.includes('vision') ||
    model.capabilities.includes('image-generation')
  );
}

export function getAudioModelsOpenAI(): OpenAIModel[] {
  return getAllOpenAIModels().filter(model =>
    model.capabilities.includes('audio-processing') ||
    model.capabilities.includes('speech-recognition') ||
    model.capabilities.includes('speech-synthesis')
  );
}

export function getMultimodalModelsOpenAI(): OpenAIModel[] {
  return getAllOpenAIModels().filter(model =>
    model.capabilities.includes('multimodal')
  );
}

export function getLatestModels(): OpenAIModel[] {
  const latestModels = [
    OpenAIModelType.GPT4_OMNI,
    OpenAIModelType.GPT4_OMNI_MINI,
    OpenAIModelType.GPT4_TURBO,
    OpenAIModelType.GPT3_5_TURBO,
    OpenAIModelType.TEXT_EMBEDDING_3_SMALL,
    OpenAIModelType.DALL_E_3,
  ];
  return getAllOpenAIModels().filter(model =>
    latestModels.includes(model.name as OpenAIModelType)
  );
}

export function getCostEfficientModels(): OpenAIModel[] {
  return getAllOpenAIModels()
    .filter(model => model.inputCostPer1KTokens && model.inputCostPer1KTokens < 0.001)
    .sort((a, b) => (a.inputCostPer1KTokens || 0) - (b.inputCostPer1KTokens || 0));
}

export function getHighContextModels(): OpenAIModel[] {
  return getAllOpenAIModels()
    .filter(model => model.contextLength && model.contextLength >= 128000)
    .sort((a, b) => (b.contextLength || 0) - (a.contextLength || 0));
}

// Cost estimation helper
export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export function estimateCost(
  model: OpenAIModel,
  inputTokens: number,
  outputTokens: number = 0
): CostEstimate {
  const inputCost = ((model.inputCostPer1KTokens || 0) / 1000) * inputTokens;
  const outputCost = ((model.outputCostPer1KTokens || 0) / 1000) * outputTokens;
  return {
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost
  };
}

// Model suggestion
export function suggestModel(
  requirements: {
    taskType: 'chat' | 'completion' | 'embedding' | 'image' | 'audio';
    budget?: number;
    contextLength?: number;
    features?: string[];
  }
): OpenAIModel[] {
  let candidates = getAllOpenAIModels();
  // Filter by task type
  switch (requirements.taskType) {
    case 'chat':
      candidates = candidates.filter(m => m.capabilities.includes('chat'));
      break;
    case 'completion':
      candidates = candidates.filter(m => m.capabilities.includes('text-completion'));
      break;
    case 'embedding':
      candidates = candidates.filter(m => m.capabilities.includes('embeddings'));
      break;
    case 'image':
      candidates = candidates.filter(m =>
        m.capabilities.includes('image-generation') ||
        m.capabilities.includes('vision')
      );
      break;
    case 'audio':
      candidates = candidates.filter(m =>
        m.capabilities.includes('speech-recognition') ||
        m.capabilities.includes('speech-synthesis')
      );
      break;
  }
  // Filter by context length
  if (requirements.contextLength) {
    candidates = candidates.filter(m =>
      m.contextLength && m.contextLength >= requirements.contextLength!
    );
  }
  // Filter by feature requirements
  if (requirements.features && requirements.features.length > 0) {
    candidates = candidates.filter(m =>
      requirements.features!.every(feature =>
        m.supportedFeatures?.includes(feature) || m.capabilities.includes(feature)
      )
    );
  }
  // Sort by budget if provided
  if (requirements.budget) {
    candidates.sort((a, b) =>
      (a.inputCostPer1KTokens || 0) - (b.inputCostPer1KTokens || 0)
    );
  }
  return candidates.slice(0, 5); // Return top 5 recommendations
}

export function stringToOpenAIModelType(modelString: string): OpenAIModelType | null {
  const validValues = Object.values(OpenAIModelType);
  for (const value of validValues) {
    if (value === modelString) {
      return value as OpenAIModelType;
    }
  }
  return null;
}