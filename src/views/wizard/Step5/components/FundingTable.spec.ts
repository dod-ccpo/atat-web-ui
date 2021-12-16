import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import VueRouter from "vue-router";
import { createLocalVue, mount } from "@vue/test-utils";
import FundingTable from "@/views/wizard/Step5/components/FundingTable.vue";

Vue.use(Vuetify);

describe("Testing FundingTable Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  const actions: any = {
    dispatch: jest.fn(),
  };
  const getters: any = {
    getStepTouched: () => (stepNumber: number) => {
      return false;
    },
  };
  const store = new Vuex.Store({
    actions,
    getters,
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FundingTable, {
      store,
      router,
      localVue,
      vuetify,
      propsData: {
        data: {
          id: "75",
          task_order_number: "1234567891234",
        },
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Edit button click success", async () => {
    const editButton = wrapper.find("button");
    expect(editButton.exists()).toBe(true);
    await editButton.trigger("click");
    await wrapper.vm.onEdit();
  });

  it("formatCurrency success", async () => {
    expect(wrapper.vm.formatCurrency(20000)).toBe("$20,000.00");
  });
});
