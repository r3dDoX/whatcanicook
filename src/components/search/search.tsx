import {$, component$, useSignal, useStore, useTask$} from '@builder.io/qwik';

interface RecipeState {
    ingredients: string[],
    ingredientSuggestions: string[],
    ingredientInput: string,
    fetchData: boolean,
    recipes?: string[],
}

// This needs to be requested by an api which is currently not yet available
export const INGREDIENTS = ["Zwiebeln", "Knoblauch", "Kartoffeln", "Karotten", "Sellerie", "Paprika", "Tomaten", "Champignons", "Zucchini", "Auberginen", "Lauch", "Blattspinat", "Mangold", "Rucola", "Rote Beete", "Weißkohl", "Blumenkohl", "Brokkoli", "Spargel", "Erbsen", "Bohnen", "Mais", "Frühlingszwiebeln", "Frühlingslauch", "Limetten", "Zitronen", "Orange", "Apfel", "Birnen", "Pfirsiche", "Aprikosen", "Beeren", "Himbeeren", "Brombeeren", "Heidelbeeren", "Johannisbeeren", "Kirschen", "Pflaumen", "Trauben", "Avocados", "Eier", "Milch", "Sahne", "Joghurt", "Quark", "Käse", "Butter", "Öl", "Sonnenblumenöl", "Olivenöl", "Rapsöl", "Distelöl", "Sojasauce", "Balsamico-Essig", "Apfelessig", "Essig", "Senf", "Honig", "Ahornsirup", "Pfeffer", "Salz", "Pfefferkörner", "Lorbeerblätter", "Rosmarin", "Thymian", "Majoran", "Oregano", "Basilikum", "Dill", "Koriander", "Schnittlauch", "Petersilie", "Zitronengras", "Ingwer", "Galangal", "Kaffee", "Tee", "Kakao", "Schokolade", "Mehl", "Haferflocken", "Reis", "Nudeln", "Linsen", "Kichererbsen", "Bulgur", "Couscous", "Gewürze", "Paprikapulver", "Currypulver", "Kreuzkümmel", "Muskatnuss", "Nelken", "Zimt", "Anis", "Kümmel", "Fenchel", "Senfkörner", "Koriandersamen", "Tomatenmark", "Würstchen", "Schinken", "Speck", "Rindfleisch", "Lammfleisch", "Huhn", "Pute", "Fisch", "Garnelen", "Tintenfisch", "Muscheln", "Kartoffelpüree", "Hühnerbrühe", "Gemüsebrühe", "Fischbrühe", "Brot", "Pesto", "Aioli", "Ketchup", "Mayonnaise", "Schlagsahne", "Schokoladenstücke", "Vanille", "Rosinen", "Pekannüsse", "Mandeln", "Cashewnüsse", "Haselnüsse", "Walnüsse", "Pistazien", "Sesam", "Minze", "Lauchzwiebeln", "Kohlrabi", "Rote Rüben", "Süßkartoffeln", "Kürbis", "Papayas", "Ananas", "Feigen", "Mango", "Papaya", "Guava", "Passionsfrucht", "Melone", "Granatapfel", "Kiwi", "Kürbisse", "Aubergine"];

export default component$(() => {
    const state = useStore<RecipeState>({
        ingredients: [],
        ingredientSuggestions: [],
        ingredientInput: '',
        fetchData: false,
    });
    const inputRef = useSignal<HTMLInputElement>();

    const addIngredient = $(() => {
        if (inputRef.value && inputRef.value.value.trim() !== '') {
            state.ingredients = [...state.ingredients, inputRef.value!.value];
            inputRef.value.value = '';
            inputRef.value.focus();
        }
    });
    const removeIngredient = $((ingredientToRemove: string) => {
        state.ingredients = state.ingredients.filter(ingredient => ingredient.toLowerCase() !== ingredientToRemove.toLowerCase());
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
            <div class="relative">
                <div class="flex items-center">
                    <input
                        id="ingredientInput"
                        ref={inputRef}
                        autoComplete="off"
                        placeholder={"Type in Ingredient"}
                        value={state.ingredientInput}
                        onBlur$={() => {
                            return state.ingredientSuggestions = [];
                        }}
                        type="text"
                        class="w-full my-2 relative z-10 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onInput$={(e) => {
                            const val = (e.target as HTMLInputElement).value;
                            return state.ingredientSuggestions = val?.length > 1 ? INGREDIENTS.filter(it => it.toLowerCase().includes(val.toLowerCase())) : [];
                        }}
                        onKeyDown$={({key}) => {
                            if (key === 'Enter') {
                                return addIngredient();
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
                </div>

                <ul class={`${state.ingredientSuggestions.length > 0 ? '' : 'hidden '}absolute z-10 p-0 w-full border rounded-lg shadow divide-y max-h-72 overflow-y-auto bg-white mt-1`}>
                    {state.ingredientSuggestions.map((suggestion, i) => (
                        <li class="block px-4 p-2 hover:bg-indigo-50 cursor-pointer" key={i} onMouseDown$={() => {
                            state.ingredientInput = state.ingredientSuggestions[i];
                            state.ingredientSuggestions = [];
                            inputRef.value?.focus();
                            return;
                        }}
                        >{suggestion}</li>
                    ))}
                </ul>


                <div class="mx-1 py-3 flex flex-wrap">
                    {state.ingredients?.map((value, i) => (
                        <div key={i} class="flex items-center group py-1">
                        <span id="badge-dismiss-indigo"
                              class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded dark:bg-indigo-900 dark:text-indigo-300">
                          {value}
                            <button
                                onClick$={() => removeIngredient(value)} type="button"
                                class="inline-flex items-center p-0.5 ml-2 text-sm text-indigo-400 bg-transparent rounded-sm hover:bg-indigo-200 hover:text-indigo-900 dark:hover:bg-indigo-800 dark:hover:text-indigo-300"
                                data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                  <svg aria-hidden="true" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"
                                       xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clip-rule="evenodd"></path>
                                  </svg>
                                <span class="sr-only">Remove badge</span>
                            </button>
                        </span>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    class="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick$={() => state.fetchData = true}
                >
                    search recipes
                </button>
                <ul>
                    {state.recipes?.map(recipe => (
                        <li>{recipe}</li>
                    ))}
                </ul>
            </div>
        </>
    );
});
