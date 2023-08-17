/*eslint-disable camelcase*/
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import FOIACoordinator from "./FOIACoordinator.vue";
import validators from "@/plugins/validation";
import { RadioButton, SelectData } from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";

//import ATATAddressForm from "@/components/ATATAddressForm.vue";



Vue.use(Vuetify);

describe("Testing FOIA Coordinator Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  const emptySelectData: SelectData = { text: "", value: "" };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FOIACoordinator, {
      vuetify,
      localVue,
    });
    wrapper.setData({
      selectedState: { value: "Virginia"},
      selectedAddressType: "Foreign",
    });
  });


  describe("Testing FOIA Coordinator Page", () => {
    const localVue = createLocalVue();
    let vuetify: Vuetify;
    let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
    localVue.use(validators);
  
    const emptySelectData: SelectData = { text: "", value: "" };
  
    beforeEach(() => {
      vuetify = new Vuetify();
      wrapper = mount(FOIACoordinator, {
        vuetify,
        localVue,
      });
      // Mocking the AcquisitionPackage.loadSensitiveInformation method
      jest.spyOn(AcquisitionPackage, "loadSensitiveInformation").mockResolvedValue({});
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("testing initial data", () => {
      it("checks initial data properties", () => {
        expect(wrapper.vm.$data.selectedState).toEqual(emptySelectData);
        expect(wrapper.vm.$data.selectedCountry).toEqual(emptySelectData);
        expect(wrapper.vm.$data.selectedMilitaryPO).toEqual(emptySelectData);
      });
    });
  
    describe("testing setSelectedData =>", () => {
      it("sets selectedCountry for foreign addresses", async () => {
        wrapper.setData({ selectedAddressType: "FOREIGN" });
        await wrapper.vm.setSelectedData();
        await wrapper.vm.nextTick();
        //console.log("here's selectedCountry", JSONwrapper.vm.$data.selectedCountry)
        expect(wrapper.vm.$data.selectedCountry).not.toBe(emptySelectData);
      });

      describe("setSelectedData method", () => {
      
        it("sets selectedCountry based on foreign address", async () => {
          await wrapper.setData({
            selectedAddressType: "FOREIGN",
            savedData: { foia_country: "Canada" },
            countryListData: [{ text: "Canada", value: "CA" }]
          });
          
      
          await wrapper.vm.setSelectedData();
          await wrapper.vm.$nextTick();
          console.log("here's inside the test",
            JSON.parse(JSON.stringify(wrapper.vm.$data.selectedCountry)));
          expect(wrapper.vm.selectedCountry).toEqual({ text: "Canada", value: "CA" });
        });
      
        it("sets selectedCountry to USA for US or Military addresses", async () => {
          await wrapper.setData({
            selectedAddressType: wrapper.vm.addressTypes.USA,
          });
      
          await wrapper.vm.setSelectedData();
      
          expect(wrapper.vm.selectedCountry).toEqual(
            { text: "United States of America", value: "US" });
        });
      
        it("sets selectedStateCode and selectedMilitaryPO for military addresses", async () => {
          await wrapper.setData({
            selectedAddressType: wrapper.vm.addressTypes.MIL,
            stateOrProvince: "TX",
            city: "APO",
            stateCodeListData: [{ text: "Texas", value: "TX" }],
            militaryPostOfficeOptions: [{ text: "Army Post Office", value: "APO" }],
          });
      
          await wrapper.vm.setSelectedData();
      
          expect(wrapper.vm.selectedStateCode).toEqual({ text: "Texas", value: "TX" });
          expect(wrapper.vm.selectedMilitaryPO).toEqual({ text: "Army Post Office", value: "APO" });
        });
      
        it("sets selectedState for US addresses", async () => {
          await wrapper.setData({
            selectedAddressType: wrapper.vm.addressTypes.USA,
            stateOrProvince: "CA",
            stateListData: [{ text: "California", value: "CA" }],
          });
      
          await wrapper.vm.setSelectedData();
      
          expect(wrapper.vm.selectedState).toEqual({ text: "California", value: "CA" });
        });
      
        it("sets selectedCountry to emptySelectData if foreign country not found", async () => {
          await wrapper.setData({
            selectedAddressType: wrapper.vm.addressTypes.FOR,
            savedData: { foia_country: "NonExistentCountry" },
            countryListData: [{ text: "SomeCountry", value: "SC" }]
          });
      
          await wrapper.vm.setSelectedData();
      
          expect(wrapper.vm.selectedCountry).toEqual(wrapper.vm.emptySelectData);
        });
      
      });
      

    });
  
    describe("testing currentData method", () => {
      it("should set the state based on selectedAddressType", async () => {
        await wrapper.setData({ selectedAddressType: "USA", selectedState: { value: "CA" } });
        expect(wrapper.vm.currentData.foia_state_province_state_code).toBe("CA");
        
        // You can add more scenarios
      });
    });
  
    describe("testing hasChanged method", () => {
      it("should detect changes", async () => {
        expect(wrapper.vm.hasChanged()).toBe(false);
        await wrapper.setData({ fullName: "New Name" });
        expect(wrapper.vm.hasChanged()).toBe(true);
      });
    });
  
    // Mock `AcquisitionPackage.saveData` for `saveOnLeave` method
    describe("testing saveOnLeave method", () => {
      it("should save changes on leave", async () => {
        const saveDataSpy = jest.spyOn(AcquisitionPackage, "saveData").mockResolvedValue(true);
  
        await wrapper.setData({ fullName: "New Name" });
        await wrapper.vm.saveOnLeave();
        expect(saveDataSpy).toHaveBeenCalled();
      });
    });
  
    describe("testing rendered component", () => {
      it("renders successfully", () => {
        expect(wrapper.exists()).toBe(true);
      });
    });
  });

  

  

  describe("testing FOIACoordinator.vue", () => {

    it("renders successfully", async () => {
      console.log("this is the test file", wrapper.vm.$data.selectedState.value);
      expect(wrapper.exists()).toBe(true);
    });
  });
});
