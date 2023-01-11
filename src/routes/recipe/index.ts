import type {RequestHandler} from '@builder.io/qwik-city';
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/*
*   See example call in http/recipe.http
* */
export const onPost: RequestHandler<string> = async ({request}) => {
  if (!configuration.apiKey) {
    throw new Error('OpenAI API key not configured, please follow instructions in README.md');
  }
  const ingredientsText = await request.text();
  if (ingredientsText.trim().length === 0) {
    throw new Error('Please enter a valid ingredient');
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(ingredientsText),
      temperature: 0.6,
      max_tokens: 200,
    });
    const result = completion.data.choices[0].text;
    return result?.split(',')
        .filter(v => v?.length > 0)
        .map(it => it.trim().replace('.', ''));
  } catch (error: any) {
    console.error(`Error with OpenAI API request: ${error.message}`);
  }
};

function generatePrompt(ingredient: string) {
  const capitalizedIngredient =
    ingredient[0].toUpperCase() + ingredient.slice(1).toLowerCase();
  return `A comma seperated list of suggestion Recipes with the following ingredients: 
Ingredients: ${capitalizedIngredient}`;
}
