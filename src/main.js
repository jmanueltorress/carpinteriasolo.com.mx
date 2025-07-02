import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'animate.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// 👉 Vuetify
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css' //icons

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify); // Usa Vuetify

app.mount('#app');
