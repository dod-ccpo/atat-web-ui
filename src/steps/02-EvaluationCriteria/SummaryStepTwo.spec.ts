import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SummaryStepTwo from "@/steps/02-EvaluationCriteria/SummaryStepTwo.vue"
import Summary,  * as SummaryExportedFunctions from "@/store/summary";

Vue.use(Vuetify);

describe("Testing SummaryStepTwo Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

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
