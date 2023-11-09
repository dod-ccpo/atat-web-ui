import { describe, it, expect} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";
import ATATTextField from "@/components/ATATTextField.vue";

describe("Testing IncumbentContractorName Component", () => {
  const wrapper: VueWrapper = shallowMount(IncumbentContractorName);
  const vm =  (wrapper.vm as typeof wrapper.vm.$options);

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
