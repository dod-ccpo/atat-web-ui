import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import Index  from "@/portfolios/Index.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import AppSections from "@/store/appSections";
import PortfolioStore from "@/store/portfolio";
import validators from "@/plugins/validation";
Vue.use(Vuetify);
const mockRouter = {
  push: jest.fn(),
};
const mockRoute = {
  params: {
    id: 1,
  },
};

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Index, {
      localVue,
      vuetify,
      mocks: {
        $router: mockRouter,
        $route: mockRoute
      } 
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  
  it("tests TOSearchCancelled()", async () =>{
    const mockSetTOFollowon = jest.spyOn(PortfolioStore, "setProvisioningTOFollowOn")
    await wrapper.vm.TOSearchCancelled();
    expect(wrapper.vm.$data.TONumber).toBe("");
    expect(wrapper.vm.$data.resetValidationNow).toBe(true);
    expect(wrapper.vm.$data.showTOSearchModal).toBe(false);
    expect(mockSetTOFollowon).toHaveBeenCalledWith(false)
  })

  it("tests openTOModal()", async () =>{
    const mockSetTOFollowon = jest.spyOn(PortfolioStore, "setProvisioningTOFollowOn")
    await wrapper.vm.openTOModal();
    expect(wrapper.vm.$data.showTOSearchModal).toBe(true);
    expect(mockSetTOFollowon).toHaveBeenCalledWith(false)
  })

  it("tests startProvisionWorkflow()", async () =>{
    const mockSetTOPackageSelection = jest.spyOn(PortfolioStore, "setShowTOPackageSelection")
    const mockReset = jest.spyOn(AcquisitionPackage, "reset")
    const mockAppSections = jest.spyOn(AppSections, "changeActiveSection")
    const mockCardData = {sysId: '1234'}
    await wrapper.setData({portfolioSysId: mockCardData.sysId})
    await wrapper.vm.startProvisionWorkflow();
    expect(mockReset).toHaveBeenCalled()
    expect(mockSetTOPackageSelection).toHaveBeenCalledWith(false)
    expect(mockAppSections).toHaveBeenCalledWith(AppSections.sectionTitles.ProvisionWorkflow)
  })
  

})
