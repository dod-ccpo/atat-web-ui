import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ATATAddressForm from "@/components/ATATAddressForm.vue";

Vue.use(Vuetify);

describe("Testing ATATStepperNavigation", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const addressTypeOptions = [
    {
      id: "1",
      label: "radio option 1",
      value: "radioOption1",
    }
  ] 

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATAddressForm, {
      vuetify,
      localVue,
      propsData:({
        addressTypeOptions
      })
    });
  });

  describe("INITIALIZATION", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });


});
