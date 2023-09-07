/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ProvisionWorkflow from './ProvisionWorkflow.vue'
import AppSections from "@/store/appSections";
import Steps from "@/store/steps";
import PortfolioStore from "@/store/portfolio";
import api from "@/api";
import { Portfolio } from "types/Global";

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
      await wrapper.setData({altBackDestination: AppSections.sectionTitles.PortfolioSummary})
      await wrapper.vm.navigate('previous')
      expect(mockChangeActive).toHaveBeenCalledWith(AppSections.sectionTitles.PortfolioSummary)
    })

    it("test navigate() => Portfolios", async () =>{
      const mockChangeActive = jest.spyOn(AppSections, "changeActiveSection").mockImplementation();
      await wrapper.setData({altBackDestination: AppSections.sectionTitles.Portfolios})
      await wrapper.vm.navigate('previous')
      expect(mockChangeActive).toHaveBeenCalledWith(AppSections.sectionTitles.Portfolios)
    })

    it("test navigate() => Show TO confirm modal", async () =>{
      const mockChangeActive = jest.spyOn(AppSections, "getSectionData").mockResolvedValue({
        activeSection: "ProvisionWorkflow",
        sectionTitles: {}
      });
      jest.spyOn(Steps, 'getNext').mockResolvedValue('next')
      PortfolioStore.setProvisioningTOFollowOn(true)
      await wrapper.setData({altBackDestination: AppSections.sectionTitles.Portfolios})
      await wrapper.vm.navigate('next')
      expect(wrapper.vm.$data.showTOConfirmModal).toBe(true)
    })

    it("test addTaskorderToPortfolio", async () =>{
      const portfolio = {sysId: '1234'} as Portfolio
      jest.spyOn(PortfolioStore, "setCurrentPortfolio").mockImplementation(
        (portfolio) => Promise.resolve()
      )
      jest.spyOn(api.edaApi, "addTO").mockImplementation(() => 
      Promise.resolve({success: true})
    );
    const mockChangeActive = jest.spyOn(AppSections, "changeActiveSection").mockImplementation();
      await wrapper.setData({TONumber: '10000'}) 
      await wrapper.vm.addTaskorderToPortfolio();
      expect(mockChangeActive).toHaveBeenCalledWith(AppSections.sectionTitles.PortfolioSummary)
    })
    it("tests TOConfirmCancelled()", async () =>{
      await wrapper.vm.TOConfirmCancelled();
      expect(wrapper.vm.$data.showTOConfirmModal).toBe(false);
    })
  });
});