/**
 * Extends interfaces in Vue.js
 */

import Vue, { ComponentOptions } from "vue";
import { Store } from "./index";

interface ATATStore extends Store<any> {
  portfolios: PortfoliosStoreState;
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    store?: ATATStore;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $store: ATATStore;
  }
}
