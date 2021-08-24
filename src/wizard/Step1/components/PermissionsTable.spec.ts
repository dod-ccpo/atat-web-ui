import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import PermissionsTable from "@/wizard/Step1/components/PermissionsTable.vue";
import { applicationMembersMock } from "@/store/mocks/portfoliosMockData";

Vue.use(Vuetify);

describe("testing render component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PermissionsTable, {
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
});
