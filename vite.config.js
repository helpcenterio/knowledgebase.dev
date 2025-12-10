import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: process.cwd(),
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        article: resolve(__dirname, 'pages/article.html'),
        category: resolve(__dirname, 'pages/category.html'),
        contacts: resolve(__dirname, 'pages/contacts.html'),
        search: resolve(__dirname, 'pages/search.html')
      }
    }
  }
});
