import { Car } from '../interfaces';
import anthropic from '../utils/anthropicClient';

export async function getCarAnalysis(car: Car) {
  const stream = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 512,
    messages: [{
      role: "user",
      content: `How reliable is this car on the market? Is it easy to repair? What future problems might it have? Give me a brief summary of NHTSA and customer reviews. ${JSON.stringify(car)}`,
    }],
    stream: true
  });

  return stream;
}