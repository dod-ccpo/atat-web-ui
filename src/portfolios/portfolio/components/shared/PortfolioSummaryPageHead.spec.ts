import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioSummaryPageHead from "@/portfolios/portfolio/components/shared/PortfolioSummaryPageHead.vue";
import SlideoutPanel from "@/store/slideoutPanel";
Vue.use(Vuetify);

describe("Testing Members Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioSummaryPageHead, {
      localVue,
      vuetify,
      propsData: {
        title: "portfoliotest",
        portfolioStatus:"Active"
      }
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  test("test openModal()- should change the value of showMemberModal", () => {
    const memberModal = wrapper.vm.showMembersModal
    expect(memberModal).toBe(false)
    wrapper.vm.openModal();
    Vue.nextTick(() => {
      expect(memberModal).toBe(true)
    })
  })

  test("test openSlideoutPanel()- should toggle the value of showDrawer to true",async ()=> {
    jest.spyOn(SlideoutPanel,'openSlideoutPanel').mockImplementation()
    const eObject = {
      currentTarget: 'test', 
      preventDefault: jest.fn(),
      cancelBubble: false,
    }
    const memberModal = wrapper.vm.showDrawer
    expect(memberModal).toBe(false)
    wrapper.vm.openSlideoutPanel(eObject)
    wrapper.vm.$nextTick(()=> expect(memberModal).toBe(true))
  })

  test("test openSlideoutPanel()- should toggle the value of showDrawer to false",async ()=> {
    jest.spyOn(SlideoutPanel,'openSlideoutPanel').mockImplementation()
    wrapper.setData({showDrawer:true})
    const memberModal = wrapper.vm.showDrawer
    expect(memberModal).toBe(true)
    wrapper.vm.openSlideoutPanel()
    wrapper.vm.$nextTick(()=> expect(memberModal).toBe(false))
  })
})
