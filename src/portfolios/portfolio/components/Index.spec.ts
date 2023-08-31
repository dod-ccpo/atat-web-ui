import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import Index  from "@/portfolios/portfolio/components/Index.vue";
import PortfolioStore from "@/store/portfolio";
import { Portfolio } from "types/Global";

Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Index, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test loadOnEnter", async () =>{
    const mockPortfolio: Portfolio = {
      sysId: '1234',
      title: 'good portfolio title',
      description: 'good description',
      csp: "4321"
    }
    await PortfolioStore.setCurrentPortfolioFromCard(mockPortfolio);
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.portfolioSysId).toBe(mockPortfolio.sysId)
    expect(wrapper.vm.$data.portfolioCSP).toBe(mockPortfolio.csp)
    expect(wrapper.vm.$data.portfolioDescription).toBe(mockPortfolio.description)
    expect(wrapper.vm.$data.title).toBe(mockPortfolio.title)
  })
})
