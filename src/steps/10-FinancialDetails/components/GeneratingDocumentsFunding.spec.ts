/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper } from "@vue/test-utils";
import GeneratingDocumentsFunding from "./GeneratingDocumentsFunding.vue";
import { DefaultProps } from "vue/types/options";

Vue.use(Vuetify);

describe("Testing GeneratingDocumentsFunding component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(GeneratingDocumentsFunding, {
      localVue,
      vuetify,
    });
  });

  describe("INITIALIZATION", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
});


