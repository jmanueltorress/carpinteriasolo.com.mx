import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 👉 Vuetify
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css' //icons

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify); // Usa Vuetify

app.mount('#app');
