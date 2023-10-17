import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import GatherPriceEstimates from "@/steps/10-FinancialDetails/IGCE/GatherPriceEstimates.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import AcquisitionPackage from "@/store/acquisitionPackage";
import IGCE from "@/store/IGCE";
Vue.use(Vuetify);

describe("Testing GatherPriceEstimates Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(GatherPriceEstimates, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("testing methods", () => {
    it("tests openSlideoutPanel with an event", async () => {
      const isSlideOutOpen = SlideoutPanel.slideoutPanelIsOpen
      const eObject = {
        currentTarget: 'test',
        preventDefault: jest.fn(),
        cancelBubble: false,
      }
      await wrapper.vm.openSlideoutPanel(eObject);
      wrapper.vm.$nextTick(() => expect(isSlideOutOpen).toBe(true))
    });
  })
  
  describe("saveOnLeave()=>", () => {
    it("successfully execute with NO errors", async()=>{
      jest.spyOn(console, 'log');
      jest.spyOn(AcquisitionPackage, "setValidateNow").mockImplementation()
      jest.spyOn(IGCE, "setCostEstimate").mockImplementation()
      jest.spyOn(IGCE, "setIgceEstimate").mockImplementation()
      
      const _saveOnLeave = wrapper.vm.saveOnLeave();
      expect(await wrapper.vm.saveOnLeave()).toBe(true);
    })
  
    it("successfully execute with errors", async()=>{
      const erroredValue = "errored Value";
      jest.spyOn(console, 'log');
      jest.spyOn(AcquisitionPackage, "setValidateNow").mockImplementation()
      jest.spyOn(IGCE, "setCostEstimate").mockRejectedValue(erroredValue)
      
      expect(await wrapper.vm.saveOnLeave()).toBe(true);
      expect(console.log).toHaveBeenCalledWith(erroredValue);
    })
  })  
})
