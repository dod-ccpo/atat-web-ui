import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import ProcurementHistorySummary from "@/steps/03-Background/CurrentContract/ProcurementHistorySummary.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { CurrentContractDTO } from "@/api/models";
import { resolveAny, Resolver } from "dns";

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

describe("Testing ProcurementHistorySummary Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProcurementHistorySummary, {
      localVue,
      vuetify,
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

    it("setHeaderId() => returns expected string", async()=>{
      const columnHeader = "column header"
      expect(wrapper.vm.setHeaderId(columnHeader)).not.toContain(" ");
    })

    describe("editInstance() =>", () => {
      // let setCurrentContractInstanceNumber: jest.SpyInstance<Promise<void>, [num: number]>
      //   = jest.fn();
      // let doSetCurrentContracts: jest.SpyInstance<Promise<void>,[value: CurrentContractDTO[]]> 
      //   = jest.fn();
      // let navigate: jest.SpyInstance<any, unknown[]>
      //   = jest.fn();

      beforeEach(() => {
        jest.clearAllMocks();
        wrapper.setData({dataSource})
        jest.spyOn(wrapper.vm, "navigate")
          .mockImplementation(()=>{})
        
        
      });
      it("setCurrentContractInstanceNumber is called", async()=>{
        const setCurrentContractInstanceNumber = 
          jest.spyOn(AcquisitionPackage, "setCurrentContractInstanceNumber")
            .mockImplementation(
              ()=>Promise.resolve());
         
          jest.spyOn(AcquisitionPackage, "doSetCurrentContracts")
            .mockImplementation(()=>Promise.resolve());
        await wrapper.vm.editInstance(dataSource[0]);
        expect(setCurrentContractInstanceNumber).toHaveBeenCalled();
        // await Vue.nextTick();
        // expect(AcquisitionPackage.doSetCurrentContracts).toHaveBeenCalled();
        expect(wrapper.vm.navigate).toHaveBeenCalled();
      })

      // it("doSetCurrentContracts is called", async()=>{
      //   const doSetCurrentContracts = 
      //     jest.spyOn(AcquisitionPackage, "doSetCurrentContracts")
      //       .mockImplementation((dataSource)=>Promise.resolve());
      //   wrapper.vm.editInstance(dataSource[0]);
      //   expect(doSetCurrentContracts).toHaveBeenCalled();
      // })
    })
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
