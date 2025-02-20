# LLM Podcast Engine

This is a Next.js application that uses machine learning to generate a podcast from news articles.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/developersdigest/llm-podcast-engine.git
   ```

2. **Install dependencies:**

   ```bash
   cd llm-podcast-engine
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   # Required Services
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key

   # LLM Providers (at least one is required)
   GROQ_API_KEY=your_groq_api_key
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   GEMINI_API_KEY=your_gemini_api_key
   OLLAMA_API_KEY=your_ollama_api_key

   # Optional: Custom Model Names
   GROQ_MODEL=your_custom_groq_model
   OPENAI_MODEL=your_custom_openai_model
   ANTHROPIC_MODEL=your_custom_anthropic_model
   MISTRAL_MODEL=your_custom_mistral_model
   GEMINI_MODEL=your_custom_gemini_model
   OLLAMA_MODEL=your_custom_ollama_model

   # Optional: Ollama Configuration
   OLLAMA_BASE_URL=http://localhost:11434
   ```

   You can obtain these API keys from the following sources:
   - [FireCrawl API Key](https://www.firecrawl.dev/app/api-keys)
   - [ElevenLabs API Key](https://try.elevenlabs.io/ghybe9fk5htz)
   - [Groq API Key](https://console.groq.com/keys)
   - [OpenAI API Key](https://platform.openai.com/api-keys)
   - [Anthropic API Key](https://console.anthropic.com/account/keys)
   - [Mistral API Key](https://console.mistral.ai/api-keys/)
   - [Google AI Studio (Gemini) API Key](https://makersuite.google.com/app/apikey)
   - Ollama: No API key required for local deployment

4. **Deploy the application:**

   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

   This will:
   - Create necessary directories
   - Install dependencies
   - Build the application
   - Start the server on port 3000

   Access the application at `http://localhost:3000`.

## Features

### Multi-LLM Support

The application supports multiple Language Model providers:

1. **Groq** (Default)
   - Default Model: deepseek-r1-distill-qwen-32b
   - Fast inference with OpenAI-compatible API

2. **OpenAI**
   - Default Model: gpt-4-turbo-preview
   - High-quality text generation

3. **Anthropic**
   - Default Model: claude-3-opus-20240229
   - Advanced reasoning capabilities

4. **Mistral**
   - Default Model: mistral-large-latest
   - Open-source foundation model

5. **Gemini**
   - Default Model: gemini-pro
   - Google's latest language model
   - Support for experimental models

6. **Ollama**
   - Default Model: llama2
   - Local deployment option
   - Support for various open-source models

### Custom Configuration

You can customize the LLM configuration in two ways:

1. **Environment Variables**
   - Set custom model names using environment variables (e.g., `GROQ_MODEL`)
   - Configure provider-specific settings (e.g., `OLLAMA_BASE_URL`)
   - Changes persist between sessions

2. **User Interface**
   - Dynamically switch between providers
   - Input custom API keys for testing or temporary use
   - Specify custom model names per session
   - Changes don't persist between sessions (for security)

### Other Features

- Web scraping of news articles using FireCrawl
- Text-to-speech conversion using ElevenLabs
- Real-time streaming of generated content
- Modern, responsive UI with animations
- Download generated podcasts as MP3 files
- Automatic directory creation for audio files
- Secure handling of API keys and configurations

## Development

### Project Structure

```
llm-podcast-engine/
├── app/
│   ├── api/
│   │   └── generate-podcast/  # Podcast generation endpoint
│   └── lib/
│       └── llm-providers/     # LLM provider implementations
├── components/                 # React components
├── public/                    # Generated audio files (gitignored)
└── deploy.sh                  # Deployment script
```

### Adding New LLM Providers

1. Add the provider to the `LLMProvider` enum
2. Create a provider class implementing `BaseLLMProvider`
3. Add provider configuration to `defaultConfigs`
4. Update environment variable handling

## License

This project is licensed under the [MIT License](LICENSE).