import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ReviewTable from "@/wizard/Step5/components/ReviewTable.vue";
import { applicationMembersMock } from "@/store/mocks/portfoliosMockData";

Vue.use(Vuetify);

describe("testing render component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ReviewTable, {
      localVue,
      vuetify,
      propsData: {
        data: applicationMembersMock,
        name: "Global Positioning System",
      },
    });
  });

  it("have the right name", () => {
    expect(wrapper.html()).toContain("Global Positioning System");
  });
  it("have the a member", () => {
    expect(wrapper.html()).toContain("john.smith@mail.mil");
  });
  it("have the second member", () => {
    expect(wrapper.html()).toContain("jane.doe@mail.mil");
  });
});
