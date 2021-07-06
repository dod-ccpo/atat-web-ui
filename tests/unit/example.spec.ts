import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);
Vue.config.productionTip = false;

import HelloWorld from "@/components/HelloWorld.vue";

import { mount } from "@vue/test-utils";

describe("HelloWorld.vue", () => {
  const vuetify = new Vuetify();
  it("renders props.msg when passed", () => {
    const msg = "Hello World";

    const wrapper = mount(HelloWorld, {
      vuetify,
      stubs: ["atat-select", "atat-text-field"],
      propsData: { msg },
    });

    expect(wrapper.text()).toMatch(msg);
  });
});
