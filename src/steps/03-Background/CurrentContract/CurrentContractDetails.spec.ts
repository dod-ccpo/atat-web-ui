import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import Vuex from "vuex";
import CurrentContractDetails from "@/steps/03-Background/CurrentContract/CurrentContractDetails.vue";
import validators from "../../../plugins/validation";
import AcquisitionPackage,{ StoreProperties}
  from "@/store/acquisitionPackage";
import { CurrentContractDTO } from "@/api/models";
import { isDate } from "lodash";

describe("Testing CurrentContractDetails Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;
  const store = new Vuex.Store(AcquisitionPackage)

  const populatedCurrentContract = {
    currentContract:{
      contract_order_start_date: "12/31/2022",
      contract_order_expiration_date: "12/31/2027"
    }
  }

  const emptyCurrentContract = {
    currentContract:{
      contract_order_start_date: "",
      contract_order_expiration_date: ""
    }
  }

  const currentContractDTO = {
    instance_number: 1,
    current_contract_exists: "YES",
    incumbent_contractor_name: "incumbent_contractor_name",
    contract_number: "123",
    task_delivery_order_number: "123",
    contract_order_expiration_date: "10/12/2022",
    contract_order_start_date: "10/12/2023",
    competitive_status: "cs",
    business_size: "bs",
    acquisition_package: "123",
    is_valid: true,
    sys_created_by: "me",
    is_current: true,
  }
  

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentContractDetails, {
      localVue,
      vuetify,
      store
    });
  });

  afterEach(() => {
    wrapper.vm.$data.currentData = null;
    wrapper.vm.$data.savedData = null;
    wrapper.vm.$data.currentContract = null;
    wrapper.vm.$data.currentContracts = [];
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("GETTERS", () => {
  
    const isCurrent = {
      currentContract:{
        contract_order_start_date: "12/31/2022",
        contract_order_expiration_date: "12/31/2027"
      },
      isCurrent: true
    }
    const isPrevious = {
      currentContract:{
        contract_order_expiration_date: "12/31/2022"
      },
      isCurrent: false
    }    

    it("setHeadline()=> returns `current` headline ", async () => {
      wrapper.setData(isCurrent);
      wrapper.vm.setHeadline();
      expect(wrapper.vm.$data.headline).toContain('current');
    });

    it("setHeadline()=> returns `previous` headline ", async () => {
      wrapper.setData(isPrevious);
      wrapper.vm.setHeadline();
      expect(wrapper.vm.$data.headline).toContain('previous');
    });

    it("startDate()=> returns valid date ", async () => {
      wrapper.setData({
        currentContract:{
          contract_order_start_date: "12/31/2022"
        },
      });
      expect(wrapper.vm.startDate).toEqual("2022-12-31")
    });

    it("startDate()=> returns empty string ", async () => {
      expect(wrapper.vm.startDate).toEqual("")
    });

    it("expirationDate()=> returns valid date ", async () => {
      wrapper.setData({
        currentContract:{
          contract_order_expiration_date: "12/31/2022"
        },
      });
      expect(wrapper.vm.expirationDate).toEqual("2022-12-31")
    });

    it("expirationDate()=> returns empty string ", async () => {
      expect(wrapper.vm.expirationDate).toEqual("")
    });

    // todo restore this
    // it("tomorrowDateISO() => returns tomorrows date ", async () => {
    //   const jsTomorrowDateISO = 
    //     new Date((new Date()).setDate((new Date()).getDate()+1)).toISOString().substring(0,10);
    //   expect(jsTomorrowDateISO).toEqual(wrapper.vm.tomorrowDateISO);
    // });

    it("isDatePickersEmpty() => returns true ", async () => {
      wrapper.setData(emptyCurrentContract);
      expect(wrapper.vm.isDatePickersEmpty).toEqual(true);
    });

    it("isDatePickersEmpty() => returns false ", async () => {
      await wrapper.setData(populatedCurrentContract);
      expect(wrapper.vm.isDatePickersEmpty).toBe(false);
    });

    it("isExceptiontoFairOpp() => returns true", async () =>{
      expect(wrapper.vm.isExceptiontoFairOpp).toBe(true);
    })

    it("currentData() => returns currentData obj", async () =>{
      wrapper.setData(isCurrent);
      expect(wrapper.vm.currentData).toEqual(isCurrent.currentContract);
    })

    it("currentData() => returns initialCurrentContract()", async () =>{
      wrapper.setData({currentContract: undefined});
      //initialContract will have all empty values;
      expect(Object.values(wrapper.vm.currentData).every(v=>v===""))
    })
  })
  
  describe("FUNCTIONS", () => {
    describe("Testing Error Messages functions()", () => {
      const value = ["Error Message 001"];
   
      beforeEach(() => {
        jest.useFakeTimers();
      });
  
      afterEach(()=>{
        jest.useRealTimers();
        jest.clearAllTimers();
      })
  
      describe("returns custom error message ...", () => {
        beforeEach(() => {
          wrapper.setData(emptyCurrentContract);
        });
        afterEach(()=>{
          jest.advanceTimersByTime(3000);
          expect(wrapper.vm.$data.expirationDPSharedErrorMessages[0])
          .toContain('PoP start and expiration dates');
        })
  
        it("setStartDateErrorMessages(value)", async () =>{
          wrapper.vm.setStartDateErrorMessages(value)
        })
  
        it("setExpirationDateErrorMessages(value)", async () =>{
          wrapper.vm.setExpirationDateErrorMessages(value)
        })
      });
  
      describe("returns `value` param as error message ...", () => {
        beforeEach(() => {
          wrapper.setData(populatedCurrentContract);
        });
        afterEach(()=>{
          jest.advanceTimersByTime(3000);
          expect(wrapper.vm.$data.expirationDPSharedErrorMessages[0]).toEqual(value[0]);
        })
        it("setStartDateErrorMessages(value)", async () =>{
          wrapper.vm.setStartDateErrorMessages(value)
        })
        it("setExpirationDateErrorMessages(value)", async () =>{
          wrapper.vm.setExpirationDateErrorMessages(value)
        })
      });
    })
    it("removeSharedErrorMessages(value) => emptying errorMessages arrays", async () =>{
      wrapper.vm.removeSharedErrorMessages(true)
      expect(wrapper.vm.$data.startDPSharedErrorMessages).toEqual([]);
      expect(wrapper.vm.$data.expirationDPSharedErrorMessages).toEqual([]);
    })

    describe("loadContract()", () => {
      currentContractDTO.instance_number = 1;
      it("returns current contract from contacts in store", async () =>{
        wrapper.setData({currentContract: currentContractDTO})
        await AcquisitionPackage.doSetCurrentContracts([currentContractDTO])
        await wrapper.vm.loadContract();
        expect(wrapper.vm.$data.currentContract).toEqual(
          wrapper.vm.$data.currentContracts[0]
        )
      })

      it("returns new blank contract", async () =>{
        currentContractDTO.instance_number = 2;
        await AcquisitionPackage.doSetCurrentContracts([currentContractDTO]);
        await wrapper.vm.loadContract();
        expect(Object.values(wrapper.vm.$data.currentContract).every(v=>v===""))
       
      })

      it("ensures $data.isCurrent is set as expected", async () =>{
        currentContractDTO.instance_number = 2;
        await AcquisitionPackage.doSetCurrentContracts([currentContractDTO]);
        await wrapper.vm.loadContract();
        expect(wrapper.vm.$data.isCurrent).not.toBe(true)
      })
    })

    it("loadOnEnter () => loads existing contract", async () =>{
      wrapper.setData({currentContract: currentContractDTO})
      await AcquisitionPackage.doSetCurrentContracts([currentContractDTO])
      await wrapper.vm.loadOnEnter();
      expect(Object.keys(wrapper.vm.savedData).sort())
      .toEqual(Object.keys(wrapper.vm.currentContract).sort());
    })

    describe("hasChanged()", () => {
      const currentData = {instance_number: 12};
      const savedData = {instance_number: 13};
      
      it("returns true", async () =>{
        await wrapper.setData({currentData, savedData})
        const hasChanged = await wrapper.vm.hasChanged();
        expect(hasChanged).toBe(true)
      }) 
      
      it("returns false", async () =>{
        await wrapper.setData({currentData, savedData: currentData})
        const hasChanged = await wrapper.vm.hasChanged();
        expect(hasChanged).toBe(false)
      })
    });

    describe("saveOnLeave()", () => {
      const acqPkgId = "12345"
      const currentData = {
        instance_number: 12,
        acquisition_package: acqPkgId
      } as CurrentContractDTO;
      const savedData = {instance_number: 13};
      
      beforeEach(()=>{
        wrapper.setData({
          currentData, 
          savedData,
      })
        AcquisitionPackage.doSetPackageId(acqPkgId);
       
      })

      afterEach(()=>{
        savedData.instance_number = 1;
      })
      
      it("if current and saved data has changed", async () =>{
        await wrapper.vm.saveOnLeave();
        expect(wrapper.vm.currentData.acquisition_package).toBe(acqPkgId);
        expect(wrapper.vm.currentData.is_valid).toBe(false);
      }) 

      it("if current and saved data and sets $data.isCurrent", async () =>{
        wrapper.setData({
          currentContract:{
            contract_order_expiration_date: "2019-12-31"
          }
        })
        await wrapper.vm.saveOnLeave();
        expect(wrapper.vm.$data.isCurrent).toBe(true);
      }) 
      
      it("if current and saved data has changed and NO exception to fair opportunity", async () =>{
        await AcquisitionPackage.doSetFairOpportunity(
            {exception_to_fair_opportunity: "NO_NONE"}
        )
        const mockFunction = jest.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
          .mockImplementation(([currenData])=>Promise.resolve())
        await wrapper.vm.saveOnLeave();
        expect(mockFunction).toHaveBeenCalled();
      }) 

      it("mocks an error", async () =>{
        const errMessage = 'error occurred'
        const mockFunction = jest.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
          .mockRejectedValue(errMessage)
        const saveOnLeave = await wrapper.vm.saveOnLeave();
        expect(wrapper.vm.saveOnLeaveError).toBe(errMessage);
      }) 


  
    });

    it("sortDataSource() => sorts data source items based on time created ", async () =>{
      const currentContracts = [
        {instance_number: 1, sys_created_on: "10/12/2023"},
        {instance_number: 2, sys_created_on: "10/12/2021"}
      ]
      wrapper.setData({currentContracts});
      await wrapper.vm.sortDataSource();
      expect(wrapper.vm.$data.currentContracts[0].sys_created_on).toBe("10/12/2021");
    })

    it("setMinAndMaxDates() => returns dates as expected ", async () =>{
      await wrapper.vm.setMinAndMaxDates();
      expect(wrapper.vm.$data.startMinDate).toBe("");
      expect(wrapper.vm.$data.startMaxDate.substring(0,4))
        .toBe((new Date()).getFullYear().toString());
      expect(wrapper.vm.$data.expMinDate).toBe("");
      expect(wrapper.vm.$data.expMaxDate).toBe("");
    })


  });
});
