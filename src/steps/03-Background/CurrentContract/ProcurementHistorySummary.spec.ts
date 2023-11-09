/* eslint-disable camelcase */
import { describe, it, expect, vi} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import ProcurementHistorySummary 
  from "@/steps/03-Background/CurrentContract/ProcurementHistorySummary.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { CurrentContractDTO } from "@/api/models";

vi.mock("@/store/acquisitionPackage");

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

describe("Testing ProcurementHistorySummary Component", () => {
  const wrapper: VueWrapper = shallowMount(ProcurementHistorySummary, {
    global: {
      mocks: {
        $router: {
          push: vi.fn()
        }
      }
    }
  });
  const vm =  (wrapper.vm as typeof wrapper.vm.$options);

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
      expect(vm.hasContractData).toBe(true);
    });

  });

  describe("Testing FUNCTIONS", () => {
    beforeEach(() => {
      wrapper.setData({dataSource})
    });
    it("formatContractDate() => returns date in MM/DD/YYYY format", async()=>{
      const formattedDate = vm.formatContractDate("2022-12-31");
      expect(formattedDate).toBe("12/31/2022")
    })
    it("formatContractDate() => returns ''", async()=>{
      const formattedDate = vm.formatContractDate("");
      expect(formattedDate).toBe("")
    })
    
    it("setHeaderId() => returns expected string with no spaces", async()=>{
      const columnHeader = "column header"
      expect(vm.setHeaderId(columnHeader)).not.toContain(" ");
    })
    
    it("editInstance() => ensure store methods & navigation method are called", async()=>{
      vi.spyOn(AcquisitionPackage, "setCurrentContractInstanceNumber")
        .mockImplementation(
          ()=>Promise.resolve());
      vi.spyOn(AcquisitionPackage, "doSetCurrentContracts")
        .mockImplementation(()=>Promise.resolve());
      vi.spyOn(vm, "navigate")
        .mockImplementation(()=>{/**nothing returned*/});
      await vm.editInstance(dataSource[0]);
      expect(AcquisitionPackage.setCurrentContractInstanceNumber).toHaveBeenCalled();
      expect(AcquisitionPackage.doSetCurrentContracts).toHaveBeenCalled();
      expect(vm.navigate).toHaveBeenCalled();
    })

    it("addInstance() => ensure methods are called", async()=>{
      vi.spyOn(vm, "initializeDataSource")
        .mockImplementation(()=>{/**nothing returned*/});
      vi.spyOn(vm, "navigate")
        .mockImplementation(()=>{/**nothing returned*/});
      await vm.addInstance();
      expect(vm.initializeDataSource).toHaveBeenCalled();
      expect(vm.navigate).toHaveBeenCalled();
    })

    it("initializeDataSource() => returns initialized datasource", async()=>{
      vi.restoreAllMocks();
      wrapper.setData({dataSource: undefined})
      vi.spyOn(AcquisitionPackage, "setCurrentContractInstanceNumber")
      await vm.initializeDataSource();
      expect(vm.dataSource).toHaveLength(1)
    })

    it("resetDataSource() => ensures dataSource is sorted and expected methods are called", 
      async()=>{
        vi.spyOn(AcquisitionPackage, "setCurrentContractInstanceNumber")
          .mockImplementation(
            ()=>Promise.resolve());
        vi.spyOn(AcquisitionPackage, "doSetCurrentContracts")
          .mockImplementation(()=>Promise.resolve());
        wrapper.setData({dataSource: unsortedDataSource});
        await vm.resetDataSource();
        expect(vm.dataSource[0].instance_number).toBe(0);
        expect(vm.dataSource[1].instance_number).toBe(1);
        expect(AcquisitionPackage.setCurrentContractInstanceNumber).toHaveBeenCalled();
        expect(AcquisitionPackage.doSetCurrentContracts).toHaveBeenCalled();
      })


    it("navigate() => successfully mocks route", async()=>{
      const expectedRouterActionObject = {
        "name": "Current_Contract_Details", 
        "query": {"direction": "next"}
      }
      await vm.navigate();
      expect(vm.$router.push).toHaveBeenCalledTimes(1)
      expect(vm.$router.push).toHaveBeenCalledWith(expectedRouterActionObject);
    })

    describe("saveOnLeave() =>", () => {
      beforeEach(()=>{
        wrapper.setData({dataSource});
      })
      
      it("calls functions if dataSource has length > 0 ", async () => {
        vi.spyOn(AcquisitionPackage, "doSetCurrentContracts")
          .mockImplementation(()=>Promise.resolve());
        vi.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
          .mockImplementation(()=>Promise.resolve());
        
        await vm.saveOnLeave();
        expect(AcquisitionPackage.doSetCurrentContracts).toHaveBeenCalledWith(
          vm.$data.dataSource
        )
      });

      it("mocks an error", async () => {
        const errMessage = 'errMessage'

        vi.spyOn(AcquisitionPackage, "doSetCurrentContracts")
          .mockRejectedValue(errMessage)
        vi.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
          .mockRejectedValue(errMessage)
        await vm.saveOnLeave();
        expect(vm.$data.saveOnLeaveError).toBe(errMessage)
      })
    });

    describe("confirmDeleteInstance() =>", () => {
      
      it("sets modal title WITH contractor name", async () => {
        vm.confirmDeleteInstance(dataSource[0]);
        expect(vm.deleteInstanceModalTitle).toContain(
          dataSource[0].incumbent_contractor_name
        );
      });
      it("sets modal title WITHOUT contractor name", async () => {
        dataSource[0].incumbent_contractor_name = "";
        vm.confirmDeleteInstance(dataSource[0]);
        expect(vm.deleteInstanceModalTitle).toContain(
          "this contract"
        );
      });
      it("sets $data attribes as expected", async () => {
        vm.confirmDeleteInstance(dataSource[0]);
        expect(vm.$data.showDeleteInstanceDialog).toBe(true);
        expect(vm.$data.instanceToDelete).toEqual(dataSource[0]);
      });
    });

    describe("deleteInstance() =>", () => {
      beforeEach(() => {
        
        vi.spyOn(AcquisitionPackage, "deleteContract")
          .mockImplementation(Promise.resolve)
        vi.spyOn(vm, "resetDataSource")
          .mockImplementation(()=>Promise.resolve())
        wrapper.setData({
          dataSource,
          instanceNumberToDelete: 2
        })
      });
      //TODO works in isolation, data spillover is causing failure
      it.skip("sets $data attributes as expected ", async () => {
        vi.restoreAllMocks();
        vm.deleteInstance();
        await vm.$nextTick(async ()=> {
          expect(vm.showDeleteInstanceDialog).toBe(false)
        });
        expect(vm.instanceToDelete).toEqual({});
        // item is `deleted`  from $data.dataSource
        expect(vm.dataSource.length).toBe(
          dataSource.length-1
        )
      });
    });
  });

});
