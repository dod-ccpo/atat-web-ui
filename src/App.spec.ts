import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import App from "./App.vue";

Vue.use(Vuetify);

describe("Testing App Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;
  let store: any;
  const actions: any = {};
  const getters: any = {};

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
      getters,
    });
    wrapper = shallowMount(App, {
      store,
      localVue,
      vuetify,
      stubs: [
        "create-portfolio-form",
        "atat-text-field",
        "atat-text-area",
        "atat-button-card",
      ],
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
