/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import TaskOrder from "@/portfolios/portfolio/components/TaskOrder/TaskOrder.vue";
import PortfolioSummary from "@/store/portfolioSummary";
import { ClinDTO, PortfolioSummaryDTO, PortfolioSummaryObj } from "@/api/models";
import validators from "@/plugins/validation";
import AppSections from "@/store/appSections";
import PortfolioStore from "@/store/portfolio";
import Toast from "@/store/toast";
Vue.use(Vuetify);

const mockRouter = {
  push: jest.fn(),
};
const mockRoute = {
  params: {
    id: 1,
  },
};

describe("Testing TaskOrder Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  localVue.use(validators);

  const total_task_order_value:(number | undefined) = 0;
  const total_lifecycle_amount:(number | undefined) = 0;
  const funds_spent_task_order:(number | undefined) = 0;
  const dummyPortfolioSummaryList = [
    {
      "portfolio_name": "test 3000",
      "portfolio_status": "PROCESSING",
      "agency": "BRITISH EMBASSY",
      "last_updated": "2023-09-27 11:17:01",
      "current_user_is_owner": true,
      "current_user_is_manager": false,
      "vendor": "GCP",
      "pop_start_date": "2023-12-08",
      "pop_end_date": "2028-10-07",
      "total_obligated": 1919000,
      "funds_spent": 0,
      "active_task_order": "3000000000000",
      "owner_full_name": "Test User",
      "funding_status": "ON_TRACK",
      "csp_portal_links": [
        {
          "csp": "google_il5_dev",
          "dashboard_link": ""
        },
        {
          "csp": "google_il6_dev",
          "dashboard_link": ""
        }
      ]
    }
  ];

  const mockTaskOrderProp = {
    taskOrder: {
      sys_id: '1234',
      total_task_order_value: '100.00',
      total_lifecycle_amount: '100.00',
      total_funds_spent:'100.00',
      total_obligated_funds: '100.00',
      task_order_number: '4321',
      task_order_status: 'ON_TRACK',

      pop_start_date: "2023-12-08",
      pop_end_date: "2024-12-08",
      clins: [] as ClinDTO[]
    }
  }

  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  // PortfolioStore.setActiveTaskOrderNumber("1234"); // EJY - DOUBLE-CHECK IF NEEDED
  

  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(TaskOrder, {
      localVue,
      vuetify,
      mocks: {
        $router: mockRouter,
        $route: mockRoute
      } 
    });
    await wrapper.setProps(mockTaskOrderProp)
  });

  it("renders successfully", async () => {
    
    expect(wrapper.exists()).toBe(true);
  });

  it("loadOnEnter() test with task order that has valid money amounts", async()=>{
    jest.spyOn(PortfolioSummary, 'getAllPortfolioSummaryList').mockReturnValue(
      new Promise(resolve => resolve(dummyPortfolioSummaryList as any))
    );
    await wrapper.vm.loadOnEnter();
  })

  it("loadOnEnter() portfolioIsUpdating", async()=>{
    PortfolioStore.setPortfolioIsUpdating(true);
    const mockToastObj = {
      type: "success",
      message: "Task Order Number Updated",
      isOpen: true,
      hasUndo: false,
      hasIcon: true,
    }
    
    const toastMock = jest.spyOn(Toast, "setToast").mockImplementation();
    const setIsUpdatingMock = jest.spyOn(PortfolioStore, "setPortfolioIsUpdating")
      .mockImplementation()
    await wrapper.vm.loadOnEnter();

    expect(toastMock).toBeCalledWith(mockToastObj)
    expect(setIsUpdatingMock).toBeCalledWith(false)
  })

  it("loadOnEnter() test with task order that has undefined money amounts", async()=>{
    jest.spyOn(PortfolioSummary, 'getAllPortfolioSummaryList').mockReturnValue(
      new Promise(resolve => resolve(dummyPortfolioSummaryList as any))
    );
    await wrapper.vm.loadOnEnter();
  })
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
    const mockAppSections = jest.spyOn(AppSections, "changeActiveSection")
    const mockSelectedTaskOrder = {sys_id: '1234'}
    await wrapper.setData({selectedTaskOrder: mockSelectedTaskOrder})
    await wrapper.vm.startProvisionWorkflow();
    expect(mockSetTOPackageSelection).toHaveBeenCalledWith(false)
    expect(mockSetSelected).toHaveBeenCalledWith(mockSelectedTaskOrder.sys_id)
    expect(mockAppSections).toHaveBeenCalledWith(AppSections.sectionTitles.ProvisionWorkflow)
  })

})
