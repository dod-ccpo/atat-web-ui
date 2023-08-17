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
    beforeEach(()=>{
      jest.spyOn(Summary, "doSetSummaryItem").mockImplementation(
        (touchedSummaryItem)=> Promise.resolve()
      );
    })
    it("introParagraph()=> return `you are all done` statement", async () => {
      expect(wrapper.vm.introParagraph).toContain("You are all done");
    });
  })


})
