import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SummaryStepSix from "@/steps/07-OtherContractConsiderations/SummaryStepSix.vue"
import { SummaryItem } from "types/Global";
import Summary,  * as SummaryExportedFunctions from "@/store/summary";

import AcquisitionPackage from "@/store/acquisitionPackage";

Vue.use(Vuetify);

describe("Testing SummaryStepSix Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
 

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
    vuetify = new Vuetify();
    wrapper = mount(SummaryStepSix, {
      vuetify,
      localVue
    });
    jest.spyOn(Summary, "validateStepSix").mockImplementation();
  });

  describe("testing SummaryStepSix render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("GETTERS", () => {
    describe("introParagraph()=> ", () => {
      it("returns `We need some more details` statement", async () => {
        jest.spyOn(SummaryExportedFunctions,"isStepComplete").mockReturnValueOnce(false);
        wrapper.vm.setIntroParagraph()
        expect(wrapper.vm.$data.introParagraph).toContain("We need some more details");
      });
      it("returns `You are all done` statement", async () => {
        jest.spyOn(SummaryExportedFunctions,"isStepComplete").mockReturnValueOnce(true);
        wrapper.vm.setIntroParagraph()
        expect(wrapper.vm.$data.introParagraph).toContain("You are all done");
      });
    })
  })

  describe("FUNCTIONS", () => {
    it("saveOnLeave()=> expect function to be called", async () => {
      const toggleButtonColorMock = jest.spyOn(Summary, "toggleButtonColor").mockImplementation(
        ()=> Promise.resolve()
      );
      await wrapper.vm.saveOnLeave();
      expect(toggleButtonColorMock).toHaveBeenCalled();
    });
  })


})
