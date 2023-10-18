/* eslint-disable */
import {createApp} from 'vue'
import App from "@/App.vue";
import router from "@/router"
import store  from "@/store"
import vuetify from "./plugins/vuetify";
import validation from "./plugins/validation";
import sanitize  from "./plugins/sanitize";

const app = createApp(App)

app.use(store)
app.use(router);
app.use(validation);
app.use(sanitize);
app.use(vuetify)


app.config.globalProperties.productionTip = false;


app.mount('#app')