import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import wizard from "@/wizard/wizard.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";

Vue.use(Vuetify);

describe("Testing wizard Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueAxios, axios);
  localVue.use(VueRouter);
  let vuetify: any;
  let wrapper: any;
  let store: any;
  const actions: any = {
    updateWizardStep: jest.fn(),
  };

  const router = new VueRouter();

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
    });
    wrapper = mount(wizard, {
      store,
      localVue,
      vuetify,
      router,
      stubs: ["Stepper", "ButtonNavigation"],
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("click next button", async () => {
    await wrapper.find("#step_1_navbtn_add_funding").trigger("click");
  });
});
