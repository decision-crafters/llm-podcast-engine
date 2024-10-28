# LLM Podcast Engine

This is a Next.js application that uses machine learning to generate a podcast from news articles.

## Getting Started

1. **Clone the repository:**

   ```
   git clone https://github.com/developersdigest/llm-podcast-engine.git
   ```

2. **Install dependencies:**

   ```
   cd llm-podcast-engine
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   GROQ_API_KEY=your_groq_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

   You can obtain these API keys from the following sources:
   - [FireCrawl API Key](https://www.firecrawl.dev/app/api-keys)
   - [GROQ API Key](https://console.groq.com/keys)
   - [ElevenLabs API Key](https://try.elevenlabs.io/ghybe9fk5htz)

4. **Start the development server:**

   ```
   pnpm dev
   ```

   This will start the Next.js development server and you can access the application at `http://localhost:3000`.

## License

This project is licensed under the [MIT License](LICENSE).