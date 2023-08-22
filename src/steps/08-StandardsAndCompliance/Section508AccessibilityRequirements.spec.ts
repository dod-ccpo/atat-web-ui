/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import AcquisitionPackage from "@/store/acquisitionPackage";
import AccessibilityReq from "./Section508AccessibilityRequirements.vue";

Vue.use(Vuetify);

describe("Testing Section508AccessibilityRequirements Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const mockValidator = {
    required: jest.fn()
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(AccessibilityReq, {
      vuetify,
      localVue,
      mocks: {
        $validators: mockValidator
      }
    });
  });

  describe("testing Section508AccessibilityRequirements.vue", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe("testing getters", () => {
      it("returns the correct currentData", async () => {
        wrapper.setData({accessibilityReqs: "test requirements"});
        expect(wrapper.vm.currentData).toEqual({
          accessibility_reqs_508: "test requirements",
          acquisition_package: AcquisitionPackage.packageId // This should be mocked/stubbed
        });
      });

      it("returns the correct savedData", async () => {
        const mockData = {accessibility_reqs_508: "saved requirements"};
        AcquisitionPackage.setSensitiveInformation(mockData);
        expect(wrapper.vm.savedData).toEqual({
          accessibility_reqs_508: mockData.accessibility_reqs_508,
        });
      });
    });

    describe("testing business functions", () => {
      it("correctly determines if data has changed", async () => {
        wrapper.setData({ accessibilityReqs: "test requirements" });
        AcquisitionPackage.setSensitiveInformation({
          accessibility_reqs_508: "saved requirements"
        });
        expect(wrapper.vm.hasChanged()).toBe(true);
      });

      it("loads data on enter", async () => {
        AcquisitionPackage.loadSensitiveInformation = jest.fn().mockResolvedValue({
          accessibility_reqs_508: "loaded requirements"
        });

        await wrapper.vm.loadOnEnter();
        expect(wrapper.vm.accessibilityReqs).toBe("loaded requirements");
        expect(AcquisitionPackage.loadSensitiveInformation).toHaveBeenCalled();
      });

      it("loads an empty string if store value is undefined or null", async () => {
        AcquisitionPackage.loadSensitiveInformation = jest.fn().mockResolvedValue({
          accessibility_reqs_508: null
        });

        await wrapper.vm.loadOnEnter();
        expect(wrapper.vm.accessibilityReqs).toBe('');
        expect(AcquisitionPackage.loadSensitiveInformation).toHaveBeenCalled();
      });

      it("saves data on leave if data has changed", async () => {
        AcquisitionPackage.saveSensitiveInformation = jest.fn();
        wrapper.setData({ accessibilityReqs: "new requirements" });
        AcquisitionPackage.setSensitiveInformation({ accessibility_reqs_508: "old requirements" });

        await wrapper.vm.saveOnLeave();
        expect(AcquisitionPackage.saveSensitiveInformation).toHaveBeenCalled();
      });

      it("logs error if thrown while attempting to save on leave", async () => {
        console.log = jest.fn();
        jest.spyOn(AcquisitionPackage, 'saveSensitiveInformation').mockImplementation(
          () => { throw new Error("mock error") }
        );
        await wrapper.vm.saveOnLeave();
        expect(console.log).toHaveBeenCalledWith(Error("mock error"));
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
