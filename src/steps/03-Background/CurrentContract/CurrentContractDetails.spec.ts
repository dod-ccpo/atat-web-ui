import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import CurrentContractDetails from "@/steps/03-Background/CurrentContract/CurrentContractDetails.vue";
import validators from "../../../plugins/validation";
import AcquisitionPackage,{ StoreProperties}
  from "@/store/acquisitionPackage";
import { FairOpportunityDTO } from "@/api/models";
import { isDate } from "lodash";

describe("Testing CurrentContractDetails Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

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
  

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentContractDetails, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("Testing Getters...", () => {
  
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
  

  describe("Testing Error Messages functions...", () => {
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
      it("setStartDateErrorMessages(value) => returns value", async () =>{
        wrapper.vm.setStartDateErrorMessages(value)
      })
      it("setExpirationDateErrorMessages(value) => returns custom error message", async () =>{
        wrapper.vm.setExpirationDateErrorMessages(value)
      })
    });
  })

});
