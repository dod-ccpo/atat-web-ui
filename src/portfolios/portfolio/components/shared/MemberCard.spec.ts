import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import MemberCard from "@/portfolios/portfolio/components/shared/MemberCard.vue";
import PortfolioData from "@/store/portfolio";
Vue.use(Vuetify);

describe("Testing MemberCard Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(MemberCard, {
      localVue,
      vuetify,
      propsData: {
        index:0
      }
    });
    const _portfolio = {
      csp: "Azure",
      description:"just testfefseffdsfd",
      members: [{
        firstName:"Maria",
        lastName: "Missionowner",
        email:"maria.missionowner@mail.mil",
        role: "Manager",
        phoneNumber:"5555555555",
        title: "optional title"
      }],
      provisioned: "2022-09-08 18:12:12",
      agency: "DISA",
      status: "Active",
      title: "test title",
      updated: "2022-09-08 18:12:12"
    }
    jest.spyOn(PortfolioData, "getPortfolioData").mockImplementation(
      ()=>Promise.resolve( _portfolio ));
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });


})
