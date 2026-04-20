import { defineConfig } from 'vitest/config';
// [framework-lock] stripped: import from '@vitejs/plugin-react' (banned for next)

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['client/src/**/*.{ts,tsx}', 'server/src/**/*.{ts,js}'],
      exclude: ['client/src/main.tsx', 'client/src/**/*.d.ts', 'server/src/server.js'],
    },
  },
});