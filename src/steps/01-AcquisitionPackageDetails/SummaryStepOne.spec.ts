import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SummaryStepOne from "@/steps/01-AcquisitionPackageDetails/SummaryStepOne.vue";
import Summary, * as SummaryExportedFunctions from "@/store/summary";

Vue.use(Vuetify);

describe("Testing SummaryStepOne Component", () => {
  const localVue = createLocalVue();
  
  const vuetify: Vuetify = new Vuetify();
  const wrapper: Wrapper<DefaultProps & Vue, Element> = mount(SummaryStepOne, {
    vuetify,
    localVue,
  });

  describe("testing SummaryStepOne render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("GETTERS", () => {
    describe("introParagraph()=> ", () => {
      it("returns `We need some more details` statement", async () => {
        jest
          .spyOn(SummaryExportedFunctions, "isStepComplete")
          .mockReturnValueOnce(false);
        wrapper.vm.setIntroParagraph();
        expect(wrapper.vm.$data.introParagraph).toContain(
          "We need some more details"
        );
      });
      it("returns `You are all done` statement", async () => {
        jest
          .spyOn(SummaryExportedFunctions, "isStepComplete")
          .mockReturnValueOnce(true);
        wrapper.vm.setIntroParagraph();
        expect(wrapper.vm.$data.introParagraph).toContain("You are all done");
      });
    });
  });

  describe("FUNCTIONS", () => {
    it("saveOnLeave()=> expect function to be called", async () => {
      const toggleButtonColorMock = jest
        .spyOn(Summary, "toggleButtonColor")
        .mockImplementation(() => Promise.resolve());
      await wrapper.vm.saveOnLeave();
      expect(toggleButtonColorMock).toHaveBeenCalled();
    });
  });
});
