import { esbuildPlugin } from '@web/dev-server-esbuild';
import { vitePlugin } from '@remcovaes/web-test-runner-vite-plugin';

export default {
  files: 'src/**/*.test.ts',
  plugins: [
    vitePlugin(),
    esbuildPlugin({ ts: true })
  ],
  coverage: true,
  coverageConfig: {
    exclude: [
      '**/node_modules/**',
    ],
    include: ['src/**/*.ts']
  },
  nodeResolve: true,
  testRunnerHtml: testFramework => `
    <html>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `
}; 