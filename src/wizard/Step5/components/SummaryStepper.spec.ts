import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import SummaryStepper from "@/wizard/Step5/components/SummaryStepper.vue";

Vue.use(Vuetify);

describe("Testing SummaryStepper Component", () => {
  const localVue = createLocalVue();

  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SummaryStepper, {
      localVue,
      vuetify,
      propsData: {
        portfolio: {
          name: "Tracker",
          description: "Test",
          dod_components: [],
          csp: "CSP1",
        },
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
