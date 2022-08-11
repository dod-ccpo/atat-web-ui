import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import IncrementalFunding from "./IncrementalFunding.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../plugins/validation";

import {
  SelectData,
} from "../../../types/Global";
import FinancialDetails from "@/store/financialDetails";
Vue.use(Vuetify);

describe("Testing ComputeForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  const fundingPlan = {
    "estimated_task_order_value": "100000",
    "initial_amount": "0",
    "remaining_amount": "100000",
    "remaining_amount_increments": ""
  };

  const fundingIncrements = [
    {
      "text": "4th QTR FY22",
      "amt": "0.00",
      "order": 1,
      "sysId": "",
      "qtrOrder": 1,
      "hasPeriodGap": false,
    }
  ];

  const fiscalQuarters = [
    {"text":"4th QTR FY22","multiSelectOrder":1,"disabled":false,"hidden":false},
    {"text":"1st QTR FY23","multiSelectOrder":2,"disabled":false,"hidden":false},
    {"text":"2nd QTR FY23","multiSelectOrder":3,"disabled":false,"hidden":false},
    {"text":"3rd QTR FY23","multiSelectOrder":4,"disabled":false,"hidden":false},
    {"text":"4th QTR FY23","multiSelectOrder":5,"disabled":false,"hidden":false},
    {"text":"1st QTR FY24","multiSelectOrder":6,"disabled":false,"hidden":false},
  ];


  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(IncrementalFunding, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          FinancialDetails: {
            fundingIncrements: fundingIncrements,
          }
        },
      },
      propsData: {
        // computeData: computeData
      }
    });
  });
  
  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

});