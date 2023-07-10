import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import ProcurementHistorySummary from "@/steps/03-Background/components/ProcurementHistorySummary.vue";

describe("Testing TaskOrderNumber Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProcurementHistorySummary, {
      localVue,
      vuetify,
    });
  });

  it("tests that component renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

 });
