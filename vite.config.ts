import { defineConfig, loadEnv } from 'vite'
// import dotenv from 'dotenv'
// require('dotenv').config()
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'

import manifestFile from './src/manifest.js'
import firefoxManifestFile from './src/manifest_firefox_v3.js'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isFirefox = process.env.VITE_BROWSER;
  console.log("VITE_BROWSER:", isFirefox);
  console.log("defineConfig, mode:", { command, mode, isFirefox });

  var manifest: any;
  if (isFirefox === "firefox") {
    manifest = firefoxManifestFile;
  } else {
    manifest = manifestFile;
  }

  console.log({ manifest });

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
    // server: {
    //   port: 3000,
    //   strictPort: true,
    // },
    server: { port: 3000, strictPort: true, hmr: { port: 5173, }, }, //hmr ?
    plugins: [crx({ manifest }), react()],
  }
})
