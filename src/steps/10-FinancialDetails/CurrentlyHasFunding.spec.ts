import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper } from "@vue/test-utils";
import CurrentlyHasFunding from "./CurrentlyHasFunding.vue";
import { DefaultProps } from "vue/types/options";

Vue.use(Vuetify);

describe("Testing CurrentlyHasFunding component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
 
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentlyHasFunding, {
      localVue,
      vuetify,
      propsData:{
        fundingIncrements:  []
      }
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

});
