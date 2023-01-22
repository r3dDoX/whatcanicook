import {component$, useStore, useStylesScoped$} from '@builder.io/qwik';
import styles from './header.css?inline';

interface HeaderState {
  navBarOpen?: boolean,
}

export default component$(() => {
  useStylesScoped$(styles);

  const state = useStore<HeaderState>({
    navBarOpen: false,
  });

  return (
    <header>
      <nav class="bg-white text-black py-4">
        <div class="container mx-auto flex items-start justify-between">
          <div class="flex justify-center flex-1">
            <a href="#" class="text-xl font-medium">WhatCanICook</a>
          </div>
          <div class="flex-0 relative">
            <div class="flex justify-end lg:hidden absolute right-0 px-5">
              <button id="menu-btn"
                      class={"flex items-center px-3 py-2 border rounded text-black border-black"}
                      onClick$={() => {
                        state.navBarOpen = !state.navBarOpen;
                      }}>
                <svg id="menu-icon"
                     class={`fill-current h-3 w-3 ${state.navBarOpen ? "menu-icon-open" : "menu-icon-close"}`}
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path id="menu-path"
                        d={`${state.navBarOpen ? "M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" : "M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"}`}/>
                </svg>
              </button>

            </div>
            <div id="menu-items"
                 class={`${(state.navBarOpen ? 'visible ' : 'invisible ') + "lg:block flex flex-col items-center absolute right-0 top-10"}`}>
              <a href="#" class="px-4 py-2 text-md">Home</a>
              <a href="#" class="px-4 py-2 text-md">About</a>
              <a href="#" class="px-4 py-2 text-md">Services</a>
              <a href="#" class="px-4 py-2 text-md">Contact</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
});
