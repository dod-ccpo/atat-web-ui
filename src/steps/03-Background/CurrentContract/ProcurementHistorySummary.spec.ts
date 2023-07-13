/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import ProcurementHistorySummary 
  from "@/steps/03-Background/CurrentContract/ProcurementHistorySummary.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { CurrentContractDTO } from "@/api/models";

const  dataSource:CurrentContractDTO[] =[{
  instance_number: 1,
  current_contract_exists: "YES",
  incumbent_contractor_name: "incumbent_contractor_name",
  contract_number: "123",
  task_delivery_order_number: "123",
  contract_order_expiration_date: "10/12/2039",
  contract_order_start_date: "10/12/2023",
  competitive_status: "cs",
  business_size: "bs",
  acquisition_package: "123",
  is_valid: true,
  sys_created_by: "me",
  is_current: true,
}, {
  instance_number: 2,
  current_contract_exists: "YES",
  incumbent_contractor_name: "incumbent_contractor_name_002",
  contract_number: "123_002",
  task_delivery_order_number: "123_002",
  contract_order_expiration_date: "10/12/2022",
  contract_order_start_date: "10/12/2021",
  competitive_status: "cs_002",
  business_size: "bs_002",
  acquisition_package: "123_002",
  is_valid: true,
  sys_created_by: "me_002",
  is_current: false,
}]

const unsortedDataSource:CurrentContractDTO[] = [{
  instance_number: 2,
}, {
  instance_number: 1,
}]

const mockRoute = {
  params: {
    id: 1
  }
}
const mockRouter = {
  push: jest.fn()
}

