/*eslint-disable camelcase*/
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PIIRecord from "./PIIRecord.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";

Vue.use(Vuetify);

const localVue = createLocalVue();
let vuetify: Vuetify;
let wrapper: Wrapper<DefaultProps & Vue, Element>;
localVue.use(validators);


describe("Testing PII Record Page", () => {
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PIIRecord, {
      vuetify,
      localVue,
      propsData: {}
    });
    jest.spyOn(AcquisitionPackage, "loadData").mockResolvedValue({
      pii_present: 'YES'
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("testing rendered component", () => {

    it("renders successfully", () => {
      expect(wrapper.exists()).toBe(true);
    });

  });

  describe("testing component data", () => {

    it("loads data on component mount", async () => {
      expect(AcquisitionPackage.loadData).toHaveBeenCalled();
    });

    it("sets savedData when storeData is returned", async () => {

      const mockData = {
        system_of_record_name: 'SystemName',
        work_to_be_performed: 'Operation',
      };
      
      jest.spyOn(AcquisitionPackage, 'loadData').mockResolvedValue(mockData);
      
      await wrapper.vm.loadOnEnter();
      
      expect(wrapper.vm.systemName).toEqual(mockData.system_of_record_name);
      expect(wrapper.vm.operationToBePerformed).toEqual(mockData.work_to_be_performed);
    });

    it("saveOnLeave() ", async () => {
      const saveOnLeave = await wrapper.vm.saveOnLeave()
      expect(saveOnLeave).toBeTruthy()
    })

    it("saveOnLeave() - should catch and log error", async () => {
      console.log = jest.fn();
      jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(() => {
        throw new Error("mock error");
      });
      await wrapper.vm.saveOnLeave();
      expect(console.log).toHaveBeenCalledWith(Error("mock error"));
    });

    it("returns true when current data differs from saved data", async () => {

      const mockData = {
        system_of_record_name: 'SystemName',
        work_to_be_performed: 'Operation',
      };
          
      jest.spyOn(AcquisitionPackage, 'loadData').mockResolvedValue(mockData);
      wrapper.setData({
        system_of_record_name: "newvalue",
        work_to_be_performed: "Also New Value",
      })
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.hasChanged()).toBe(true);
    });
  });
});