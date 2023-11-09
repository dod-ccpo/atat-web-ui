import { describe, it, expect} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import LevelOfCompetition from "@/steps/03-Background/components/LevelOfCompetition.vue";

describe("Testing LevelOfCompetition Component", () => {
  const wrapper: VueWrapper = shallowMount(LevelOfCompetition);
  const vm =  (wrapper.vm as typeof wrapper.vm.$options);


  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("ensure setReadOnly() =>", () => {
    beforeEach(() => {
      wrapper.setProps({
        isForm: false,
      });
    });
   
    it("returns YES", async () => {
      await wrapper.setProps({
        competitiveStatus: ""
      })
      await vm.setReadOnly();
      expect(vm.$data.selectedCompetitiveStatusReadOnly).toEqual("YES");
    });
  
    it("returns NO", async () => {
      await wrapper.setProps({
        competitiveStatus: "NO_NONE"
      })
      await vm.setReadOnly();
      expect(vm.$data.selectedCompetitiveStatusReadOnly).toEqual("NO");
    });
  })
});
