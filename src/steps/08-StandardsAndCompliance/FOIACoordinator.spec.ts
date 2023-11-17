/*eslint-disable camelcase*/
import { describe, it, expect, vi} from 'vitest';
import { VueWrapper, shallowMount, mount } from '@vue/test-utils';
import FOIACoordinator from "./FOIACoordinator.vue";
import validators from "@/plugins/validation";
import { SelectData } from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";

const wrapper: VueWrapper = shallowMount(FOIACoordinator, {
  global: {
    plugins: [ validators]
  }
});
const vm =  (wrapper.vm as typeof wrapper.vm.$options)


const sensitiveInformationMock = {
  acquisition_package: "1",
  // pii_present?: "YES",
  // system_of_record_name?: "system_of_record_name",
  // work_to_be_performed?: "work_to_be_performed",

  // baa_required?: string;

  // potential_to_be_harmful?: string;

  // foia_full_name?: string;
  // foia_email?: string;
  foia_address_type: "MIL",
  foia_city_apo_fpo: "APO",
  foia_street_address_1: "222 Maple Lane",
  foia_state_province_state_code: "NC",
  foia_zip_postal_code: "28888",
  foia_country: "US",
  // section_508_sufficient?: string;
  // accessibility_reqs_508?: string;
}

const emptySelectData: SelectData = { text: "", value: "" };
describe("Testing FOIA Coordinator Page", () => {
  beforeEach(() => {
 
    vi.spyOn(AcquisitionPackage, "loadSensitiveInformation")
      .mockReturnValue(
        new Promise(resolve=>resolve(sensitiveInformationMock)));
    vi.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      () => Promise.resolve());
  });

  describe("testing rendered component", () => {
    it("renders successfully", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("testing initial data", () => {
    it("checks initial data properties", () => {
      expect(vm.$data.selectedMilitaryPO).toEqual(emptySelectData);
    });
  });

  describe("testing setSelectedData =>", () => {
    it("sets selectedCountry for foreign addresses", async () => {
      wrapper.setData({ selectedAddressType: "FOREIGN" });
      await vm.setSelectedData();
      await vm.$nextTick();
      expect(vm.$data.selectedCountry).not.toBe(emptySelectData);
    });

    describe("setSelectedData method", () => {
    
      it("sets selectedCountry based on foreign address", async () => {
        await wrapper.setData({
          selectedAddressType: "FOREIGN",
          savedData: { foia_country: "Canada" },
          countryListData: [{ text: "Canada", value: "CA" }]
        });
        
    
        await vm.setSelectedData();
        await vm.$nextTick();
        expect(vm.selectedCountry).toEqual({ text: "Canada", value: "CA" });
      });
    
      it("sets selectedCountry to USA for US or Military addresses", async () => {
        await wrapper.setData({
          selectedAddressType: vm.addressTypes.USA,
        });
    
        await vm.setSelectedData();
    
        expect(vm.selectedCountry).toEqual(
          { text: "United States of America", value: "US" });
      });
    
      it("sets selectedStateCode and selectedMilitaryPO for military addresses", async () => {
        await wrapper.setData({
          selectedAddressType: vm.addressTypes.MIL,
          stateOrProvince: "TX",
          city: "APO",
          stateCodeListData: [{ text: "Texas", value: "TX" }],
          militaryPostOfficeOptions: [{ text: "Army Post Office", value: "APO" }],
        });
    
        await vm.setSelectedData();
    
        expect(vm.selectedStateCode).toEqual({ text: "Texas", value: "TX" });
        expect(vm.selectedMilitaryPO).toEqual({ text: "Army Post Office", value: "APO" });
      });
    
      it("sets selectedState for US addresses", async () => {
        await wrapper.setData({
          selectedAddressType: vm.addressTypes.USA,
          stateOrProvince: "CA",
          stateListData: [{ text: "California", value: "CA" }],
        });
    
        await vm.setSelectedData();
    
        expect(vm.selectedState).toEqual({ text: "California", value: "CA" });
      });

      it("sets selectedCountry to emptySelectData if foreign country not found", async () => {
        await wrapper.setData({
          selectedAddressType: vm.addressTypes.FOR,
          savedData: { foia_country: "NonExistentCountry" },
          countryListData: [{ text: "SomeCountry", value: "SC" }]
        });
    
        await vm.setSelectedData();
    
        expect(vm.selectedCountry).toEqual(vm.emptySelectData);
      });
    
    });
    
  });

  describe("testing currentData method", () => {
    it("should set the state based on selectedAddressType for US Address", async () => {
      // Set data
      await wrapper.setData({ 
        selectedAddressType: "US", 
        selectedState: { value: "CA" } 
      });
      await vm.$nextTick();
      expect(vm.currentData.foia_state_province_state_code).toBe("CA");
    });

    it("should set the state based on selectedAddressType for foreign address ", async () => {
      // Set data
      await wrapper.setData({ 
        selectedAddressType: "FOREIGN", 
        stateOrProvince: "Some Foreign State"
      });
      await vm.$nextTick();
      expect(vm.currentData.foia_state_province_state_code).toBe("Some Foreign State");
    });

    it("should set the state based on selectedAddressType for Military address ", async () => {
      // Set data
      await wrapper.setData({ 
        selectedAddressType: "MILITARY", 
      });
      const result = vm.currentData;
      expect(result.foia_address_type).toBe("MILITARY");
    });

  });

  describe("testing saveOnLeave method", () => {
    it("should save changes on leave", async () => {
      const saveDataSpy = vi.spyOn(AcquisitionPackage, "saveData")
        .mockImplementation(()=> Promise.resolve())

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


});

  
