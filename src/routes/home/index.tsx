import {$, component$, useStore, useStylesScoped$, useTask$} from '@builder.io/qwik';
import {DocumentHead} from '@builder.io/qwik-city';

export default component$(() => {
  const state = useStore({
    ingredients: [] as Array<string>,
    input: '',
    fetchData: false,
    recipes: undefined,
  });
  const updateIngredients = $(() => state.ingredients = [...state.ingredients, state.input]);

    useTask$(async ({ track }) => {
        track(() => state.fetchData);
        if (state.fetchData) {
            state.fetchData = false;
            const res = await fetch('http://localhost:5173/recipe', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: state.ingredients.join(', ')
            });
            const json = await res.json();
            state.recipes = json;
        }
    });

    return (
    <>
        <label for="ingredientInput">Ingredient: </label>
          <input
                id="ingredientInput"
                type="text"
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
          <button onClick$={updateIngredients}>add</button>
          <button onClick$={() => state.fetchData = true}>search recipes</button>
          <div>
              {state.recipes}
          </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'whatcanieat',
};
