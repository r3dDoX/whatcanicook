/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is render outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import { renderToStream, RenderToStreamOptions } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './root';
import {useEnvData} from "@builder.io/qwik";

export interface CustomEnvData {
  OPENAI_API_KEY: string;
}

export const getCustomEnvData = (): CustomEnvData => {
  if (!process.env['VAR_NAME']) {
    throw Error('no VAR_NAME defined');
  }
  return {
    OPENAI_API_KEY: `${process.env['OPENAI_API_KEY']}`,
  };
};
export const CUSTOM_ENV_DATA = 'customEnvData';
export const useCustomEnvData = (propName: keyof CustomEnvData) =>
    useEnvData<CustomEnvData>(CUSTOM_ENV_DATA)?.[propName];

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    envData: {
      ...opts.envData,
      [CUSTOM_ENV_DATA]: getCustomEnvData(),
    },
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      lang: 'en-us',
      ...opts.containerAttributes,
    },
  });
}
