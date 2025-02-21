#!/bin/bash

# Step 1: Set up environment variables
echo "Setting up environment variables..."
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  exit 1
fi

# Load environment variables
while IFS= read -r line; do
  if [[ ! "$line" =~ ^#.*$ ]] && [[ -n "$line" ]]; then
    export "$line"
  fi
done < .env

# Check for required API keys
echo "Checking for required API keys..."
if [ -z "$FIRECRAWL_API_KEY" ] || [ -z "$ELEVENLABS_API_KEY" ]; then
  echo "Error: FIRECRAWL_API_KEY and ELEVENLABS_API_KEY are required!"
  exit 1
fi

# Check for at least one LLM provider
if [ -z "$GROQ_API_KEY" ] && [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$MISTRAL_API_KEY" ] && [ -z "$GEMINI_API_KEY" ] && [ -z "$OLLAMA_API_KEY" ]; then
  echo "Error: At least one LLM provider API key is required!"
  exit 1
fi

# Step 2: Create necessary directories
echo "Creating necessary directories..."
mkdir -p public

# Step 3: Install dependencies
echo "Installing dependencies..."
if ! pnpm install; then
  echo "Error: Failed to install dependencies!"
  exit 1
fi

# Step 4: Build the application
echo "Building the application..."
if ! pnpm build; then
  echo "Error: Build failed!"
  exit 1
fi

# Step 5: Start the application
echo "Starting the application on port 3000..."
if ! pnpm start --port 3000; then
  echo "Error: Failed to start the application!"
  exit 1
fi

echo "Deployment completed. The application is running locally on port 3000." 