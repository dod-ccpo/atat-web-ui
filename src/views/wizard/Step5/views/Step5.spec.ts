import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import Step_5 from "@/views/wizard/Step5/views/Step5.vue";

Vue.use(Vuetify);

describe("Testing PostReview Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Step_5, {
      localVue,
      vuetify,
      stubs: ["portfolio-summary"],
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
