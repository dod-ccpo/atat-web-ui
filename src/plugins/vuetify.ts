import Vue from "vue";
import Vuetify from "vuetify/lib";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import light from "./theme";

Vue.use(Vuetify);

export default new Vuetify({
  rtl: false,
  icons: {
    iconfont: "md",
  },
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: { light },
  },
});
