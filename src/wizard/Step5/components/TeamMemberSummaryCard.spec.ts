import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import TeamMemberSummaryCard from "@/wizard/Step5/components/TeamMemberSummaryCard.vue";

Vue.use(Vuetify);

describe("Testing TeamMemberSummaryCard Component", () => {
  const localVue = createLocalVue();

  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(TeamMemberSummaryCard, {
      localVue,
      vuetify,
      propsData: {
        applicationData: {
          name: "Tracker",
          description: "Test",
          dod_components: [],
          csp: "CSP1",
        },
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
