import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioSummaryPageHead from "@/portfolio/components/PortfolioSummaryPageHead.vue";
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

})
