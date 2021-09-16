import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import CreateTaskOrderForm from "@/wizard/Step2/components/CreateTaskOrderForm.vue";

Vue.use(Vuetify);

describe("Testing CreatePortfolioForm Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CreateTaskOrderForm, {
      localVue,
      vuetify,
      stubs: ["atat-text-field", "atat-text-area", "atat-file-upload"],
      propsData: {
        task_order_file: {
          name: "",
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
    expect(validated).toBe(false);
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
});
