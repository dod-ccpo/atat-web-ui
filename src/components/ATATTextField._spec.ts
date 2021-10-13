import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import ATATTextField from "@/components/ATATTextField.vue";
Vue.use(Vuetify);

describe("Testing ATATTextField Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATTextField, {
      router,
      localVue,
      vuetify,
    });
  });
  
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
