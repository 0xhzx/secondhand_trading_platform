import { createApp, ref } from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import App from './App.vue'
import router from './router/index.ts';
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const options = {
	hideProgressBar: true, // hide progress bar
	timeout: 2000        // 2 seconds show time
  };
  

const app = createApp(App)

const user = ref({} as any)
user.value = await (await fetch("/api/users/check-login")).json(); // top-level await need env support -> esnext

app.provide("user", user)
	.use(BootstrapVue as any)
	.use(BootstrapVueIcons as any)
	.use(router)
	.use(Toast, options)
	.mount('#app')
