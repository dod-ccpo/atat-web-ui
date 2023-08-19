import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SummaryStepFour from "@/steps/03-Background/SummaryStepFour.vue"
import Summary from "@/store/summary";

Vue.use(Vuetify);

describe("Testing SummaryStepFour Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SummaryStepFour, {
      vuetify,
      localVue
    });
  });

  describe("testing SummaryStepFour render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("GETTERS", () => {
    describe("introParagraph()=> ", () => {
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
