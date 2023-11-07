import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import SummaryStepFour from "@/steps/03-Background/SummaryStepFour.vue";
import Summary,  * as SummaryExportedFunctions from "@/store/summary";

vi.mock('@/store/summary')

describe("Testing SummaryStepTwo Component", () => {

  const wrapper: VueWrapper = shallowMount(SummaryStepFour, {
    props: {},
    global: {
      plugins: []
    }
  })

  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  describe("testing SummaryStepFour render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("GETTERS!", () => {
    describe("introParagraph()=> ", () => {
      it("returns `We need some more details` statement", async () => {
        vi.spyOn(SummaryExportedFunctions,"isStepComplete").mockReturnValueOnce(false);
        vm.setIntroParagraph()
        expect(vm.$data.introParagraph).toContain("We need some more details");
      });
      it("returns `You are all done` statement", async () => {
        vi.spyOn(SummaryExportedFunctions,"isStepComplete").mockReturnValueOnce(true);
        vm.setIntroParagraph()
        expect(vm.$data.introParagraph).toContain("You are all done");
      });
    })
  })

  describe("FUNCTIONS", () => {
    it("saveOnLeave()=> expect function to be called", async () => {
      const toggleButtonColorMock = vi.spyOn(Summary, "toggleButtonColor").mockImplementation(
        ()=> Promise.resolve()
      );
      await vm.saveOnLeave();
      expect(toggleButtonColorMock).toHaveBeenCalled();
    });
  })

})
