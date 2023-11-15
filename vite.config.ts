import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from "rollup-plugin-visualizer";
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer(), dts({ include: [path.resolve(__dirname, "lib")]})],
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "lib")
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'ymtx',
      fileName: 'ymtx',
    },
    rollupOptions: {
      external: ['antd', 'react', 'react-dom']
    }
  }
})
