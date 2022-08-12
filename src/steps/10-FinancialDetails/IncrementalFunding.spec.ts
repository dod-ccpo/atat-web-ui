import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { config, createLocalVue, mount, Wrapper } from "@vue/test-utils";
import IncrementalFunding from "./IncrementalFunding.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../plugins/validation";

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

  // const quarterSelectData = [
  //   {"text":"4th QTR FY22","multiSelectOrder":1,"disabled":false,"hidden":false},
  //   {"text":"1st QTR FY23","multiSelectOrder":2,"disabled":false,"hidden":false},
  //   {"text":"2nd QTR FY23","multiSelectOrder":3,"disabled":false,"hidden":false},
  //   {"text":"3rd QTR FY23","multiSelectOrder":4,"disabled":false,"hidden":false},
  //   {"text":"4th QTR FY23","multiSelectOrder":5,"disabled":false,"hidden":false},
  //   {"text":"1st QTR FY24","multiSelectOrder":6,"disabled":false,"hidden":false}
  // ];

  const fiscalQuarters = [
    {"text": "4th QTR FY22", "multiSelectOrder": 1, "disabled": false, "hidden": false},
    {"text": "1st QTR FY23", "multiSelectOrder": 2, "disabled": false, "hidden": false},
    {"text": "2nd QTR FY23", "multiSelectOrder": 3, "disabled": false, "hidden": false},
    {"text": "3rd QTR FY23", "multiSelectOrder": 4, "disabled": false, "hidden": false},
    {"text": "4th QTR FY23", "multiSelectOrder": 5, "disabled": false, "hidden": false},
    {"text": "1st QTR FY24", "multiSelectOrder": 6, "disabled": false, "hidden": false},
  ];


  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(IncrementalFunding, {
      attachTo: document.body,
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
        "selected quarter", async () => {
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
      "on several factors", async () => {
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
  it("checkIfHasPeriodGap() - returns true if there is a gap ", async () => {
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
    const result = await wrapper.vm.checkIfHasPeriodGap(0);
    expect(result).toBe(true)
  });

  it("checkIfHasPeriodGap() - returns false if there is no gap ", async () => {
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

    const result = await wrapper.vm.checkIfHasPeriodGap(0);
    expect(result).toBe(false)
  });

  it("shouldShowAddIncrementButton() determines if Add Increment button should display " +
      "below funding increments", async () => {
    await wrapper.setData({
      quarterSelectData: fiscalQuarters,
      selectedQuarters: [{"text": "4th QTR FY22", "multiSelectOrder": 1}]
    });
    expect(await wrapper.vm.$data.showAddIncrementButton).toBe(true);

    await wrapper.setData({
      quarterSelectData: [
        {"text": "1st QTR FY24", "multiSelectOrder": 6, "disabled": false, "hidden": false}
      ],
      selectedQuarters: [{"text": "1st QTR FY24", "multiSelectOrder": 6}],
      outOfRangeIndex: 1,
    });
    expect(await wrapper.vm.$data.showAddIncrementButton).toBe(false);
  });

  it("addIncrement() adds a funding increment", async () => {
    await wrapper.setData({
      fundingIncrements: [
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
      ],
      fiscalQuarters: fiscalQuarters,
      selectedQuarters: [
        {"text": "4th QTR FY22", "multiSelectOrder": 1},
        {"text": "1st QTR FY23", "multiSelectOrder": 2}
      ]
    });
    await wrapper.vm.addIncrement();
    expect(await wrapper.vm.$data.fundingIncrements.length).toEqual(3);
    expect(await wrapper.vm.$data.selectedQuarters.length).toBe(3);
  });

  it("insertIncrement() adds a funding increment between increments with a gap " + 
  "between fiscal periods", async () => {
    await wrapper.setData({
      fundingIncrements: [    
        {
          "text": "4th QTR FY22",
          "amt": "0.00",
          "order": 1,
          "sysId": "",
          "qtrOrder": 1,
          "hasPeriodGap": true,
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
      fiscalQuarters: [
        {"text":"4th QTR FY22","multiSelectOrder":1,"disabled":false,"hidden":false},
        {"text":"1st QTR FY23","multiSelectOrder":2,"disabled":false,"hidden":false},
        {"text":"2nd QTR FY23","multiSelectOrder":3,"disabled":false,"hidden":false},    
      ],
      selectedQuarters: [
        {"text":"4th QTR FY22","multiSelectOrder":1},
        {"text":"2nd QTR FY23","multiSelectOrder":3}
      ]
    });
    await wrapper.vm.insertIncrement(0);
    expect(wrapper.vm.$data.fundingIncrements.length).toEqual(3);
    expect(wrapper.vm.$data.selectedQuarters.length).toEqual(3);
    expect(await wrapper.vm.$data.fundingIncrements[1].text).toBe("1st QTR FY23");
    expect(await wrapper.vm.$data.fundingIncrements[1].qtrOrder).toBe(2);

  });

  it("getFiscalQuarters() gets fiscal quarters for funding increment dropdowns", async () => {
    await wrapper.setData({
      fundingIncrements: [],
      fiscalQuarters: [],
      selectedQuarters: [],
    });
    // await wrapper.vm.getFiscalQuarters(0);
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.quarterSelectData.length).toBe(1);
    expect(wrapper.vm.$data.fundingIncrements.length).toBe(1);

    let args = {
      newSelectedValue: {
        multiSelectOrder: 2,
        text: "1st QTR FY23",
      },
      selectedBeforeChange: {
        multiSelectOrder: 1,
        text: "4th QTR FY22",
      }
    }

    await wrapper.vm.quarterChange(args);
    expect(wrapper.vm.$data.fundingIncrements[0].text).toEqual("1st QTR FY23");
    expect(wrapper.vm.$data.fundingIncrements[0].qtrOrder).toEqual(2);

    await wrapper.vm.addIncrement();
    expect(wrapper.vm.$data.quarterSelectData.length).toBe(2);
    expect(wrapper.vm.$data.fundingIncrements.length).toBe(2);

    args = {
      newSelectedValue: {
        multiSelectOrder: 6,
        text: "1st QTR FY24",
      },
      selectedBeforeChange: {
        multiSelectOrder: 3,
        text: "2nd QTR FY23",
      }
    }

    await wrapper.vm.quarterChange(args);
    expect(wrapper.vm.$data.fundingIncrements[1].text).toEqual("1st QTR FY24");
    expect(wrapper.vm.$data.fundingIncrements[1].qtrOrder).toEqual(6);

    args = {
      newSelectedValue: {
        multiSelectOrder: 1,
        text: "4th QTR FY22",
      },
      selectedBeforeChange: {
        multiSelectOrder: 2,
        text: "1st QTR FY23",
      }
    }

    await wrapper.vm.quarterChange(args);
    expect(wrapper.vm.$data.fundingIncrements[0].text).toEqual("4th QTR FY22");
    expect(wrapper.vm.$data.fundingIncrements[0].qtrOrder).toEqual(1);

    // expect(await wrapper.vm.$data.outOfRangeIndex).toBe(0);

  });

  it("focusInput() puts focus into an increment amount text input", async () => {
    wrapper.vm.focusInput(0);
    const textbox = await wrapper.findComponent({ref: "Amount0"});
    expect(textbox.exists()).toBe(true);
  });

  it("deleteFundingIncrement() removes selected funding increment", async() => {
    await wrapper.setData({
      fundingIncrements: [{ "text": "4th QTR FY22", "sysId": "bar"}],
      selectedQuarters: [{"text":"4th QTR FY22","multiSelectOrder":1}],
      quarterSelectData: [[{"text":"4th QTR FY22","multiSelectOrder":1}]],
      savedData: { fundingIncrements: [{"text": "foo", "sysId": "bar"}]},
      removedIncrements: [],
    });
    await wrapper.vm.deleteFundingIncrement(0);
    expect(wrapper.vm.$data.fundingIncrements.length).toBe(0);
    expect(wrapper.vm.$data.selectedQuarters.length).toBe(0);
    expect(wrapper.vm.$data.quarterSelectData.length).toBe(0);
    expect(wrapper.vm.$data.removedIncrements.length).toBe(1);
  });
  
});