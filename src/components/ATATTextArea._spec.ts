import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import ATATTextArea from "@/components/ATATTextArea.vue";
Vue.use(Vuetify);

describe("Testing ATATTextArea Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
      vuetify = new Vuetify();
      wrapper = mount(ATATTextArea, {
        localVue,
        vuetify,
      });
    });

  it("renders successfully", async () => {
    await expect(wrapper.exists()).toBe(true);
  });
});
