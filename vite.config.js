import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const defaultVersion = `v${pkg.version}-${dateStr}`;

export default defineConfig({
  base: '/newdesk/',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || defaultVersion)
  },
  build: {
    target: ['es2015', 'safari12']
  }
})

