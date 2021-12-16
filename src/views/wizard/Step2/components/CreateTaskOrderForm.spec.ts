import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import CreateTaskOrderForm from "@/views/wizard/Step2/components/CreateTaskOrderForm.vue";

Vue.use(Vuetify);

describe("Testing CreateTaskOrderForm", () => {
  const $route = {
    path: "editfunding/:id",
    name: "editfunding",
  };
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;
  let state: any;

  const getters: any = {
    "wizard/getStepModel": () => (stepNumber: number) => {
      return {
        task_order_file: {
          name: "Lesson 5 - Essentials.pdf",
          id: "2b032449-37ba-464b-ae35-e7029e64ca60",
        },
        clins: [
          {
            idiq_clin: "IDIQ CLIN 0003 Unclassified Cloud Support Package",
            clin_number: "0001",
            pop_start_date: "2021-11-17",
            pop_end_date: "2021-12-27",
            total_clin_value: 12345676,
            obligated_funds: 1234567,
          },
        ],
        task_order_number: "12345678901234567",
      };
    },
    "wizard/isReturnToReview": () => (stepNumber: number) => {
      return false;
    },
    "wizard/getStepTouched": () => (stepNumber: number) => {
      return false;
    },
    "wizard/isArrivedFromStep5": () => (stepNumber: number) => {
      return false;
    },
  };
  const store = new Vuex.Store({
    getters,
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CreateTaskOrderForm, {
      localVue,
      vuetify,
      store,
      stubs: ["atat-text-field", "atat-text-area", "atat-file-upload"],
      propsData: {
        task_order_file: {
          name: "Lesson 5 - Essentials.pdf",
          id: "2b032449-37ba-464b-ae35-e7029e64ca60",
        },
        clins: [
          {
            idiq_clin: "IDIQ CLIN 0003 Unclassified Cloud Support Package",
            clin_number: "0001",
            pop_start_date: "2021-11-17",
            pop_end_date: "2021-12-27",
            total_clin_value: 12345676,
            obligated_funds: 1234567,
          },
        ],
        task_order_number: "12345678901234567",
        erroredFields: [
          { id: 0, display: false, message: "Task Order Number" },
          { id: 1, display: false, message: "Upload your approved task order" },
        ],
      },
      mocks: {
        $route,
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("testing task_order_number rules return array 1", async () => {
    await Vue.nextTick();
    const rules = wrapper.vm.rules.task_order_number[0]();
    expect(rules).toBe("Please enter your Task Order Number (Must Be Numbers)");
  });
  it("testing task_order_number rules return array 1", async () => {
    await Vue.nextTick();
    const rules = wrapper.vm.rules.task_order_number[0]("12345678901234");
    expect(rules).toBe(true);
  });
  it("testing task_order_number rules return array 2", async () => {
    await Vue.nextTick();
    const rules = wrapper.vm.rules.task_order_number[1]("hello");
    expect(rules).toBe("Task Order Numbers must be between 13 and 17 digits");
  });
  it("testing task_order_number rules return array 2", async () => {
    await Vue.nextTick();
    const rules = wrapper.vm.rules.task_order_number[1]("12345678901234");
    expect(rules).toBe(true);
  });
  it("test isTaskOrderSigned  with an invalid form ", async () => {
    await wrapper.setData({
      signedTaskOrder: "",
    });
    await wrapper.vm.isTaskOrderSigned(false);
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(true);
  });
  it("test invalid validateForm() ", async () => {
    await wrapper.setData({
      signedTaskOrder: "",
    });
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(false);
  });
  it("test valid validateForm() ", async () => {
    await wrapper.setProps({
      task_order_file: {
        name: "test",
      },
    });
    await wrapper.vm.isTaskOrderSigned(true);
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(true);
  });

  it("test onRemoveFile() ", async () => {
    await wrapper.setProps({
      task_order_file: {
        name: "test",
      },
    });
    await wrapper.vm.onRemoveFile();
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(false);
  });

  it("test did user signedTaskOrder", async () => {
    await wrapper.vm.DidUserSignTaskOrder();
    expect(wrapper.exists()).toBe(true);
  });

  it("test ExpandAddedClin", async () => {
    await wrapper.vm.ExpandAddedClin();
    expect(wrapper.exists()).toBe(true);
  });
});
