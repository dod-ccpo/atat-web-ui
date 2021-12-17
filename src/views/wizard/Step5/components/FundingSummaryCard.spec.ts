import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import FundingSummaryCard from "@/views/wizard/Step5/components/FundingSummaryCard.vue";

Vue.use(Vuetify);

describe("Testing FundingSummaryCard Component", () => {
  const localVue = createLocalVue();

  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FundingSummaryCard, {
      localVue,
      vuetify,
      propsData: {
        taskOrders: {
          id: "75",
          task_order_number: "1234567891234",
        },
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
