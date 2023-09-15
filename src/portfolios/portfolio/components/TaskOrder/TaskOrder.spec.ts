/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import TaskOrder from "@/portfolios/portfolio/components/TaskOrder/TaskOrder.vue";
import PortfolioSummary from "@/store/portfolioSummary";
import { PortfolioSummaryDTO } from "@/api/models";
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

  let total_task_order_value:(number | undefined) = 0;
  let total_lifecycle_amount:(number | undefined) = 0;
  let funds_spent_task_order:(number | undefined) = 0;
  const dummyPortfolioSummaryList: (PortfolioSummaryDTO[]) = [
    {
      name: "",
      csp: "01a",
      active_task_order: "01a",
      csp_display: "",
      agency: "",
      vendor: "",
      dod_component: "", // EJY - DOUBLE-CHECK
      task_order_number: "",
      sys_updated_on: "",
      task_order_status: "",
      pop_end_date: "",
      pop_start_date: "",
      funds_obligated: 0,
      portfolio_status: "",
      portfolio_funding_status: "",
      portfolio_managers: "",
      funds_spent: 0,
      task_orders: [
        {
          "clins": "01,02,03",
          "sys_id": "sys01",
          "portfolio": "port01",
          "task_order_number": "1234",
          "pop_end_date": "2023-09-30",
          "pop_start_date": "2022-10-01",
          "task_order_status": "ACTIVE",
          "clin_records": [],
          "funds_obligated": "825000",
          "total_task_order_value": total_task_order_value,
          "total_lifecycle_amount": total_lifecycle_amount,
          "funds_spent_task_order": funds_spent_task_order,
          "incrementally_funded": "",
          "acquisition_package": "", 
          "funding_plan": "",
          "funds_total": ""
        }
      ],
      portfolio_viewers: "",
      alerts: [],
      last_cost_data_sync: ""
    }
  ];

  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  // PortfolioData.setActiveTaskOrderNumber("1234"); // EJY - DOUBLE-CHECK IF NEEDED
 

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(TaskOrder, {
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

  it("loadOnEnter() test with task order that has valid money amounts", async()=>{
    total_task_order_value = 120000;
    total_lifecycle_amount = 240000;
    funds_spent_task_order = 60000;
    jest.spyOn(PortfolioSummary, 'getAllPortfolioSummaryList').mockReturnValue(
      new Promise(resolve => resolve(dummyPortfolioSummaryList))
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
    total_task_order_value = undefined;
    total_lifecycle_amount = undefined;
    funds_spent_task_order = undefined;
    jest.spyOn(PortfolioSummary, 'getAllPortfolioSummaryList').mockReturnValue(
      new Promise(resolve => resolve(dummyPortfolioSummaryList))
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
