import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: process.cwd(),
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(process.cwd(), 'index.html')
    }
  }
});
