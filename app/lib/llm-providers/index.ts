import { OpenAI } from 'openai'
import { ChatCompletionCreateParams } from 'openai/resources/chat/completions'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Define supported LLM providers
export enum LLMProvider {
  GROQ = 'groq',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  MISTRAL = 'mistral',
  GEMINI = 'gemini',
  OLLAMA = 'ollama'
}

// Interface for LLM configuration
export interface LLMConfig {
  provider: LLMProvider
  apiKey: string
  model: string
  baseURL?: string
  temperature?: number
  maxTokens?: number
  customModel?: boolean // Flag to indicate if this is a custom model configuration
}

// Interface for streaming response
export interface StreamResponse {
  content: string
  done: boolean
}

// Base class for LLM providers
export abstract class BaseLLMProvider {
  protected config: LLMConfig

  constructor(config: LLMConfig) {
    this.config = config
  }

  abstract generateText(prompt: string, systemPrompt: string): AsyncGenerator<StreamResponse>
}

// OpenAI-compatible provider (works with Groq, OpenAI, etc.)
export class OpenAICompatibleProvider extends BaseLLMProvider {
  private client: OpenAI

  constructor(config: LLMConfig) {
    super(config)
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    })
  }

  async *generateText(prompt: string, systemPrompt: string): AsyncGenerator<StreamResponse> {
    const params: ChatCompletionCreateParams = {
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: this.config.temperature ?? 0.7,
      max_tokens: this.config.maxTokens,
      stream: true,
    }

    const stream = await this.client.chat.completions.create(params)

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      yield {
        content,
        done: chunk.choices[0]?.finish_reason === 'stop'
      }
    }
  }
}

// Gemini provider
export class GeminiProvider extends BaseLLMProvider {
  private client: GoogleGenerativeAI

  constructor(config: LLMConfig) {
    super(config)
    this.client = new GoogleGenerativeAI(config.apiKey)
  }

  async *generateText(prompt: string, systemPrompt: string): AsyncGenerator<StreamResponse> {
    const model = this.client.getGenerativeModel({ model: this.config.model })
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand and will follow these instructions.' }],
        },
      ],
    })

    const result = await chat.sendMessageStream([{ text: prompt }])
    
    for await (const chunk of result.stream) {
      const text = chunk.text()
      yield {
        content: text,
        done: false
      }
    }
    
    yield {
      content: '',
      done: true
    }
  }
}

// Ollama provider
export class OllamaProvider extends BaseLLMProvider {
  constructor(config: LLMConfig) {
    super(config)
  }

  async *generateText(prompt: string, systemPrompt: string): AsyncGenerator<StreamResponse> {
    const response = await fetch(`${this.config.baseURL || 'http://localhost:11434'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        stream: true,
      }),
    })

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (!line) continue
        try {
          const data = JSON.parse(line)
          yield {
            content: data.message?.content || '',
            done: data.done || false
          }
        } catch (e) {
          console.error('Error parsing Ollama response:', e)
        }
      }
    }
  }
}

// Factory function to create LLM provider instances
export function createLLMProvider(config: LLMConfig): BaseLLMProvider {
  switch (config.provider) {
    case LLMProvider.GROQ:
    case LLMProvider.OPENAI:
    case LLMProvider.ANTHROPIC:
    case LLMProvider.MISTRAL:
      return new OpenAICompatibleProvider({
        ...config,
        baseURL: config.provider === LLMProvider.GROQ 
          ? 'https://api.groq.com/openai/v1'
          : config.provider === LLMProvider.ANTHROPIC
            ? 'https://api.anthropic.com/v1'
            : config.provider === LLMProvider.MISTRAL
              ? 'https://api.mistral.ai/v1'
              : undefined
      })
    case LLMProvider.GEMINI:
      return new GeminiProvider(config)
    case LLMProvider.OLLAMA:
      return new OllamaProvider(config)
    default:
      throw new Error(`Unsupported LLM provider: ${config.provider}`)
  }
}

// Default configurations for different providers
export const defaultConfigs: Record<LLMProvider, Omit<LLMConfig, 'apiKey'>> = {
  [LLMProvider.GROQ]: {
    provider: LLMProvider.GROQ,
    model: 'deepseek-r1-distill-qwen-32b',
    temperature: 0.7,
    maxTokens: 2000
  },
  [LLMProvider.OPENAI]: {
    provider: LLMProvider.OPENAI,
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000
  },
  [LLMProvider.ANTHROPIC]: {
    provider: LLMProvider.ANTHROPIC,
    model: 'claude-3-opus-20240229',
    temperature: 0.7,
    maxTokens: 2000
  },
  [LLMProvider.MISTRAL]: {
    provider: LLMProvider.MISTRAL,
    model: 'mistral-large-latest',
    temperature: 0.7,
    maxTokens: 2000
  },
  [LLMProvider.GEMINI]: {
    provider: LLMProvider.GEMINI,
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 2000
  },
  [LLMProvider.OLLAMA]: {
    provider: LLMProvider.OLLAMA,
    model: 'llama2',
    temperature: 0.7,
    maxTokens: 2000,
    baseURL: 'http://localhost:11434'
  }
} 