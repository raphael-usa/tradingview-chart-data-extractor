import react from '@vitejs/plugin-react';

import { defineConfig } from "vite";
import webExtension from "@samrum/vite-plugin-web-extension";
import pkg from './package.json' assert { type: 'json' }

// import manifest from './src/manifest'

// https://vitejs.dev/config/
/*
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },

    plugins: [crx({ manifest }), react()],
  }
})
*/


export default defineConfig(({ mode }) => {
  console.log({mode});
  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        input: {
          // htmls in manifest are handled in crx() plugin.
          home: 'home.html', // custom HTML page
        },
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },
    server: { port: 3000, strictPort: true, hmr: { port: 5173, }, }, //hmr ?
    plugins: [
      webExtension({
        manifest: {
          name: pkg.name,
          description: pkg.description,
          version: pkg.version,
          manifest_version: 2,
          background: {
            scripts: ['src/background/background.ts'],
            persistent: true,
          },
          icons: {
            16: 'img/logo-16.png',
            32: 'img/logo-34.png',
            48: 'img/logo-48.png',
            128: 'img/logo-128.png',
          },
          "browser_action": {
            "default_popup": "popup.html"
          },
          // "options_ui": {
          //   "page": "options.html",
          //   "open_in_tab": true
          // },
          content_scripts: [
            {
              matches: ["https://www.tradingview.com/chart/*"],
              js: ['src/contentScript/tradingview.tsx'],
              run_at: 'document_start'
            },
            {
              matches: ["<all_urls>"],
              js: ['src/contentScript/localhost.js'],
              run_at: 'document_start'
            },
          ],
          content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
          web_accessible_resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png', 'assets/*', 'src/*'],
          permissions: [
            "tabs",
            "*://tradingview.com/*",
            "*://*.tradingview.com/*",
            "webRequest",
            "webRequestBlocking",
            "http://localhost:3000/*",
            "storage",
            "activeTab",
            "webNavigation",
            "<all_urls>"
          ],
        },
      }),
      react()
    ],
  }
});