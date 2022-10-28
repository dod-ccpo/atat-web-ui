import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import CostSummary from "@/steps/10-FinancialDetails/IGCE/CostSummary.vue";
Vue.use(Vuetify);

describe("Testing CostSummary Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CostSummary, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("isItemAggregate(item) - sends item to return TRUE", async () => {
    expect(await wrapper.vm.isItemAggregate("5% Surge")).toBe(true);
  });

  it("isItemAggregate(item) - sends item to return FALSE", async () => {
    expect(await wrapper.vm.isItemAggregate("dummy_label")).toBe(false);
  });

})
