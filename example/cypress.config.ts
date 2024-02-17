import { defineConfig } from 'cypress';
import { defineConfig as defineConfigVite } from 'vite';

export default defineConfig({
  component: {
    devServer: {
      framework: 'cypress-ct-stencil' as any,
      bundler: 'vite',
      viteConfig: defineConfigVite({
        optimizeDeps: {
          exclude: ['./'],
        },
      }),
    },
  },
});
