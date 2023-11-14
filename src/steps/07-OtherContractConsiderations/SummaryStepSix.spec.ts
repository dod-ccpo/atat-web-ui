import { describe, it, expect, vi} from 'vitest';
import { VueWrapper, mount } from '@vue/test-utils';
//import { DefaultProps } from "vue/types/options";
import SummaryStepSix from "@/steps/07-OtherContractConsiderations/SummaryStepSix.vue"
import { SummaryItem } from "types/Global";
import Summary,  * as SummaryExportedFunctions from "@/store/summary";
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import validators from "@/plugins/validation";

const vuetify = createVuetify({
  components,
  directives,
})

const wrapper: VueWrapper = mount(SummaryStepSix, {
  global: {
    plugins: [vuetify, validators]
  }
});
const vm =  (wrapper.vm as typeof wrapper.vm.$options)



describe("Testing SummaryStepSix Component", () => {

  const touchedSummaryItem: SummaryItem[] = [{ 
    "title": "TouchedSummaryItem", 
    "description": "", 
    "isComplete": false, 
    "isTouched": true,
    "hasDelete":false,
    "hasShowMore":false,
    "routeName": "touchedSummaryItem", 
    "step": 6, 
    "substep": 1 
  }]

  const completedSummaryStep: SummaryItem[] = [{ 
    "title": "CompletedSummaryItem", 
    "description": "", 
    "isComplete": true, 
    "isTouched": true,
    "hasDelete":false,
    "hasShowMore":false,
    "routeName": "CompletedSummaryItem", 
    "step": 6, 
    "substep": 1 
  }]
 
  beforeEach(() => {
    vi.spyOn(Summary, "validateStepSix").mockImplementation(()=> Promise.resolve());
  });

  describe("testing SummaryStepSix render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("GETTERS", () => {
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
