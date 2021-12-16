import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import stepTwo from "@/views/wizard/Step2/views/Step2.vue";
import VueRouter from "vue-router";

const localVue = createLocalVue();
Vue.use(Vuetify);
localVue.use(Vuex);
localVue.use(VueRouter);

describe("Testing Step2 Component", () => {
  let vuetify: any;
  let wrapper: any;
  let store: any;

  const router = new VueRouter();
  let hasBeenTouched = false;

  function getWrapperObj() {
    return {
      localVue,
      store,
      vuetify,
      router,
      stubs: [
        "create-task-order-form",
        "atat-text-field",
        "atat-text-area",
        "atat-button-card",
        "atat-file-upload",
      ],
    };
  }

  const actions: any = {
    updateWizardStep: jest.fn(),
    saveStepModel: jest.fn(),
  };

  const getters: any = {
    getStepTouched: () => (stepNumber: number) => {
      return hasBeenTouched;
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
      return [];
    },
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
      getters,
    });
    wrapper = mount(stepTwo, getWrapperObj());
    wrapper.setData({
      taskOrderDetails: {
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
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("contains CreateTaskOrderForm Component", async () => {
    expect(wrapper.vm.$refs.createTaskOrderForm).toBeDefined();
  });

  it("tests route and touched on mount", async () => {
    wrapper.destroy();
    router.push({ name: "editfunding", path: "/editfunding" });
    wrapper = mount(stepTwo, getWrapperObj());
    expect(wrapper.exists()).toBe(true);
    wrapper.destroy();
    hasBeenTouched = true;
    router.push({ name: "badroute", path: "/badroute" });
    wrapper = mount(stepTwo, getWrapperObj());
    expect(wrapper.exists()).toBe(true);
  });

  it("adds a CLIN", async () => {
    await Vue.nextTick();
    await wrapper.vm.addClin();
    const newClinNumber = wrapper.vm.taskOrderDetails.clins[1].clin_number;
    expect(newClinNumber).toBe("0002");
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
