import dotenv from "dotenv";
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
  const stream = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Qué información de un auto usado es relevante para saber si es buena idea comprarlo y que resulte estar en buenas condiciones?" }],
    stream: true
  });

  let message = "";
  
  for await (const messageStreamEvent of stream) {
    if (messageStreamEvent.type === "content_block_delta") {
      message += (messageStreamEvent.delta as any).text
      console.log('message: ', message);
      console.log('-------------------------------');
    }
  }
}

main();