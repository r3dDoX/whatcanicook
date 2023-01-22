import {component$} from '@builder.io/qwik';
import type {DocumentHead} from '@builder.io/qwik-city';
import Search from '~/components/search/search';


export default component$(() => {

    return (
        <>
            <Search/>
        </>
    );
});

export const head: DocumentHead = {title: 'Welcome to Qwik'};
