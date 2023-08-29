/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, shallowMount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import Portfolio from "./Portfolio.vue";
import ATATCharts from "@/store/charts";
import dashboardMocks from "@/dashboards/__tests__/dashboardMocks..json";

Vue.use(Vuetify);

describe("Testing Portfolio", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Portfolio, {
      vuetify,
      localVue,
    });
  });

  afterEach(()=>{
    jest.clearAllMocks();
  })


  describe("testing Portfolio", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("Test chartDataColorsTranslucent ", () => {

      const colorMadTranslucense = wrapper.vm.$data.chartDataColorsTranslucent;

      const dataColors = ATATCharts.chartDataColors;
      Object.values(dataColors).forEach((color, index) => {
        expect(colorMadTranslucense[index]).toBe(color + "33");
      });
    });

    
    it("Test calculateFundsSpent", async () => {

      const costs= [
        {
          is_actual: "true",
          value: "10",
        },
        {
          is_actual: "true",
          value: "20",
        },
        {
          is_actual: "true",
          value: "30",
        },
        {
          is_actual: "true",
          value: "40",
        },
        {
          is_actual: "true",
          value: "50",
        },
        {
          is_actual: "true",
          value: "60",
        },
        {
          is_actual: "true",
          value: "70",
        },
        {
          is_actual: "true",
          value: "80",
        },
        {
          is_actual: "true",
          value: "90",
        },
        {
          is_actual: "true",
          value: "100",
        },
      ];

      await wrapper.setData({
        costs: costs,
        fundsSpent: 0,
      });

      await wrapper.vm.calculateFundsSpent();
      expect(wrapper.vm.$data.fundsSpent).toBe(550);
    });

    it("Test loadOnEnter", async () => {
      vuetify = new Vuetify();

      wrapper = shallowMount(Portfolio, {
        vuetify,
        localVue,
      });

      jest.spyOn(wrapper.vm, "getDashboardData").mockReturnValue(
        new Promise(resolve=>resolve(dashboardMocks))
      )
      await wrapper.vm.loadOnEnter();

    });

    it("Test portfolioSyncDate() => returns empty string",async () =>{
      const dateStr = wrapper.vm.portfolioSyncDate;
      expect(dateStr).toBe("")
    })

    it("Test portfolioSyncDate() => returns date string",async () =>{
      PortfolioStore.currentPortfolio.lastCostDataSync = "2023-08-23 01:44:18"
      const dateStr = wrapper.vm.portfolioSyncDate;
      expect(dateStr).toBe("Last sync: Aug. 23 at 0144")
    })

  });

});