describe("Testing ProcurementHistorySummary Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProcurementHistorySummary, {
      localVue,
      vuetify,
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    });
  });

  it("tests that component renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("Testing GETTERS", () => {
    beforeEach(() => {
      wrapper.setData(
        { dataSource }
      )
    });

    it("hasContractData() => returns boolean", async () => {
      expect(wrapper.vm.hasContractData).toBe(true);
    });

  });

  describe("Testing FUNCTIONS", () => {
    beforeEach(() => {
      wrapper.setData(dataSource)
    });
    it("formatContractDate() => returns date in MM/DD/YYYY format", async()=>{
      const formattedDate = wrapper.vm.formatContractDate("2022-12-31");
      expect(formattedDate).toBe("12/31/2022")
    })
    it("formatContractDate() => returns ''", async()=>{
      const formattedDate = wrapper.vm.formatContractDate("");
      expect(formattedDate).toBe("")
    })
    
    it("setHeaderId() => returns expected string with no spaces", async()=>{
      const columnHeader = "column header"
      expect(wrapper.vm.setHeaderId(columnHeader)).not.toContain(" ");
    })
    
    it("editInstance() => ensure store methods & navigation method are called", async()=>{
      jest.spyOn(AcquisitionPackage, "setCurrentContractInstanceNumber")
        .mockImplementation(
          ()=>Promise.resolve());
      jest.spyOn(AcquisitionPackage, "doSetCurrentContracts")
        .mockImplementation(()=>Promise.resolve());
      jest.spyOn(wrapper.vm, "navigate")
        .mockImplementation(()=>{/**nothing returned*/});
      await wrapper.vm.editInstance(dataSource[0]);
      expect(AcquisitionPackage.setCurrentContractInstanceNumber).toHaveBeenCalled();
      expect(AcquisitionPackage.doSetCurrentContracts).toHaveBeenCalled();
      expect(wrapper.vm.navigate).toHaveBeenCalled();
    })

    it("addInstance() => ensure methods are called", async()=>{
      jest.spyOn(wrapper.vm, "initializeDataSource")
        .mockImplementation(()=>{/**nothing returned*/});
      jest.spyOn(wrapper.vm, "navigate")
        .mockImplementation(()=>{/**nothing returned*/});
      await wrapper.vm.addInstance();
      expect(wrapper.vm.initializeDataSource).toHaveBeenCalled();
      expect(wrapper.vm.navigate).toHaveBeenCalled();
    })

    it("initializeDataSource() => returns initialized datasource", async()=>{
      wrapper.setData({dataSource: undefined})
      jest.spyOn(AcquisitionPackage, "setCurrentContractInstanceNumber")
        .mockImplementation();
      await wrapper.vm.initializeDataSource();
      expect(wrapper.vm.$data.dataSource).toHaveLength(1)
    })

    it("resetDataSource() => ensures dataSource is sorted and expected methods are called", 
      async()=>{
        jest.spyOn(AcquisitionPackage, "setCurrentContractInstanceNumber")
          .mockImplementation(
            ()=>Promise.resolve());
        jest.spyOn(AcquisitionPackage, "doSetCurrentContracts")
          .mockImplementation(()=>Promise.resolve());
        wrapper.setData({dataSource: unsortedDataSource});
        await wrapper.vm.resetDataSource();
        expect(wrapper.vm.dataSource[0].instance_number).toBe(0);
        expect(wrapper.vm.dataSource[1].instance_number).toBe(1);
        expect(AcquisitionPackage.setCurrentContractInstanceNumber).toHaveBeenCalled();
        expect(AcquisitionPackage.doSetCurrentContracts).toHaveBeenCalled();
      })

    it("resetDataSource() => returns initialized datasource", async()=>{
      jest.spyOn(AcquisitionPackage, "setCurrentContractInstanceNumber")
        .mockImplementation(
          ()=>Promise.resolve());
      jest.spyOn(AcquisitionPackage, "doSetCurrentContracts")
        .mockImplementation(()=>Promise.resolve());
      wrapper.setData({dataSource: unsortedDataSource});
      await wrapper.vm.resetDataSource();
      expect(wrapper.vm.dataSource[0].instance_number).toBe(0);
      expect(wrapper.vm.dataSource[1].instance_number).toBe(1);
      expect(AcquisitionPackage.setCurrentContractInstanceNumber).toHaveBeenCalled();
      expect(AcquisitionPackage.doSetCurrentContracts).toHaveBeenCalled();
    })

    it("navigate() => successfully mocks route", async()=>{
      const expectedRouterActionObject = {
        "name": "Current_Contract_Details", 
        "params": {"direction": "next"}
      }
      await wrapper.vm.navigate();
      expect(mockRouter.push).toHaveBeenCalledTimes(1)
      expect(mockRouter.push).toHaveBeenCalledWith(expectedRouterActionObject);
    })

    describe("saveOnLeave() =>", () => {
      beforeEach(()=>{
        wrapper.setData({dataSource});
      })
      
      it("calls functions if dataSource has length > 0 ", async () => {
        jest.spyOn(AcquisitionPackage, "doSetCurrentContracts")
          .mockImplementation(()=>Promise.resolve());
        jest.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
          .mockImplementation(()=>Promise.resolve());
        
        await wrapper.vm.saveOnLeave();
        expect(AcquisitionPackage.doSetCurrentContracts).toHaveBeenCalledWith(
          wrapper.vm.$data.dataSource
        )
      });

      it("mocks an error", async () => {
        const errMessage = 'errMessage'

        jest.spyOn(AcquisitionPackage, "doSetCurrentContracts")
          .mockRejectedValue(errMessage)
        jest.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
          .mockRejectedValue(errMessage)
        await wrapper.vm.saveOnLeave();
        expect(wrapper.vm.$data.saveOnLeaveError).toBe(errMessage)
      })
    });

    describe("confirmDeleteInstance() =>", () => {
      
      it("sets modal title WITH contractor name", async () => {
        wrapper.vm.confirmDeleteInstance(dataSource[0]);
        expect(wrapper.vm.deleteInstanceModalTitle).toContain(
          dataSource[0].incumbent_contractor_name
        );
      });
      it("sets modal title WITHOUT contractor name", async () => {
        dataSource[0].incumbent_contractor_name = "";
        wrapper.vm.confirmDeleteInstance(dataSource[0]);
        expect(wrapper.vm.deleteInstanceModalTitle).toContain(
          "this contract"
        );
      });
      it("sets $data attribes as expected", async () => {
        wrapper.vm.confirmDeleteInstance(dataSource[0]);
        expect(wrapper.vm.$data.showDeleteInstanceDialog).toBe(true);
        expect(wrapper.vm.$data.instanceToDelete).toEqual(dataSource[0]);
      });
    });

    describe("deleteInstance() =>", () => {
      beforeEach(() => {
        
        jest.spyOn(AcquisitionPackage, "deleteContract")
          .mockImplementation(()=>Promise.resolve())
        jest.spyOn(wrapper.vm, "resetDataSource")
          .mockImplementation(()=>Promise.resolve())
        wrapper.setData({
          dataSource,
          instanceNumberToDelete: 2
        })
      });

      it("sets $data attributes as expected ", async () => {
        wrapper.vm.deleteInstance();
        await Vue.nextTick();
        expect(wrapper.vm.$data.showDeleteInstanceDialog).toBe(false)
        expect(wrapper.vm.$data.instanceToDelete).toEqual({});
        // item is `deleted`  from $data.dataSource
        expect(wrapper.vm.$data.dataSource.length).toBe(
          dataSource.length-1
        )
      });
    });
  });

});
