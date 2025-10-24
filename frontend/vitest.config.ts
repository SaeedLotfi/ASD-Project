/// <reference types="vitest" />
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [],
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    ...configDefaults,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});