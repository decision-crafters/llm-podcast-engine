// 1. Import necessary modules and types
import type { NextApiRequest, NextApiResponse } from 'next'
import FirecrawlApp from '@mendable/firecrawl-js'
import { OpenAI } from 'openai'
import { ElevenLabsClient } from "elevenlabs"
import dotenv from "dotenv"
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'

// 2. Load environment variables
dotenv.config()

// 3. Initialize FirecrawlApp for web scraping
console.log('Initializing FirecrawlApp')
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })
console.log('FirecrawlApp initialized')

// 4. Initialize OpenAI client for text generation
console.log('Initializing OpenAI')
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})
console.log('OpenAI initialized')

// 5. Initialize ElevenLabsClient for text-to-speech conversion
console.log('Initializing ElevenLabsClient')
const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
})
console.log('ElevenLabsClient initialized')

// 6. Function to create audio file from text
const createAudioFileFromText = async (text: string) => {
    console.log('Creating audio file from text')
    try {
        // 7. Generate audio using ElevenLabs API
        console.log('Generating audio')
        const audio = await client.generate({
            voice: "Rachel",
            model_id: "eleven_turbo_v2",
            text: text,
        })
        console.log('Audio generated')

        // 8. Create a unique filename and path for the audio file
        const fileName = `${new Date().toISOString().replace(/[:.]/g, '-')}.mp3`
        const filePath = path.join(process.cwd(), 'public', fileName)

        // 9. Convert the audio stream to a buffer
        const chunks: Buffer[] = []
        for await (const chunk of audio) {
            chunks.push(Buffer.from(chunk))
        }
        const audioBuffer = Buffer.concat(chunks)

        // 10. Write the audio buffer to a file
        await writeFile(filePath, audioBuffer)
        console.log('Audio file saved:', filePath)
        return fileName
    } catch (error) {
        console.error('Error in createAudioFileFromText:', error)
        throw error
    }
}

// 11. POST request handler for generating podcast
export async function POST(req: NextRequest) {
    console.log('POST request received')
    const { urls } = await req.json()
    console.log('URLs received:', urls)

    const encoder = new TextEncoder()

    // 12. Create a readable stream for sending updates to the client
    const stream = new ReadableStream({
        async start(controller) {
            try {
                // 13. Helper function to send updates to the client
                const sendUpdate = (message: string) => {
                    console.log('Sending update:', message)
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'update', message })}\n\n`))
                }

                // 14. Gather news from various sources
                sendUpdate("Gathering news from various sources...")
                const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                console.log('Current date:', currentDate)

                // 15. Scrape URLs for content
                console.log('Scraping URLs')
                const scrapePromises = urls.map((url: string) =>
                    app.scrapeUrl(url, { formats: ['markdown'] })
                )

                sendUpdate("Analyzing the latest headlines...")
                const scrapeResults = await Promise.all(scrapePromises)
                console.log('Scrape results received')

                // 16. Combine scraped content
                let combinedMarkdown = ''
                for (let i = 0; i < scrapeResults.length; i++) {
                    const result = scrapeResults[i]
                    if (result.success) {
                        console.log(`Adding content from ${urls[i]}`)
                        combinedMarkdown += `\n\nFrom ${urls[i]}:\n${result.markdown}`
                    }
                }

                if (combinedMarkdown === '') {
                    console.log('No content could be scraped')
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: "No content could be scraped" })}\n\n`))
                    controller.close()
                    return
                }

                // 17. Generate podcast script using OpenAI
                sendUpdate("Compiling the most interesting stories...")
                console.log('Creating chat completion')
                const llmStream = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are a witty tech news podcaster. Create a 5-minute script covering the top 5-10 most interesting tech stories. Summarize each story in 1-4 sentences, keeping the tone funny and entertaining. Aim for a mix of humor and information that will engage and amuse tech-savvy listeners. Focus solely on the content without any audio cues or formatting instructions. Return only the script that will be read by the text-to-speech system, without any additional instructions or metadata."
                        },
                        {
                            role: "user",
                            content: `It's ${currentDate}. Create a hilarious and informative 5-minute podcast script covering the top 5-10 tech stories from the following content. Make it entertaining and engaging for our tech-loving audience. Return only the script to be read, without any formatting or instructions: ${combinedMarkdown}`
                        }
                    ],
                    model: "llama-3.2-90b-text-preview",
                    stream: true,
                })

                // 18. Process the generated script
                sendUpdate("Crafting witty commentary...")
                let fullText = ''
                console.log('Processing LLM stream')
                for await (const chunk of llmStream) {
                    const content = chunk.choices[0]?.delta?.content || ''
                    fullText += content
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`))
                }
                console.log('LLM stream processing complete')

                // 19. Generate audio file from the script
                sendUpdate("Preparing your personalized news roundup...")
                console.log('Creating audio file')
                const audioFileName = await createAudioFileFromText(fullText)
                console.log('Audio file created:', audioFileName)

                // 20. Send completion message with audio file name
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', audioFileName })}\n\n`))
                controller.close()
            } catch (error) {
                console.error('Error in stream processing:', error)
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'An error occurred while generating the podcast' })}\n\n`))
                controller.close()
            }
        }
    })

    // 21. Return the stream response
    console.log('Returning stream response')
    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })
}
