import {$, component$, useStore, useTask$} from '@builder.io/qwik';
import {DocumentHead} from '@builder.io/qwik-city';

export default component$(() => {
  const state = useStore({
    ingredients: [] as Array<string>,
    input: '',
    fetchData: false,
    recipes: undefined,
  });
  const updateIngredients = $(() => state.ingredients = [...state.ingredients, state.input]);

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
        type="text"
        class="my-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value={state.input}
        onInput$={(ev) => {
          state.input = (ev.target as HTMLInputElement).value;
        }}
      />
      <div>
        {state.ingredients?.map((value, i) => (
          <div key={i}>{value}</div>
        ))}
      </div>
      <button
        type="button"
        className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick$={updateIngredients}
      >
        add
      </button>
      <button
        type="button"
        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick$={() => state.fetchData = true}
      >
        search recipes
      </button>
      <div>
        {state.recipes}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'whatcanieat',
};
