import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import 'typeface-source-sans-pro';
import colors from 'vuetify/lib/util/colors';
import '@mdi/font/css/materialdesignicons.css';
import light from './theme';

Vue.use(Vuetify);

export default new Vuetify({
    rtl: false,
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        dark: false,
        options: {
            customProperties: true,
        },
        themes: {light}
    }
})
