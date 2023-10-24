import {createVuetify} from "vuetify";
import { mount} from "@vue/test-utils";
import SummaryStepThree from "@/steps/04-ContractDetails/SummaryStepThree.vue"
import Summary,  * as SummaryExportedFunctions from "@/store/summary";
import { Component } from "vue";
import { VueCons } from "vue-facing-decorator";


describe("Testing SummaryStepThree Component", () => {
  let vuetify = createVuetify();
  const wrapper = mount(SummaryStepThree);
 
  beforeEach(() => {
    jest.spyOn(Summary, "validateStepThree").mockImplementation();
  });

  describe("testing SummaryStepThree render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("GETTERS", () => {
    describe("introParagraph()=> ", () => {
      it("returns `We need some more details` statement", async () => {
        jest.spyOn(SummaryExportedFunctions,"isStepComplete").mockReturnValueOnce(false);
        wrapper.vm.setIntroParagraph()
        expect(wrapper.vm.$.data.introParagraph).toContain("We need some more details");
      });
      it("returns `You are all done` statement", async () => {
        jest.spyOn(SummaryExportedFunctions,"isStepComplete").mockReturnValueOnce(true);
        wrapper.vm.setIntroParagraph()
        expect(wrapper.vm.$.data.introParagraph).toContain("You are all done");
      });
    })
  })

  describe("FUNCTIONS", () => {
    it("saveOnLeave()=> expect function to be called", async () => {
      const toggleButtonColorMock = jest.spyOn(Summary, "toggleButtonColor").mockImplementation(
        ()=> Promise.resolve()
      );
      await (wrapper.vm;
      expect(toggleButtonColorMock).toHaveBeenCalled();
    });
  })


})
