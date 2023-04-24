import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import CSPCard from "@/portfolios/portfolio/components/shared/CSPCard.vue";
import SlideoutPanel from "@/store/slideoutPanel";
Vue.use(Vuetify);

describe("Testing CSPCard Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CSPCard, {
      localVue,
      vuetify,
      propsData:{
        cloudServiceProvider: "Azure"
      }
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  test("test openSlideoutPanel() with an event",async ()=> {
    const isSlideOutOpen = SlideoutPanel.slideoutPanelIsOpen
    const eObject = {
      currentTarget: 'test',
      preventDefault: jest.fn(),
      cancelBubble: false,
    }
    wrapper.vm.openSlideoutPanel(eObject)
    wrapper.vm.$nextTick(()=> expect(isSlideOutOpen).toBe(true))
  })
  test("test openSlideoutPanel() without an event",async ()=> {
    const isSlideOutOpen = SlideoutPanel.slideoutPanelIsOpen
    wrapper.vm.openSlideoutPanel()
    wrapper.vm.$nextTick(()=> expect(isSlideOutOpen).toBe(true))
  })

})
