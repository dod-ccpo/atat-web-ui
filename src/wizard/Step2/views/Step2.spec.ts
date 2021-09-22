import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import stepTwo from "@/wizard/Step2/views/Step2.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";
import { TaskOrderDetails } from "../../../../types/Wizard";

Vue.use(Vuetify);

describe("Testing Step2 Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueAxios, axios);
  localVue.use(VueRouter);
  const routes = [
    {
      name: "editfunding",
      path: "/",
    },
  ];
  let vuetify: any;
  let wrapper: any;
  let store: any;
  let taskOrderDetails: TaskOrderDetails;

  const actions: any = {
    updateWizardStep: jest.fn(),
    saveStepModel: jest.fn(),
  };

  const getters: any = {
    getStepTouched: () => (stepNumber: number) => {
      return false;
    },
    getStepModel: () => (stepNumber: number) => {
      return {
        name: "",
        description: "",
        dod_components: [],
        csp: "",
      };
    },
    getTaskOrderByName: () => (id: string) => {
      return [
        {
          task_order_number: "TaskOrder_0001",
          clins: [
            {
              clin_number: "0001",
              idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
              total_clin_value: 200000,
              obligated_funds: 10000,
              pop_start_date: "2021-09-01",
              pop_end_date: "2022-09-01",
            },
          ],
        },
      ];
    },
  };
  const router = new VueRouter({ routes });

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
      getters,
    });
    wrapper = mount(stepTwo, {
      store,
      localVue,
      vuetify,
      router,
      stubs: [
        "create-task-order-form",
        "atat-text-field",
        "atat-text-area",
        "atat-button-card",
        "atat-file-upload",
      ],
    });
    wrapper.setData({
      taskOrderDetails: {
        task_order_number: "",
        task_order_file: {
          description: "",
          id: "",
          created_at: "",
          updated_at: "",
          size: 0,
          name: "",
          status: "",
        },
        clins: [
          {
            clin_number: "0001",
            idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
            total_clin_value: 200000,
            obligated_funds: 10000,
            pop_start_date: "2021-09-01",
            pop_end_date: "2022-09-01",
          },
        ],
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("contains CreateTaskOrderForm Component", () => {
    expect(wrapper.vm.$refs.createTaskOrderForm).toBeDefined();
  });

  it("adds a CLIN", async () => {
    await Vue.nextTick();
    await wrapper.vm.addClin();
    const newClinNumber = wrapper.vm.taskOrderDetails.clins[1].clin_number
    expect(newClinNumber).toBe('0002');
  });

  it("deletes a CLIN", async () => {
    await Vue.nextTick();
    await wrapper.vm.deleteClin(1);
    let clinCount = wrapper.vm.taskOrderDetails.clins.length;
    expect(clinCount).toBe(0);
    // test for "else"
    await wrapper.vm.deleteClin(-1);
    clinCount = wrapper.vm.taskOrderDetails.clins.length;
    expect(clinCount).toBe(0);
  });

  it("test validate() ", async () => {
    const validated = await wrapper.vm.validate();
    expect(validated).toBe(false);
  });
});
