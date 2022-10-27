import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import GatherPriceEstimates from "@/steps/10-FinancialDetails/IGCE/GatherPriceEstimates.vue";
import SlideoutPanel from "@/store/slideoutPanel";
Vue.use(Vuetify);

describe("Testing GatherPriceEstimates Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(GatherPriceEstimates, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("testing methods", () => {
    it("tests openSlideoutPanel with an event", async () => {
      const isSlideOutOpen = SlideoutPanel.slideoutPanelIsOpen
      const eObject = {
        currentTarget: 'test',
        preventDefault: jest.fn(),
        cancelBubble: false,
      }
      await wrapper.vm.openSlideoutPanel(eObject);
      wrapper.vm.$nextTick(() => expect(isSlideOutOpen).toBe(true))
    });
  })
})
