/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, shallowMount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Portfolio from "./Portfolio.vue";
import { AlertDTO } from "@/api/models";
import { FundingAlertData } from "@/store/portfolio";

const FundingAlertTypes = {
  POPExpiresSoonNoTOClin: "POPExpiresSoonDaysNoTOClin",
  POPExpiresSoonWithTOClin: "POPExpiresSoonWithTOClin",
  POPExpiresSoonWithLowFunds: "POPExpiresSoonWithLowFunds",
  POPExpired: "POPExpired",
};
  

Vue.use(Vuetify);


describe("Testing Portfolio", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const alertKeys = {
    SixtyDaysSeventyFivePercent: "SixtyDaysSeventyFivePercent",
    Expired: "Expired"

  }

  let alertsKey = alertKeys.SixtyDaysSeventyFivePercent;

  const alerts_60days_75percent: AlertDTO[] = [
    {
      clin: "",
      task_order: "tsk_12345678",
      active: "true",
      alert_type: "SPENDING_ACTUAL",
      threshold_violation_amount: "75",
      last_notification_date: "",
      portfolio: "",
    },
    {
      clin: "",
      task_order: "tsk_12345678919",
      active: "true",
      alert_type: "TIME_REMAINING",
      threshold_violation_amount: "60",
      last_notification_date: "",
      portfolio: "",
    },
  ];

  const alerts_expired: AlertDTO[] = [
    {
      clin: "",
      task_order: "tsk_12345678919",
      active: "true",
      alert_type: "TIME_REMAINING",
      threshold_violation_amount: "-30",
      last_notification_date: "",
      portfolio: "",
    },
  ];


  const getFundingTrackerAlertMock = ()=> {
    const fundingAlertData:FundingAlertData = {
      alerts: [],
      daysRemaining: 0,
      spendingViolation: 0,
      fundingAlertType: "",
      hasLowFundingAlert: false
    }

    switch(alertsKey){
    case alertKeys.SixtyDaysSeventyFivePercent:
      fundingAlertData.alerts  = alerts_60days_75percent;
      fundingAlertData.daysRemaining = 60;
      fundingAlertData.spendingViolation = 75;
      fundingAlertData.hasLowFundingAlert = true;
      fundingAlertData.fundingAlertType = FundingAlertTypes.POPExpiresSoonWithLowFunds;
      break;
    case alertKeys.Expired:
      fundingAlertData.alerts = alerts_expired;
      fundingAlertData.daysRemaining = -30;
      fundingAlertData.spendingViolation = 0;
      fundingAlertData.hasLowFundingAlert = false;
      fundingAlertData.fundingAlertType = FundingAlertTypes.POPExpired;
    }

    return fundingAlertData;
  }

  jest.mock("@/store/portfolio", ()=>({
    ...jest.requireMock("@/store/portfolio"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getFundingTrackerAlert: (taskOrderNumber: string): Promise<FundingAlertData> =>{
      return new Promise(resolve=>resolve(getFundingTrackerAlertMock()));
    }
  }));

  

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Portfolio, {
      vuetify,
      localVue
    });
  });

  describe("testing Portfolio", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("process alerts calls getAlerts", async () => {

      alertsKey = alertKeys.SixtyDaysSeventyFivePercent;
      vuetify = new Vuetify();

      wrapper = shallowMount(Portfolio, {
        vuetify,
        localVue,
      });

      const getAlerts = jest.spyOn(wrapper.vm, 'getAlerts').mockImplementation(()=> 
        new Promise((resolve=>resolve(alerts_60days_75percent))));
      await wrapper.vm.processAlerts();
      expect(getAlerts).toBeCalled();

    });

    it("60 days remaining and 75 percent funds spent sets right alert", async () => {

      alertsKey = alertKeys.SixtyDaysSeventyFivePercent;
      vuetify = new Vuetify();
  
      wrapper = shallowMount(Portfolio, {
        vuetify,
        localVue,
      });
      jest.spyOn(wrapper.vm, 'getAlerts').mockImplementation(()=> getFundingTrackerAlertMock())
      await wrapper.vm.processAlerts();
      expect(wrapper.vm.fundingAlertType())
        .toEqual(FundingAlertTypes.POPExpiresSoonWithLowFunds)
    });
  
    it("if expired sets right alert", async () => {
      vuetify = new Vuetify();
    
      alertsKey = alertKeys.Expired;
      wrapper = shallowMount(Portfolio, {
        vuetify,
        localVue,
      });
    
      jest.spyOn(wrapper.vm, 'getAlerts').mockImplementation(()=> getFundingTrackerAlertMock());
      await wrapper.vm.processAlerts();
      expect(wrapper.vm.fundingAlertType())
        .toEqual(FundingAlertTypes.POPExpired)
    
    });
    
  });
});
