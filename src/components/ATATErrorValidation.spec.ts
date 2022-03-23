import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
Vue.use(Vuetify);

describe("Testing ATATStepperNavigation", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATErrorValidation, {
      vuetify,
      localVue
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("With Errors", () => {
    it("errors.length > 0", async () => {
      await wrapper.setProps({ errorMessages: ['error1', 'error2'] });
      expect(wrapper.vm.$props.errorMessages.length).toBe(2);
    });
  });
});
