/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ProvisionWorkflow from './ProvisionWorkflow.vue'
import Steps from "@/store/steps";
import AppSections from "@/store/appSections";

Vue.use(Vuetify);
const mockRoute = {
  params: {
    id: 1,
  },
  name: "Awarded_Task_Order"
};
const mockRouter = {
  push: jest.fn(),
};

describe("Testing ProvisionWorkflow", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProvisionWorkflow, {
      vuetify,
      localVue,
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
    });
  });

  afterEach(()=>{
    jest.clearAllMocks();
  })


  describe("testing ProvisionWorkflow", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    })
    
    it("test navigate() => Home", async () =>{
      const mockChangeActive = jest.spyOn(AppSections, "changeActiveSection").mockImplementation();
      await wrapper.setData({altBackDestination: AppSections.sectionTitles.Home})
      await wrapper.vm.navigate('previous')
      expect(mockChangeActive).toHaveBeenCalledWith(AppSections.sectionTitles.Home)
    })

    it("test navigate() => Packages", async () =>{
      const mockChangeActive = jest.spyOn(AppSections, "changeActiveSection").mockImplementation();
      await wrapper.setData({altBackDestination: AppSections.sectionTitles.Packages})
      await wrapper.vm.navigate('previous')
      expect(mockChangeActive).toHaveBeenCalledWith(AppSections.sectionTitles.Packages)
    })

    it("test navigate() => CreateFirstPortfolio", async () =>{
      const mockChangeActive = jest.spyOn(AppSections, "changeActiveSection").mockImplementation();
      await wrapper.setData({altBackDestination: AppSections.sectionTitles.CreateFirstPortfolio})
      await wrapper.vm.navigate('previous')
      expect(mockChangeActive).toHaveBeenCalledWith(AppSections.sectionTitles.CreateFirstPortfolio)
    })

    it("test navigate() => PortfolioSummary", async () =>{
      const mockChangeActive = jest.spyOn(AppSections, "changeActiveSection").mockImplementation();
      const mockTabIndex = jest.spyOn(AppSections, "setActiveTabIndex").mockImplementation();
      jest.spyOn(global, 'setTimeout')
      await wrapper.setData({altBackDestination: AppSections.sectionTitles.PortfolioSummary})
      await wrapper.vm.navigate('previous')
      expect(mockChangeActive).toHaveBeenCalledWith(AppSections.sectionTitles.PortfolioSummary)
      expect(setTimeout).toHaveBeenCalled()
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);
    })

    it("test navigate() => Portfolios", async () =>{
      const mockChangeActive = jest.spyOn(AppSections, "changeActiveSection").mockImplementation();
      await wrapper.setData({altBackDestination: AppSections.sectionTitles.Portfolios})
      await wrapper.vm.navigate('previous')
      expect(mockChangeActive).toHaveBeenCalledWith(AppSections.sectionTitles.Portfolios)
    })
    
  });



});