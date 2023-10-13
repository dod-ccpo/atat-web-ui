
/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ReviewDocumentsFunding from "./ReviewDocumentsFunding.vue";
import { DefaultProps } from "vue/types/options";

Vue.use(Vuetify);

describe("Testing ReviewDocumentsFunding component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
 
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ReviewDocumentsFunding, {
      localVue,
      vuetify
    });
  });

  describe("INITIALIZATION", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("FUNCTIONS", () => {
    it("temp", () => {
      console.log("temp");
    });
  });
});


