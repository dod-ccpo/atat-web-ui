import Vue from "vue";
import Vuetify from "vuetify";
import store from "../../../../store";
import { createLocalVue, mount } from "@vue/test-utils";
import SummaryStepper from "@/views/wizard/Step5/components/SummaryStepper.vue";
import Vuex from "vuex";

Vue.use(Vuetify);

describe("Testing SummaryStepper Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SummaryStepper, {
      localVue,
      vuetify,
      store,
      propsData: {
        portfolio: {
          name: "Tracker",
          description: "Test",
          dod_components: [],
          csp: "CSP1",
        },
        applications: [
          {
            name: "App I ",
            description: "",
            environments: [
              {
                name: "Development",
                operators: [],
                id: "3112430111-915467763-1369539781-138968660",
              },
            ],
            operators: [
              {
                display_name: "Burt",
                email: "burt@skirt.mil",
                access: "administrator",
                id: "4025681897-2059713500-2250702592-917887623",
              },
            ],
            id: "4155007259-1015820413-2928105448-1428578903",
          },
        ],
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
