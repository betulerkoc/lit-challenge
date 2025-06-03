import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      js: true,
      ts: true,
      jsx: true,
      target: 'es2020',
    }),
  ],
}; 