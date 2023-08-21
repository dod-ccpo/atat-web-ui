/*eslint-disable camelcase*/
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import FOIA from "./FOIA.vue";
import validators from "@/plugins/validation";
import { RadioButton, SelectData } from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import SlideoutPanel from "@/store/slideoutPanel/index";

Vue.use(Vuetify);

describe("Testing FOIA Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FOIA, {
      vuetify,
      localVue,
    });
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
      jest.spyOn(SlideoutPanel, "openSlideoutPanel").mockImplementation();
      const currentTargetId = 1;
      wrapper.vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
      expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
        currentTargetId
      );
    });

    it("testing @keydown.space to trigger openSlideoutPanel ", async () => {
      const anchorLink = wrapper.find("#FOIALearnMore");
      anchorLink.trigger('keydown.space'); // trigger openSlideoutPanel;
      const currentTargetId = 1;
      wrapper.vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
      expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
        currentTargetId
      );
    });
  
    it("testing @keydown.enter to trigger openSlideoutPanel ", async () => {
      const anchorLink = wrapper.find("#FOIALearnMore");
      anchorLink.trigger('keydown.enter'); // trigger openSlideoutPanel;
      const currentTargetId = 1;
      wrapper.vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
      expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
        currentTargetId
      );
    });
  });

  

  describe("Testing FOIA Page - loadOnEnter method", () => {
    let loadDataMock: jest.Mock;

    beforeEach(() => {
      loadDataMock = jest.fn();
      AcquisitionPackage.loadData = loadDataMock;
    });

    it("sets savedData when store has potential_to_be_harmful property", async () => {
      const mockResponse = { potential_to_be_harmful: "mockValue" };
      loadDataMock.mockResolvedValueOnce(mockResponse);

      await wrapper.vm.loadOnEnter();

      expect(wrapper.vm.savedData).toEqual({ potential_to_be_harmful: "mockValue" });
    });

    it("doesn't set savedData when store does not have potential_to_be_harmful", async () => {
      const mockResponse = { someOtherProperty: "mockValue" };
      loadDataMock.mockResolvedValueOnce(mockResponse);

      await wrapper.vm.loadOnEnter();

      // Assuming savedData's default value is { potential_to_be_harmful: "" }
      expect(wrapper.vm.savedData).toEqual({ potential_to_be_harmful: "" });
    });

    it("calls setSensitiveInformation when storeData is null", async () => {
      loadDataMock.mockResolvedValueOnce(null);
      const setSensitiveInformationMock = jest.fn();
      AcquisitionPackage.setSensitiveInformation = setSensitiveInformationMock;

      await wrapper.vm.loadOnEnter();

      expect(setSensitiveInformationMock).toHaveBeenCalledWith(wrapper.vm.currentData);
    });
  });


  describe("testing computed properties", () => {
    it("checks currentData computed property", () => {
      const expectedData = {
        potential_to_be_harmful: "",
        acquisition_package: "" 
      };
      expect(wrapper.vm.currentData).toEqual(expectedData);
    });
  });

  describe("testing methods", () => {
    it("checks openSlideoutPanel method", async () => {
      // Mock the SlideoutPanel's openSlideoutPanel method
      const openSlideoutPanelMock = jest.fn();
      SlideoutPanel.openSlideoutPanel = openSlideoutPanelMock;

      // Simulate the event
      await wrapper.vm.openSlideoutPanel({ currentTarget: { id: "testID" } });
      expect(openSlideoutPanelMock).toHaveBeenCalledWith("testID");
    });

    describe("testing saveOnLeave method", () => {
      it("should save changes on leave", async () => {
        const saveDataSpy = jest.spyOn(AcquisitionPackage, "saveData").mockResolvedValue(true);
    
        await wrapper.setData({ fullName: "New Name" });
        await wrapper.vm.saveOnLeave();
        expect(saveDataSpy).toHaveBeenCalled();
      });
  
      it("mocks an error", async () => {
        const errMessage = 'errMessage'
  
        jest.spyOn(AcquisitionPackage,"saveData")
          .mockRejectedValue(errMessage)
  
        await wrapper.vm.saveOnLeave();
        expect(wrapper.vm.$data.saveOnLeaveError).toBe(errMessage)
      });
  
    });

    it("checks hasChanged method", async () => {
      await wrapper.setData({
        currentData: { potential_to_be_harmful: "YES",
          acquisition_package: '' },
        savedData: { potential_to_be_harmful: "NO",
          acquisition_package: '' }
      });
      expect(wrapper.vm.hasChanged()).toBe(true);
  
      await wrapper.setData({
        currentData: { potential_to_be_harmful: "YES", 
          acquisition_package: ''},
        savedData: { potential_to_be_harmful: "YES",
          acquisition_package: '' }
      });
      expect(wrapper.vm.hasChanged()).toBe(false);
    });

  })
})

