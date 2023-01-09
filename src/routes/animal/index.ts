import type {RequestHandler} from '@builder.io/qwik-city';
import {Configuration, OpenAIApi} from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const onPost: RequestHandler<string> = async ({request}) => {
  if (!configuration.apiKey) {
    throw new Error('OpenAI API key not configured, please follow instructions in README.md');
  }
  const animal = await request.text();
  if (animal.trim().length === 0) {
    throw new Error('Please enter a valid animal');
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    return completion.data.choices[0].text;
  } catch (error: any) {
    console.error(`Error with OpenAI API request: ${error.message}`);
  }
};

function generatePrompt(animal: string) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.
Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
