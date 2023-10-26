/* eslint-disable */
import { createApp } from 'vue'
import App from "@/App.vue";
import router from "@/router"
import store  from "@/store"
import vuetify from "./plugins/vuetify";
import validation from "./plugins/validation";
import sanitize  from "./plugins/sanitize";

const app = createApp(App)

app.use(store)

import { stepperRoutes } from "./router/stepper";

const dummy = stepperRoutes
console.log(dummy)
// app.use(validation);
// app.use(sanitize);
// app.use(vuetify);
// //TODO fix routing
// // app.use(router);

// app.config.globalProperties.productionTip = false;

// app.mount('#app')
