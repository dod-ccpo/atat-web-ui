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
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  
  it("tests TOSearchCancelled()", async () =>{
    const mockSetTOFollowon = jest.spyOn(PortfolioStore, "setProvisioningTOFollowOn")
    await wrapper.vm.TOSearchCancelled();
    expect(wrapper.vm.$data.TONumber).toBe("");
    expect(wrapper.vm.$data.resetValidationNow).toBe(false);
    expect(wrapper.vm.$data.showTOSearchModal).toBe(false);
    expect(mockSetTOFollowon).toHaveBeenCalledWith(false)
  })

  it("tests openSearchTOModal()", async () =>{
    const mockSetTOFollowon = jest.spyOn(PortfolioStore, "setProvisioningTOFollowOn")
    await wrapper.vm.openSearchTOModal();
    expect(wrapper.vm.$data.showTOSearchModal).toBe(true);
    expect(mockSetTOFollowon).toHaveBeenCalledWith(true)
  })

  it("tests startProvisionWorkflow()", async () =>{
    const mockSetTOPackageSelection = jest.spyOn(PortfolioStore, "setShowTOPackageSelection")
    const mockSetSelected = jest.spyOn(PortfolioStore, "setSelectedAcquisitionPackageSysId")
    const mockReset = jest.spyOn(AcquisitionPackage, "reset")
    const mockAppSections = jest.spyOn(AppSections, "changeActiveSection")
    const mockCardData = {sysId: '1234'}
    await wrapper.setData({cardData: mockCardData})
    await wrapper.vm.startProvisionWorkflow();
    expect(mockReset).toHaveBeenCalled()
    expect(mockSetTOPackageSelection).toHaveBeenCalledWith(false)
    expect(mockSetSelected).toHaveBeenCalledWith(mockCardData.sysId)
    expect(mockAppSections).toHaveBeenCalledWith(AppSections.sectionTitles.ProvisionWorkflow)
  })
  

})
