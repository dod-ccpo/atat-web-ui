/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, shallowMount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Portfolio from "./Portfolio.vue";
import { AlertDTO } from "@/api/models";
import { AxiosRequestConfig } from "axios";
import mockDashboardData from "./__tests__/dashboardMocks..json"
import { DashboardService, PortFolioDashBoardDTO } from "@/services/dashboards";
import { AlertService } from "@/services/alerts";

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

  const getMockAlerts = ()=> {

    let mockAlerts:AlertDTO[] = [];
        
    switch(alertsKey){
    case alertKeys.SixtyDaysSeventyFivePercent:
      mockAlerts = alerts_60days_75percent;
      break;
    case alertKeys.Expired:
      mockAlerts = alerts_expired
      break;
    }
    return mockAlerts;
  }


  class MockDashboardService extends DashboardService{

    public async getdata(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      taskOrderNumber: string
    ): Promise<PortFolioDashBoardDTO> {
      return new Promise((resolve) => resolve(dashboardMock()));
    }
       
  }

  class MockAlertService extends AlertService{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getAlerts(taskOrderNumber: string): Promise<AlertDTO[]>{
      return new Promise((resolve=>resolve(getMockAlerts())));
    }
  }

  const dashboardMock = ()=> mockDashboardData;
  jest.mock("@/services/dashboards", () => ({
    MockDashboardService: MockDashboardService
  }));

  jest.mock("@/services/alerts", ()=>({
    MockAlertService: MockAlertService
  }));

  jest.mock("@/api", () => ({
    ...jest.requireActual("@/api"),
    alertsTable: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getQuery: (config?: AxiosRequestConfig): Promise<AlertDTO[]> => {
        return new Promise((resolve) => resolve(getMockAlerts()));
      },
    },
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
  
      jest.spyOn(wrapper.vm, 'getAlerts').mockImplementation(()=> 
        new Promise((resolve=>resolve(alerts_60days_75percent))));
      await wrapper.vm.processAlerts();
      expect(wrapper.vm.fundingAlertType)
        .toEqual(FundingAlertTypes.POPExpiresSoonWithLowFunds)
  
    });
  
    it("if expired sets right alert", async () => {
      vuetify = new Vuetify();
    
      wrapper = shallowMount(Portfolio, {
        vuetify,
        localVue,
      });
    
      jest.spyOn(wrapper.vm, 'getAlerts').mockImplementation(()=> 
        new Promise((resolve=>resolve(alerts_expired))));
      await wrapper.vm.processAlerts();
      expect(wrapper.vm.fundingAlertType)
        .toEqual(FundingAlertTypes.POPExpired)
    
    });
    
  });
});
