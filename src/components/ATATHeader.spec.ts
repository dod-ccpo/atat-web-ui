import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ATATHeader from "@/components/ATATHeader.vue";
import store from "../store/index";
import Vuex from "vuex";
Vue.use(Vuetify);

describe("Testing Header Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATHeader, {
      localVue,
      vuetify,
      store,
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
