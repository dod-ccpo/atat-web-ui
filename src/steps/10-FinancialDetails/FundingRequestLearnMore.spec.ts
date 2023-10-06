import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import FundingRequestLearnMore from "@/steps/10-FinancialDetails/FundingRequestLearnMore.vue";
import validators from "@/plugins/validation";
import sanitize from "@/plugins/sanitize";
Vue.use(Vuetify);

describe("Testing FundingRequestLearnMore Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(sanitize)
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(FundingRequestLearnMore, {
      localVue,
      vuetify,
      data() { return {
        gInvoiceHref: "http://example1.com/?<script>alert(document.domain);</script>",
        federalAcqHref: "http://example2.com/?<script>alert(document.domain);</script>"
      }}
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renders correct link for gInvoice ", 
    async () => {
      const gInvoiceLinkElement = wrapper.find("#GINLink");
      expect(gInvoiceLinkElement.attributes('href')).toBe("http://example1.com/?");
    });

  it("renders correct link for federalAcq ", 
    async () => {
      const farLinkElement = wrapper.find("#FARLink");
      expect(farLinkElement.attributes('href')).toBe("http://example2.com/?");
    });
})
