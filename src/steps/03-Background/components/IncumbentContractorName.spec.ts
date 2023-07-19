import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";
import ATATTextField from "@/components/ATATTextField.vue";

describe("Testing IncumbentContractorName Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(IncumbentContractorName, {
      localVue,
      vuetify,
    });
  });

  describe("renders successfully in", () => {
    const id = "testIncumbentContractorName";
    beforeEach(() => {
      wrapper.setProps({
        id
      })
    });

    it("review mode", async () => {
      await wrapper.setData({isForm: false})
      expect(wrapper.html()).toContain(id);
    });

    it("form mode", async () => {
      await wrapper.setData({isForm: true})
      const textField = wrapper.findComponent(ATATTextField);
      expect(wrapper.findComponent(ATATTextField).exists());
      expect(textField.attributes("id")).toContain(id);
    });
  })
});
