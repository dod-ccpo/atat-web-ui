import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import validators, { ValidationPlugin } from "../../../plugins/validation";
import { DefaultProps } from "vue/types/options";

import DescriptionOfNeed from "./DescriptionOfNeed.vue";
import { mocked } from 'ts-jest/utils';

Vue.use(Vuetify);

describe("Testing ComputeForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(DescriptionOfNeed, {
      localVue,
      vuetify,
      propsData: {
        index: 0,
        anticipatedNeedUsage: "test text",
      }
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });


  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Validation....", () => {
    it("tests that textarea required message is displayed", async () => {
      const mockValidator = jest.spyOn(localVue.prototype.$validators, 'required')
      await wrapper.setProps({ anticipatedNeedUsage: ""});
      expect(mockValidator).toHaveBeenCalled();
    });

    it("tests that textarea max length message is displayed", async () => {
      const mockValidator = jest.spyOn(localVue.prototype.$validators, 'maxLength');
      // eslint-disable-next-line max-len
      const moreThan500Chars = "Bacon turkey pork loin bresaola boudin cow. Sirloin bacon chicken jowl bresaola. Flank sirloin short ribs pork chop, alcatra frankfurter jerky shank ham meatball sausage meatloaf chicken. Frankfurter pork loin pig porchetta boudin chuck salami beef ribs brisket doner sirloin tongue. Pork belly swine meatball kielbasa alcatra beef ribs tail pig prosciutto. Pastrami meatloaf pancetta, rump pork loin strip steak fatback bacon. Jowl cupim swine, kevin short loin pork loin kielbasa meatball flank pork.";
      await wrapper.setProps({ anticipatedNeedUsage: moreThan500Chars}); 
      expect(mockValidator).toHaveBeenCalled();    
    });    
  });



});