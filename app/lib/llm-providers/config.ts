import { LLMConfig, LLMProvider, defaultConfigs } from '.'

// Environment variable names for different providers
const ENV_KEYS = {
  [LLMProvider.GROQ]: 'GROQ_API_KEY',
  [LLMProvider.OPENAI]: 'OPENAI_API_KEY',
  [LLMProvider.ANTHROPIC]: 'ANTHROPIC_API_KEY',
  [LLMProvider.MISTRAL]: 'MISTRAL_API_KEY',
  [LLMProvider.GEMINI]: 'GEMINI_API_KEY',
  [LLMProvider.OLLAMA]: 'OLLAMA_API_KEY',
}

// Custom model environment variables
const MODEL_ENV_KEYS = {
  [LLMProvider.GROQ]: 'GROQ_MODEL',
  [LLMProvider.OPENAI]: 'OPENAI_MODEL',
  [LLMProvider.ANTHROPIC]: 'ANTHROPIC_MODEL',
  [LLMProvider.MISTRAL]: 'MISTRAL_MODEL',
  [LLMProvider.GEMINI]: 'GEMINI_MODEL',
  [LLMProvider.OLLAMA]: 'OLLAMA_MODEL',
}

// Get configuration for a specific provider
export function getProviderConfig(provider: LLMProvider, customConfig?: Partial<LLMConfig>): LLMConfig {
  // If custom config is provided with an API key, use that
  if (customConfig?.apiKey) {
    return {
      ...defaultConfigs[provider],
      ...customConfig,
      provider,
      apiKey: customConfig.apiKey,
    }
  }

  // Otherwise, try to get the API key from environment variables
  const apiKey = process.env[ENV_KEYS[provider]]
  if (!apiKey) {
    throw new Error(`API key not found for provider ${provider}. Please set ${ENV_KEYS[provider]} environment variable or provide a custom API key.`)
  }

  // Check for custom model in environment variables
  const customModel = process.env[MODEL_ENV_KEYS[provider]]

  return {
    ...defaultConfigs[provider],
    provider,
    apiKey,
    model: customModel || defaultConfigs[provider].model,
    customModel: !!customModel,
  }
}

// Get all available providers (those with API keys configured)
export function getAvailableProviders(): LLMProvider[] {
  return Object.values(LLMProvider).filter(provider => 
    process.env[ENV_KEYS[provider]] !== undefined
  )
}

// Get the default provider (Groq if available, otherwise first available provider)
export function getDefaultProvider(): LLMProvider {
  const availableProviders = getAvailableProviders()
  
  if (availableProviders.includes(LLMProvider.GROQ)) {
    return LLMProvider.GROQ
  }
  
  if (availableProviders.length === 0) {
    throw new Error('No LLM providers configured. Please set at least one provider\'s API key in environment variables.')
  }
  
  return availableProviders[0]
} 