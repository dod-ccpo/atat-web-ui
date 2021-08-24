import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import store from "@/store";
import { createLocalVue, mount } from "@vue/test-utils";
import Step4 from "@/wizard/Step4/views/Step4.vue";

Vue.use(Vuetify);
Vue.use(Vuex);

describe("testing render component and gettign data from the store", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Step4, {
      localVue,
      store,
      vuetify,
    });
  });

  it("have the right name", () => {
    expect(wrapper.html()).toContain("Tracker Application");
  });
  it("have the a member", () => {
    expect(wrapper.html()).toContain("john.smith@mail.mil");
  });
  it("have the second member", () => {
    expect(wrapper.html()).toContain("jane.doe@mail.mil");
  });
});
