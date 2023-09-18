import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import FundingTracker from "@/portfolios/portfolio/components/FundingTracker/FundingTracker.vue";


Vue.use(Vuetify);

// let chart: Chart;

// jest.mock('Chart', () => ({
//   Doughnut: () => null,
// }))

describe("Testing FundingTracker Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FundingTracker, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {

    expect(wrapper.exists()).toBe(true);
  });

})
