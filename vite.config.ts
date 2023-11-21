import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from "rollup-plugin-visualizer";
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer(),
    dts({ include: [path.resolve(__dirname, "lib")]}),
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
  }
})
