import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

const now = new Date();
const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;
const defaultVersion = `v${pkg.version} (${dateStr})`;

export default defineConfig({
  base: '/newdesk/',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || defaultVersion)
  },
  build: {
    target: ['es2015', 'safari12']
  }
})

