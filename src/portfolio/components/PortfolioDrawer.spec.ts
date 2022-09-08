import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioDrawer from "@/portfolio/components/PortfolioDrawer.vue";
import PortfolioData from "@/store/portfolio";
Vue.use(Vuetify);

describe("Testing Portfolio Drawer component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioDrawer, {
      localVue,
      vuetify,
    });
    PortfolioData.setPortfolioData({
      createdBy: "test-ctr@ccpo.mil",
      csp: "Azure",
      description:"just testfefseffdsfd",
      members: [],
      provisioned: "2022-09-08 18:12:12",
      serviceAgency:"DISA",
      status: "Active",
      title: "test title",
      updated: "2022-09-08 18:12:12"
    })
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  describe("getTag function with different inputs",()=> {
    it("Test getTag(processing)- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolio.status = "processing"
      const result = wrapper.vm.getTag()
      expect(result.length).toBeGreaterThan(0)
    })
    it("Test getTag(expiring pop)- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolio.status = "expiring pop"
      const result = wrapper.vm.getTag()
      expect(result.length).toBeGreaterThan(0)
    })
    it("Test getTag(expired)- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolio.status = "expired"
      const result = wrapper.vm.getTag()
      expect(result.length).toBeGreaterThan(0)
    })
    it("Test getTag(archived)- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolio.status = "archived"
      const result = wrapper.vm.getTag()
      expect(result.length).toBeGreaterThan(0)
    })
    it("Test getTag()- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolio.status = ""
      const result = wrapper.vm.getTag()
      expect(result.length).toBe(0)
    })
  })
  describe("formatDate()",()=> {
    it("should return the date provided in mmm. dd, yyyy, hhmm ", ()=>{
      const result = wrapper.vm.formatDate("2022-09-08 18:12:12")
      expect(result).toBe("Sep. 8, 2022, 1812")
    })
  })

})

