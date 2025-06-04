import { vitePlugin } from '@remcovaes/web-test-runner-vite-plugin';

export default {
  plugins: [vitePlugin()],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 5000
    },
  },
  testsFinishTimeout: 10000,
  coverage: true
};