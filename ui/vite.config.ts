import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      vue: '@vue/compat',
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    }),
  ],
  build: {
    // supports top-level await
    target: 'esnext'
  },

	server: {
		port: 8082,
    host: true,
		proxy: {
			"^/api": {
				target: "http://127.0.0.1:8191"
        // target: "http://server:8191"
			},
    }
	},
})
