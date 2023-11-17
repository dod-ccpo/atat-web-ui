/*eslint-disable camelcase*/
import { describe, it, expect, vi, Mock} from 'vitest';
import { VueWrapper, shallowMount, mount } from '@vue/test-utils';
import FOIA from "./FOIA.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import SlideoutPanel from "@/store/slideoutPanel/index";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'

describe("Testing FOIA Page full mount", () => {
  const vuetify = createVuetify({
    components,
    directives,
  })

  const wrapper: VueWrapper = mount(FOIA, {
    global: {
      plugins: [vuetify, validators]
    }
  });
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  beforeEach(() => {
    vi.spyOn(AcquisitionPackage, "loadData").mockImplementation(()=> Promise.resolve());
  });

  describe("testing rendered component", () => {
    it("renders successfully", () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("renders ATATAlert", () => {
      expect(wrapper.findComponent({ name: "ATATAlert" }).exists()).toBe(true);
    });

    it("renders ATATRadioGroup", () => {
      expect(wrapper.findComponent({ name: "ATATRadioGroup" }).exists()).toBe(true);
    });

    
    it("opens slideout panel", () => {
      vi.spyOn(SlideoutPanel, "openSlideoutPanel").mockImplementation(()=> Promise.resolve());
      const currentTargetId = 1;
      vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
      expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
        currentTargetId
      );
    });

    it("testing @keydown.space to trigger openSlideoutPanel ", async () => {
      const anchorLink = wrapper.find("#FOIALearnMore");
      anchorLink.trigger('keydown.space'); // trigger openSlideoutPanel;
      const currentTargetId = 1;
      vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
      expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
        currentTargetId
      );
    });
  
    it("testing @keydown.enter to trigger openSlideoutPanel ", async () => {
      const anchorLink = wrapper.find("#FOIALearnMore");
      anchorLink.trigger('keydown.enter'); // trigger openSlideoutPanel;
      const currentTargetId = 1;
      vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
      expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
        currentTargetId
      );
    });
  });
});


describe("Testing FOIA Page", () => {
  const wrapper: VueWrapper = shallowMount(FOIA, {
    global: {
      plugins: [ validators]
    }
  });
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  beforeEach(() => {
    vi.spyOn(AcquisitionPackage, "loadData").mockImplementation(()=> Promise.resolve());
  });

  describe("Testing FOIA Page - loadOnEnter method", () => {
    let loadDataMock: Mock<any, any>

    beforeEach(() => {
      loadDataMock = vi.fn();
      AcquisitionPackage.loadData = loadDataMock;
      vm.savedData = {
        potential_to_be_harmful: ""
      };
    });


    it("sets savedData when store has potential_to_be_harmful property", async () => {
      const mockResponse = { potential_to_be_harmful: "mockValue" };
      loadDataMock.mockResolvedValueOnce(mockResponse);

      await vm.loadOnEnter();

      expect(vm.savedData).toEqual({ potential_to_be_harmful: "mockValue" });
    });

    it("doesn't set savedData when store does not have potential_to_be_harmful", async () => {
      const mockResponse = { someOtherProperty: "mockValue" };
      loadDataMock.mockResolvedValueOnce(mockResponse);

      await vm.loadOnEnter();

      // Assuming savedData's default value is { potential_to_be_harmful: "" }
      expect(vm.savedData).toEqual({ potential_to_be_harmful: "" });
    });

    it("calls setSensitiveInformation when storeData is null", async () => {
      loadDataMock.mockResolvedValueOnce(null);
      const setSensitiveInformationMock = vi.fn();
      AcquisitionPackage.setSensitiveInformation = setSensitiveInformationMock;

      await vm.loadOnEnter();

      expect(setSensitiveInformationMock).toHaveBeenCalledWith(vm.currentData);
    });
  });


  describe("testing computed properties", () => {
    it("checks currentData computed property", () => {
      const expectedData = {
        potential_to_be_harmful: "",
        acquisition_package: "" 
      };
      expect(vm.currentData).toEqual(expectedData);
    });
  });

  describe("testing methods", () => {
    it("checks openSlideoutPanel method", async () => {
      // Mock the SlideoutPanel's openSlideoutPanel method
      const openSlideoutPanelMock = vi.fn();
      SlideoutPanel.openSlideoutPanel = openSlideoutPanelMock;

      // Simulate the event
      await vm.openSlideoutPanel({ currentTarget: { id: "testID" } });
      expect(openSlideoutPanelMock).toHaveBeenCalledWith("testID");
    });

    describe("testing saveOnLeave method", () => {
      it("should save changes on leave", async () => {
        const saveDataSpy = vi.spyOn(AcquisitionPackage, "saveData");
    
        await wrapper.setData({ fullName: "New Name" });
        await vm.saveOnLeave();
        expect(saveDataSpy).toHaveBeenCalled();
      });
  
      it("mocks an error", async () => {
        const errMessage = 'errMessage'
  
        vi.spyOn(AcquisitionPackage,"saveData")
          .mockRejectedValue(errMessage)
  
        await vm.saveOnLeave();
        expect(vm.$data.saveOnLeaveError).toBe(errMessage)
      });
  
    });

    //TODO Identify why potential_to_be_harmful is being reset to ""
    it.skip("checks hasChanged method", async () => {
      await wrapper.setData({
        currentData: { potential_to_be_harmful: "YES",
          acquisition_package: '' },
        savedData: { potential_to_be_harmful: "NO",
          acquisition_package: '' }
      });
      expect(vm.hasChanged()).toBe(true);

      await wrapper.setData({
        currentData: { potential_to_be_harmful: "YES", 
          acquisition_package: ''},
        savedData: { potential_to_be_harmful: "YES",
          acquisition_package: '' }
      });
      await vm.$nextTick();
      console.log(vm.currentData);
      console.log(vm.savedData)
      expect(vm.hasChanged()).toBe(false);
    });

  })
})

