import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', 
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // additionalData: `
        //   @import "${path.resolve(__dirname, 'src/styles/variables.less')}";
        //   @import "${path.resolve(__dirname, 'src/styles/mixins.less')}";
        // `,
      },
    },
  },
})
