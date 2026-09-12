import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/newdesk/',
  build: {
    rollupOptions: {
      input: {
        main:                    resolve(__dirname, 'index.html'),
        cutting_list:            resolve(__dirname, 'cutting_list.html'),
        cutting_list_standard:   resolve(__dirname, 'cutting_list_standard.html'),
        cutting_list_workshop:   resolve(__dirname, 'cutting_list_workshop.html'),
        cutting_list_egger:      resolve(__dirname, 'cutting_list_egger.html'),
      }
    }
  }
})
