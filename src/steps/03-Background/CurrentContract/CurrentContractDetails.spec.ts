import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import CurrentContractDetails from "@/steps/03-Background/CurrentContract/CurrentContractDetails.vue";
import validators from "../../../plugins/validation";
import { CurrentContractDTO } from "@/api/models";

describe("Testing CurrentContractDetails Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

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

    it("tomorrowDateISO() => returns tomorrows date ", async () => {
      const jsTomorrowDateISO = 
        new Date((new Date()).setDate((new Date()).getDate()+1)).toISOString().substring(0,10);
      expect(jsTomorrowDateISO).toEqual(wrapper.vm.tomorrowDateISO);
    });

    it("isDatePickersEmpty() => returns true ", async () => {
      wrapper.setData({
        currentContract:{
          contract_order_start_date: "",
          contract_order_expiration_date: ""
        },
      });
      expect(wrapper.vm.isDatePickersEmpty).toEqual(true);
    });

    it("isDatePickersEmpty() => returns false ", async () => {
      wrapper.setData({
        currentContract:{
          contract_order_start_date: "12/31/2022",
          contract_order_expiration_date: "12/31/2027"
        },
      });
      expect(wrapper.vm.isDatePickersEmpty).toEqual(false);
    });
  })

  describe("Testing Getters...", () => {

  })

});
