import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import prefixer from 'postcss-prefix-selector';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: [path.resolve(__dirname, "lib")]
    }),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      dist: path.resolve(__dirname, "dist"),
      lib: path.resolve(__dirname, 'lib')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'ag-grid',
      fileName: 'ag-grid',
    },
    rollupOptions: {
      external: ['antd', 'react', 'react-dom']
    }
  },
  css: {
    postcss: {
      plugins: [
        prefixer({
          prefix: '.ymtx-ag-grid',
          includeFiles: ['ymtx-ag-grid.scss']
        }),
      ]
    }
  }
})
