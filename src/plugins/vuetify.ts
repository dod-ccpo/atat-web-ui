import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
    rtl: false,
    theme: {
        dark: false,
        options: {
            customProperties: true
        },
        themes: {
            dark: {
                primary: "#21CFF3",
                accent: "#FF4081",
                secondary: "#ffe18d",
                success: "#4CAF50",
                info: "#2196F3",
                warning: "#FB8C00",
                error: "#FF5252"
            },
            light: {
                primary: "#005EA2",
                accent: "#FF4081",
                secondary: "#ffe18d",
                success: "#4CAF50",
                info: "#2196F3",
                warning: "#FB8C00",
                error: "#FF5252"
            }
        }
    }
})
