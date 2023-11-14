import { describe, it, expect} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import CoILearnMore from "@/steps/07-OtherContractConsiderations/CoILearnMore.vue";

const wrapper: VueWrapper = shallowMount(CoILearnMore);

describe("Testing CoILearnMore Page", () => {

  describe("testing ArchitecturalDesign render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
