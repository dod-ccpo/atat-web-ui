import { describe, it, expect} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import ContractNumber from "@/steps/03-Background/components/ContractNumber.vue";
import ATATTextField from "@/components/ATATTextField.vue";

describe("Testing ContractNumber Component", () => {

  const wrapper: VueWrapper = shallowMount(ContractNumber);

  describe("renders successfully in", () => {
    const id = "testContractNumber";
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
