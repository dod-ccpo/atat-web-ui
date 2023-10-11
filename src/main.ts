/* eslint-disable */
import {createApp} from 'vue'
import App from "@/App.vue";
import {createStore} from 'vuex'
//import VueRouter from 'vue-router'
import router from "@/router"
import store  from "@/store"
//import vuetify from "./plugins/vuetify";
import validation from "./plugins/validation";
import sanitize  from "./plugins/sanitize";
// import { format, compareAsc } from 'date-fns';
// import InputMask from "inputmask";

import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives
})
const store2 = createStore({})
app.use(store2)
app.use(router);
app.use(validation);
app.use(sanitize);
app.use(vuetify)

//TODO What does this do?
//app.config.productionTip = false;

// new Vue({
//   store,
//   router,
//   vuetify,
//   render: h => h(App),
// }).$mount('#app')
app.mount('#app')