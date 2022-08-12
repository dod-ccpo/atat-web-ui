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

describe("Testing Incremental Funding Plan", () => {
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
    },
    {
      "text": "1st QTR FY23",
      "amt": "0.00",
      "order": 2,
      "sysId": "",
      "qtrOrder": 2,
      "hasPeriodGap": false,
    },
  ];

  const selectedQuarters = [
    {
      multiSelectOrder: 1,
      text: "4th QTR FY22",
    },
    {
      multiSelectOrder: 2,
      text: "1st QTR FY23",
    },
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
      // mocks: {
      //   $store: {
      //     FinancialDetails: {
      //       fundingIncrements: fundingIncrements,
      //     }
      //   },
      // },
      // propsData: {
      //   fundingIncrements: fundingIncrements
      // }
    });
  });
  
  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Method Testing...", () => {

    it("loadOnEnter() initializes data including funding increments", async () => {
      wrapper.vm.loadOnEnter()
    });

    it("initializeIncrements() initializes funding increments (fiscal quarters) " +
    "for dropdowns", async () => {
      wrapper.setData({
        fiscalQuarters: [],
        ordinals: ["1st", "2nd", "3rd", "4th"],
      })
      wrapper.vm.initializeIncrements();

      expect(wrapper.vm.$data.fiscalQuarters.length).toBe(6);
    });
  

    it("quarterChange() - change dropdown value for funding increment's " +
    "selected quarter", async() => {
      wrapper.setData({
        fundingIncrements: fundingIncrements,
        fiscalQuarters: fiscalQuarters,
        selectedQuarters: selectedQuarters
      })
      const args = {
        newSelectedValue: {
          multiSelectOrder: 4,
          text: "3rd QTR FY23",
        },
        selectedBeforeChange: {
          multiSelectOrder: 1,
          text: "4th QTR FY22",
        }
      }
      
      wrapper.vm.quarterChange(args);
      expect(wrapper.vm.$data.fundingIncrements[0].text).toEqual("1st QTR FY23");
      expect(wrapper.vm.$data.fundingIncrements[0].qtrOrder).toEqual(2);
      expect(wrapper.vm.$data.fundingIncrements[0].order).toEqual(1);
      expect(wrapper.vm.$data.fundingIncrements[1].text).toEqual("3rd QTR FY23");
      expect(wrapper.vm.$data.fundingIncrements[1].qtrOrder).toEqual(4);
      expect(wrapper.vm.$data.fundingIncrements[1].order).toEqual(2);
    });
  });

  it("validateOnContinue() - determine if form should validate on Continue based " + 
  "on several factors", async() => {
    await wrapper.setData({
      initialAmountStr: "",
      allowContinue: false,
      hasValidatedOnContinue: false,
      outOfRangeIndex: null,
      costEstimate: 1000,
      fundingIncrements: fundingIncrements
    })

    // if underfunded, do not allow to continue
    await wrapper.vm.validateOnContinue();
    expect(wrapper.vm.$data.allowContinue).toBe(false);

    // if overfunded, do not allow to continue
    wrapper.setData({
      fundingIncrements: [
        {
          "text": "4th QTR FY22",
          "amt": "2,000.00",
          "order": 1,
          "sysId": "",
          "qtrOrder": 1,
          "hasPeriodGap": false,
        }
      ],
    });
    await wrapper.vm.validateOnContinue();
    expect(wrapper.vm.$data.allowContinue).toBe(false);
    
    // if last funding increment period is out of PoP range
    await wrapper.setData({
      outOfRangeIndex: 1,
    });
    await wrapper.vm.validateOnContinue();
    expect(wrapper.vm.$data.allowContinue).toBe(false);

    await wrapper.setData({
      outOfRangeIndex: null,
      fundingIncrements: [
        {
          "text": "4th QTR FY22",
          "amt": "1,000.00",
          "order": 1,
          "sysId": "",
          "qtrOrder": 1,
          "hasPeriodGap": false,
        }
      ],
    });
    await wrapper.vm.validateOnContinue();
    expect(wrapper.vm.$data.allowContinue).toBe(true);

  });
  it("checkIfHasPeriodGap() - returns true or false if there is a gap ", async() => {
    await wrapper.setData({
      fundingIncrements: [
        {
          "text": "4th QTR FY22",
          "amt": "1,000.00",
          "order": 1,
          "sysId": "",
          "qtrOrder": 1,
          "hasPeriodGap": false,
        },
        {
          "text": "2nd QTR FY23",
          "amt": "0.00",
          "order": 2,
          "sysId": "",
          "qtrOrder": 3,
          "hasPeriodGap": false,
        },
      ],
    });
    const trueTest = await wrapper.vm.checkIfHasPeriodGap(0);
    expect(trueTest).toBe(true)

    await wrapper.setData({
      fundingIncrements: [
        {
          "text": "4th QTR FY22",
          "amt": "1,000.00",
          "order": 1,
          "sysId": "",
          "qtrOrder": 1,
          "hasPeriodGap": false,
        },
        {
          "text": "1st QTR FY23",
          "amt": "0.00",
          "order": 2,
          "sysId": "",
          "qtrOrder": 2,
          "hasPeriodGap": false,
        },
      ],
    });

    const falseTest = await wrapper.vm.checkIfHasPeriodGap(0);
    expect(falseTest).toBe(false)
  });
});
