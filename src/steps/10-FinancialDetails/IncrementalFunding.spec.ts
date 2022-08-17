import Vue from "vue";
import Vuetify from "vuetify";
import { config, createLocalVue, mount, Wrapper } from "@vue/test-utils";
import IncrementalFunding from "./IncrementalFunding.vue";
import FinancialDetails from "@/store/financialDetails";
import Periods from "@/store/periods";
import { DefaultProps } from "vue/types/options";
import validators from "../../plugins/validation";
import { SelectData } from "../../../types/Global";

Vue.use(Vuetify);

describe("Testing Incremental Funding Plan", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

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
    });

    //resetting store values that are Changed
    //modified during tests
    FinancialDetails.setEstimatedTaskOrderValue("");
    FinancialDetails.setIFPData({
      initialFundingIncrementStr: "",
      fundingIncrements: []
    })
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Method Testing...", () => {

    it("loadOnEnter() - sets store.FinancialDetails.setEstimatedTaskOrderValue to ensure " +
        " store.FinancialDetails.setEstimatedTaskOrderValue === data.costEstimate", 
    async () => {
      const _costEstimate = "1000000";
      // set necessary store data
      FinancialDetails.setEstimatedTaskOrderValue(_costEstimate);
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.costEstimate).toBe(parseInt(_costEstimate));
    });


    it("loadOnEnter() - sets store.FinancialDetails.setIFPData so that the first selectedQuarter " +
      " is present in store.FinancialDetails.setIFPData.fundingIncrements[]",
    async () => {
      //set necessary store data
      FinancialDetails.setIFPData({
        initialFundingIncrementStr: "1.00",
        fundingIncrements: [
          {
            text: "4th QTR FY22",
            amt: "1.01",
            order: 1,
            sysId: "id_01",
            qtrOrder: 1, 
            hasPeriodGap: false,            
          }
        ]
      });
      wrapper.setData({
        fiscalQuarters: fiscalQuarters,
      })

      await wrapper.vm.loadOnEnter();

      //retrieve $store.FinancialDetails.loadIFPData().fundingIncrements[0]
      const _ifpFundingIncText = (await FinancialDetails.loadIFPData()).fundingIncrements[0].text;
      expect(wrapper.vm.selectedQuarters[0].text).toBe(_ifpFundingIncText)
    });

    it("saveOnLeave() sets data.hasValidatedOnContinue===false to ensure that " + 
       "data.validateOnContinue() is called " +
       "and set data.hasValidatedOnContinue===true", async () => {
      wrapper.setData({
        hasValidatedOnContinue: false,
      })
      await wrapper.vm.saveOnLeave();
      expect(wrapper.vm.$data.hasValidatedOnContinue).toBe(true);
    });

    it("saveOnLeave() sets data.hasValidatedOnContinue===true to ensure that " + 
       "data.allowContinue===true", async () => {
      wrapper.setData({
        hasValidatedOnContinue: true,
      })
      await wrapper.vm.saveOnLeave();
      expect(wrapper.vm.$data.allowContinue).toBe(true);
    });

    it("saveOnLeave() sets data.hasValidatedOnContinue===true && fundingIncrements " + 
      "to set data.allowContinue===true && successfully sort fundingIncrements", async () => {
      wrapper.setData({
        hasValidatedOnContinue: true,
        fundingIncrements: fundingIncrements
      })
      await wrapper.vm.saveOnLeave();
      expect(wrapper.vm.$data.allowContinue).toBe(true);
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

    it("hasChanges() - setting different currentData and savedData object" +
        "to set hasChanges to true", async () => {
      wrapper.setData({
        currentData: {
          initialFundingIncrementStr: "$1.00",
          fundingIncrements: [
            {
              text: "text01",
              amt: "1.01",
              order: 1,
              sysId: "id_01",
              qtrOrder: 1, 
              hasPeriodGap: false,            
            }
          ]
        },
        savedData: {
          initialFundingIncrementStr: "$2.00",
          fundingIncrements: [
            {
              text: "text01",
              amt: "1.01",
              order: 1,
              sysId: "id_01",
              qtrOrder: 1, 
              hasPeriodGap: false,            
            }
          ]
        }
      });
      const _hasChanged = wrapper.vm.hasChanged();
      expect(_hasChanged).toBe(true);
    });

    it("hasChanges() - setting same currentData and savedData object" +
        "to set hasChanges to false", async () => {
      wrapper.setData({
        currentData: {
          initialFundingIncrementStr: "1.00",
          fundingIncrements: []
        },
        savedData: {
          initialFundingIncrementStr: "1.00",
          fundingIncrements: []
        }
      });
      const _hasChanged = wrapper.vm.hasChanged();
      expect(_hasChanged).toBe(false);
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


      wrapper.setData({
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
            "text": "2nd QTR FY23",
            "amt": "0.00",
            "order": 3,
            "sysId": "",
            "qtrOrder": 3,
            "hasPeriodGap": false,
          },
          {
            "text": "4th QTR FY23",
            "amt": "0.00",
            "order": 5,
            "sysId": "",
            "qtrOrder": 5,
            "hasPeriodGap": false,
          },
        ],
        fiscalQuarters: fiscalQuarters,
        selectedQuarters: [
          {
            multiSelectOrder: 1,
            text: "4th QTR FY22",
          },
          {
            multiSelectOrder: 2,
            text: "2nd QTR FY23",
          },
          {
            multiSelectOrder: 5,
            text: "4th QTR FY23",

          },
        ]
      })
      const args2 = {
        newSelectedValue: {
          text: "1st QTR FY23",
          multiSelectOrder: 2
        },
        selectedBeforeChange: {
          multiSelectOrder: 5,
          text: "4th QTR FY23",
        }
      }

      wrapper.vm.quarterChange(args2);
      expect(wrapper.vm.$data.fundingIncrements[0].text).toEqual("4th QTR FY22");
      expect(wrapper.vm.$data.fundingIncrements[0].qtrOrder).toEqual(1);
      expect(wrapper.vm.$data.fundingIncrements[0].order).toEqual(1);
      expect(wrapper.vm.$data.fundingIncrements[1].text).toEqual("1st QTR FY23");
      expect(wrapper.vm.$data.fundingIncrements[1].qtrOrder).toEqual(2);
      expect(wrapper.vm.$data.fundingIncrements[1].order).toEqual(2);
    });
  });


  it("validateOnContinue() - sets valid outOfRangeIndex with selectedQuarters " +
      "so that data.allowContinue will set to false", async () => {
    await wrapper.setData({
      hasValidatedOnContinue: false,
      outOfRangeIndex: 1,
      selectedQuarters: [
        { multiSelectOrder: 1, text: "4th QTR FY22"},
        { multiSelectOrder: 2, text: "2nd QTR FY23"},
      ]
    })
    await wrapper.vm.validateOnContinue();
    expect(wrapper.vm.$data.allowContinue).toBe(false);
  });

  it("validateOnContinue() - using default values so that  " +
  "data.allowContinue will set to true", async () => {
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
        {"text": "4th QTR FY22", "multiSelectOrder": 1, "disabled": false, "hidden": false},
        {"text": "1st QTR FY23", "multiSelectOrder": 2, "disabled": false, "hidden": false},
        {"text": "2nd QTR FY23", "multiSelectOrder": 3, "disabled": false, "hidden": false},
      ],
      selectedQuarters: [
        {"text": "4th QTR FY22", "multiSelectOrder": 1},
        {"text": "2nd QTR FY23", "multiSelectOrder": 3}
      ]
    });
    await wrapper.vm.insertIncrement(0);
    expect(wrapper.vm.$data.fundingIncrements.length).toEqual(3);
    expect(wrapper.vm.$data.selectedQuarters.length).toEqual(3);
    expect(await wrapper.vm.$data.fundingIncrements[1].text).toBe("1st QTR FY23");
    expect(await wrapper.vm.$data.fundingIncrements[1].qtrOrder).toBe(2);

  });

  it("getFiscalQuarters() - sets data.fiscalQuarters=[] so that data.fiscalQuarters will be "+
      "automatically populated with the 6 default options", async () => {
    await wrapper.setData({
      fiscalQuarters: [
        {"text": "4th QTR FY22", "multiSelectOrder": 1, "disabled": false, "hidden": false},
      ],
    });
    wrapper.vm.$data.fiscalQuarters = [];
    await wrapper.vm.getFiscalQuarters(0);
    expect(wrapper.vm.$data.fiscalQuarters.length).toBe(6);
  });

  it("getFiscalQuarters() sets data.fundingIncrements=[] so that function returns clone of " +
      "data.fiscalQuarters", async () => {
    await wrapper.setData({
      fundingIncrements: [],
      fiscalQuarters: [
        {"text": "4th QTR FY22", "multiSelectOrder": 1, "disabled": false, "hidden": false},
      ],
    });
    const _getFiscalQuarters = await wrapper.vm.getFiscalQuarters(0);
    expect(_getFiscalQuarters).toEqual(wrapper.vm.$data.quarterSelectData[0]);
  });

  it("getFiscalQuarters() sets appropriate data to ensure returned  " +
      "fiscal quarter dropdown listing is next dropdown listing marked " +
      "disabled===false" , async () => {
    await wrapper.setData({
      fundingIncrements: [
        {"text": "4th QTR FY22"},
        {"text": "1st QTR FY23"},
        {"text": "2nd QTR FY23"},
      ],
      fiscalQuarters: [
        {"text": "4th QTR FY22", "multiSelectOrder": 1, "disabled": false, "hidden": false},
        {"text": "1st QTR FY23", "multiSelectOrder": 2, "disabled": false, "hidden": false},
        {"text": "2nd QTR FY23", "multiSelectOrder": 3, "disabled": false, "hidden": false},
      ],
      maxAllowedIncrements: 4,
    });
    const _getFiscalQuarters = await wrapper.vm.getFiscalQuarters(1);
    expect (_getFiscalQuarters.filter((item:SelectData)=>item.disabled===false)).toHaveLength(1);
  });


  it("calcAmounts() > sets necessary data to ensure data.isFundingMet === false " , 
    async () => {
      await wrapper.setData({
        fundingIncrements: [
          {"amt": "1.00"},
          {"amt": "2.00"},
          {"amt": "3.00"},
        ],
        costEstimate: "20.00",
        initialAmountStr: "10.00"
      });
      await wrapper.vm.calcAmounts("");
      // isFundingMet => 20 > 10 + 1 + 2 + 3
      expect(wrapper.vm.isFundingMet).toBe(false);
    });

  it("calcAmounts() > sets necessary data to ensure data.isFundingMet === true " , 
    async () => {
      await wrapper.setData({
        fundingIncrements: [
          {"amt": "1.00"},
          {"amt": "2.00"},
          {"amt": "3.00"},
        ],
        costEstimate: "12.00",
        initialAmountStr: "10.00"
      });

      await wrapper.vm.calcAmounts("");
      // isFundingMet => 12 > 10 + 1 + 2 + 3
      expect(wrapper.vm.isFundingMet).toBe(true);
    });

  it("focusInput() puts focus into an increment amount text input", async () => {
    jest.useFakeTimers();
    const idx = 0;
    wrapper.vm.focusInput(idx);
    jest.advanceTimersByTime(700);
    const textbox = document.getElementById("Amount" + idx + "_text_field") as HTMLInputElement
    expect(textbox).toBeInTheDocument();
  });

  it("deleteFundingIncrement() removes selected funding increment", async () => {
    await wrapper.setData({
      fundingIncrements: [{"text": "4th QTR FY22", "sysId": "bar"}],
      selectedQuarters: [{"text": "4th QTR FY22", "multiSelectOrder": 1}],
      quarterSelectData: [[{"text": "4th QTR FY22", "multiSelectOrder": 1}]],
      savedData: {fundingIncrements: [{"text": "foo", "sysId": "bar"}]},
      removedIncrements: [],
    });
    await wrapper.vm.deleteFundingIncrement(0);
    expect(wrapper.vm.$data.fundingIncrements.length).toBe(0);
    expect(wrapper.vm.$data.selectedQuarters.length).toBe(0);
    expect(wrapper.vm.$data.quarterSelectData.length).toBe(0);
    expect(wrapper.vm.$data.removedIncrements.length).toBe(1);
  });

});
