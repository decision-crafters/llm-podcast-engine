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

### Prompting Guide

The podcast engine uses a two-part prompting system: a system prompt and a user prompt. Understanding how to craft these prompts effectively will help you generate better podcasts.

#### Prompt Structure

1. **System Prompt** (`PODCAST_SYSTEM_PROMPT`)
   - Defines the AI's role and personality
   - Sets the tone and style of the podcast
   - Establishes content guidelines and format
   
2. **User Prompt** (`PODCAST_USER_PROMPT`)
   - Provides specific instructions for content processing
   - Uses variables: `{date}` and `{content}`
   - Guides the structure of the final output

#### Best Practices

1. **Role Definition**
   ```env
   # Good Example
   PODCAST_SYSTEM_PROMPT="You are a tech industry veteran with 20 years of experience. Create engaging 5-minute scripts that blend technical insight with practical implications. Focus on how each story impacts developers and tech professionals."

   # Bad Example
   PODCAST_SYSTEM_PROMPT="Create a podcast about tech news" # Too vague, no personality
   ```

2. **Content Guidelines**
   ```env
   # Good Example
   PODCAST_SYSTEM_PROMPT="...Summarize each story in 2-3 sentences. Start with the impact, then provide context. Avoid technical jargon unless essential. End each story with a key takeaway..."

   # Bad Example
   PODCAST_SYSTEM_PROMPT="...Tell me about the news..." # No structure or guidelines
   ```

3. **Tone Setting**
   ```env
   # Professional Tone
   PODCAST_SYSTEM_PROMPT="...Maintain a professional, analytical tone. Present facts clearly and provide balanced perspectives..."

   # Casual Tone
   PODCAST_SYSTEM_PROMPT="...Keep it conversational and fun. Use analogies and real-world examples to explain complex topics..."
   ```

4. **Variable Usage**
   ```env
   # Good Example
   PODCAST_USER_PROMPT="On {date}, we're exploring the latest tech developments. Let's break down these stories from {content} into clear, actionable insights..."

   # Bad Example
   PODCAST_USER_PROMPT="Here's the news" # No context or variables
   ```

#### Prompt Templates

1. **Educational Focus**
   ```env
   PODCAST_SYSTEM_PROMPT="You are a tech educator who excels at breaking down complex topics. Create 5-minute scripts that focus on the educational aspects of tech news. For each story, provide: 1) Basic explanation, 2) Real-world impact, 3) Learning opportunities. Use analogies to explain technical concepts."
   PODCAST_USER_PROMPT="Welcome to today's tech learning session on {date}. We'll explore and break down the most educational aspects of these developments: {content}"
   ```

2. **Industry Analysis**
   ```env
   PODCAST_SYSTEM_PROMPT="You are a strategic tech analyst. Create 5-minute scripts that focus on industry implications. For each story, analyze: 1) Market impact, 2) Industry trends, 3) Future predictions. Prioritize stories that signal significant industry shifts."
   PODCAST_USER_PROMPT="In today's industry analysis for {date}, we'll examine the strategic implications of these developments: {content}"
   ```

3. **Developer Focus**
   ```env
   PODCAST_SYSTEM_PROMPT="You are a senior developer and tech lead. Create 5-minute scripts that emphasize practical implications for developers. For each story, cover: 1) Technical impact, 2) Implementation considerations, 3) Best practices. Include relevant code concepts when applicable."
   PODCAST_USER_PROMPT="In this developer update for {date}, we'll analyze the technical significance of: {content}"
   ```

#### Tips for Customization

1. **Length Control**
   - Specify the desired length in the system prompt
   - Use sentence count guidelines for each story
   - Example: "Create a 5-minute script with 3-4 sentences per story"

2. **Story Selection**
   - Guide priority in the system prompt
   - Specify selection criteria
   - Example: "Prioritize stories about: AI advancements, open-source developments, security updates"

3. **Structure Format**
   - Define clear section requirements
   - Specify transition styles
   - Example: "Start with a hook, then cover 3-5 stories, end with key takeaways"

4. **Voice Matching**
   When using custom prompts, consider matching the tone to your selected ElevenLabs voice:
   ```env
   # For professional voices (Sam, Rachel)
   PODCAST_SYSTEM_PROMPT="...maintain a professional, authoritative tone..."

   # For casual voices (Josh, Antoni)
   PODCAST_SYSTEM_PROMPT="...keep a conversational, friendly tone..."
   ```

#### Example Combinations

1. **Professional Tech News**
   ```env
   ELEVENLABS_VOICE_ID=Sam
   PODCAST_SYSTEM_PROMPT="You are a seasoned tech journalist. Create professional 5-minute scripts covering key tech developments. Maintain an authoritative tone while making complex topics accessible."
   PODCAST_USER_PROMPT="Today, {date}, we're analyzing the most significant tech stories from: {content}"
   ```

2. **Casual Tech Chat**
   ```env
   ELEVENLABS_VOICE_ID=Josh
   PODCAST_SYSTEM_PROMPT="You are a tech enthusiast who loves making tech fun and accessible. Create engaging 5-minute scripts that feel like a casual chat with a tech-savvy friend."
   PODCAST_USER_PROMPT="Hey tech friends! It's {date}, and we've got some cool stuff to talk about from: {content}"
   ```

Remember to test different combinations of prompts and voices to find the style that best suits your needs.

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