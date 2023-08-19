import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SummaryStepTwo from "@/steps/02-EvaluationCriteria/SummaryStepTwo.vue"
import { SummaryItem } from "types/Global";
import Summary from "@/store/summary";

Vue.use(Vuetify);

describe("Testing SummaryStepTwo Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const touchedSummaryItem: SummaryItem[] = [{ 
    "title": "TouchedSummaryItem", 
    "description": "", 
    "isComplete": true, 
    "isTouched": true, 
    "routeName": "touchedSummaryItem", 
    "step": 2, 
    "substep": 2 
  }]

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SummaryStepTwo, {
      vuetify,
      localVue
    });
  });

  describe("testing SummaryStepTwo render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("GETTERS", () => {
    describe("introParagraph()=> ", () => {
      // beforeEach(async()=>{
      //   await Summary.validateStepSix();
      // })
      it("returns `We need some more details` statement", async () => {
        await Summary.summaryItems.forEach((item)=>{
          item.isTouched = false;
          item.isComplete = false;
        })
        expect(wrapper.vm.introParagraph).toContain("We need some more details");
      });
      it("returns `you are all done` statement", async () => {
        await Summary.summaryItems.forEach((item)=>{
          item.isTouched = true;
          item.isComplete = true;
        })
        expect(wrapper.vm.introParagraph).toContain("You are all done");
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
