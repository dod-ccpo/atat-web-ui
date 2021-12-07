import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import PortfolioSummary from "@/wizard/Step5/components/PortfolioSummary.vue";

Vue.use(Vuetify);

describe("Testing PortfolioSummary Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;
  let store: any;
  let state: any;

  beforeEach(() => {
    vuetify = new Vuetify();

    state = {
      wizard: {
        erroredSteps: [3, 4],
        portfolioSteps: [
          {
            step: 1,
            description: "Create Portfolio",
            touched: false,
            model: {
              name: "",
              description: "",
              dod_components: [],
              csp: "",
            },
          },
          {
            step: 2,
            description: "Add Funding",
            touched: false,
            model: {
              task_order_number: "",
              task_order_file: {
                name: "",
              },
              clins: [],
            },
          },
        ],
      },
    };
    store = new Vuex.Store({ state });

    wrapper = mount(PortfolioSummary, {
      store,
      localVue,
      vuetify,
      propsData: {
        portfolio: {
          name: "Tracker",
          description: "Test",
          dod_components: [],
          csp: "CSP1",
        },
        taskOrders: {
          id: "75",
          task_order_number: "1234567891234",
        },
        applications: {
          name: "Tracker",
          description: "Test",
          environments: [],
        },
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
