import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioCard from "@/portfolios/components/PortfolioCard.vue";
import { PortfolioCardData } from "types/Global";

Vue.use(Vuetify);



describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const cardData: PortfolioCardData =
    {
      title: "ABC123 portfolio",
      status: "Processing",
      csp: "aws",
      branch: "Joint Force",
      lastModified: "Started 23 minutes ago",
      currentPoP: "",
      totalObligated: "",
      fundsSpent: "",
      fundsSpentPercent: "",
    };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioCard, {
      localVue,
      vuetify,
      propsData:({
        cardData,
        index: 0,
        isLastCard: false,
      })      
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("generates ID string", async () => {
    const str = "My String";
    const ID = wrapper.vm.getIdText(str);
    expect(ID).toBe("MyString");
  });

  it("gets status chip background color", async () => {
    const bgColor = wrapper.vm.statusChipBgColor;
    expect(bgColor.length).toBeGreaterThan(0);
  });

  it("gets NO status chip background color", async () => {
    wrapper.vm.$props.cardData.status = undefined;
    const bgColor = wrapper.vm.statusChipBgColor;
    expect(bgColor.length).toEqual(0);
  });


});
