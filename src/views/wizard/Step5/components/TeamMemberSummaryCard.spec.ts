import Vue from "vue";
import Vuetify from "vuetify";
import store from "../../../../store";
import { createLocalVue, mount } from "@vue/test-utils";
import TeamMemberSummaryCard from "@/views/wizard/Step5/components/TeamMemberSummaryCard.vue";
import Vuex from "vuex";

Vue.use(Vuetify);

describe("Testing TeamMemberSummaryCard Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(TeamMemberSummaryCard, {
      localVue,
      vuetify,
      store,
      propsData: {
        applicationData: [
          {
            name: "App I ",
            description: "",
            environments: [
              {
                name: "Development",
                operators: [],
                id: "3119430111-915467763-1369539781-138968660",
              },
              {
                name: "Testing",
                operators: [],
                id: "532538470-778722837-3786856452-1864277705",
              },
              {
                name: "Staging",
                operators: [],
                id: "534743261-3020911031-2250111013-1241840033",
              },
              {
                name: "Production",
                operators: [],
                id: "2751170394-2701461298-2193074251-2484128755",
              },
            ],
            operators: [
              {
                display_name: "Burt",
                email: "burt@skirt.mil",
                access: "administrator",
                id: "4095681897-2059713500-2250702592-917887623",
              },
            ],
            id: "4155009259-1015820413-2928105448-1428578903",
          },
        ],
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
