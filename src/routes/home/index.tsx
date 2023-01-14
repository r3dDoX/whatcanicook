import {$, component$, useSignal, useStore, useTask$} from '@builder.io/qwik';
import {DocumentHead} from '@builder.io/qwik-city';

interface RecipeState {
  ingredients: string[],
  fetchData: boolean,
  recipes?: string[],
}

export default component$(() => {
  const state = useStore<RecipeState>({
    ingredients: [],
    fetchData: false,
  });
  const inputRef = useSignal<HTMLInputElement>();
  const addIngredient = $(() => {
    if (inputRef.value && inputRef.value.value.trim() !== '') {
      state.ingredients = [...state.ingredients, inputRef.value!.value];
      inputRef.value.value = '';
    }
  });
  const removeIngredient = $((ingredientToRemove: string) => {
    state.ingredients = state.ingredients.filter(ingredient => ingredient !== ingredientToRemove);
  })

  useTask$(async ({track}) => {
    track(() => state.fetchData);
    if (state.fetchData) {
      state.fetchData = false;
      const res = await fetch('/recipe', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: state.ingredients.join(', '),
      });
      state.recipes = await res.json();
    }
  });

  return (
    <>
      <label for="ingredientInput" className="block text-sm font-medium text-gray-700">Ingredient:&nbsp;</label>
      <input
        id="ingredientInput"
        ref={inputRef}
        type="text"
        class="my-2 relative z-10 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onKeyDown$={({key}) => {
          if (key === 'Enter') {
            addIngredient();
          }
        }}
      />
      <button
        type="button"
        class="rounded-r-md border border-l-0 border-gray-300 bg-white py-2.5 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick$={addIngredient}
      >
        add
      </button>
      <ul class="my-1">
        {state.ingredients?.map((value, i) => (
          <li key={i} class="flex items-center group">
            {value}
            <button
              class="ml-2 rounded-md border border-gray-300 bg-white text-xs px-2 hidden group-hover:inline-block hover:bg-gray-50"
              onClick$={() => removeIngredient(value)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick$={() => state.fetchData = true}
      >
        search recipes
      </button>
      <ul>
        {state.recipes?.map(recipe => (
          <li>{recipe}</li>
        ))}
      </ul>
    </>
  );
});

export const head: DocumentHead = {
  title: 'whatcanieat',
};
