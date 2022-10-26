import Vue from "vue";
import Vuetify from "vuetify";
import { config, createLocalVue, mount, Wrapper } from "@vue/test-utils";
import IncrementalFunding from "./IncrementalFunding.vue";
import FinancialDetails from "@/store/financialDetails";
import Periods  from "../../store/periods";
import PeriodOfPerformance from "../../store/periods"
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
      propsData:{
        fundingIncrements:  []
      }
    });
  });

  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Method Testing...", () => {

    it("loadOnEnter() - mocks store.FinancialDetails.getEstimatedTaskOrderValue to ensure " +
         " $data.costEstimate === store.FinancialDetails.getEstimatedTaskOrderValue", 
    async () => {
      jest.spyOn(FinancialDetails, 'getEstimatedTaskOrderValue').mockImplementation(
        ()=>Promise.resolve(
          "20"
        ));
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.costEstimate).toBe(20);
    });

    it("loadOnEnter() - mocks store.FinancialDetails.setIFPData so that the  " +
      " first selectedQuarter is present in store.FinancialDetails.setIFPData.fundingIncrements[]",
    async () => {
    //retrieve necessary store data
      jest.spyOn(FinancialDetails, 'setIFPData').mockImplementation(
        ()=>Promise.resolve({
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
        }));
      wrapper.setData({
        fiscalQuarters: fiscalQuarters,
      })
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.selectedQuarters[0].text).toBe("1st QTR FY23")
    });


    it("loadOnEnter() - mocks store.PeriodOfPerformance data to ensure a start data is " +
      "loads as expected",
    async () => {
      // set necessary store data
      jest.spyOn(PeriodOfPerformance, 'loadPeriodOfPerformance').mockImplementation(
        ()=>Promise.resolve(
          {
            "requested_pop_start_date": "2022-11-25",
          },
        ));
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.startDate).toEqual(new Date("11/25/2022 00:00:00.000"));
    });


    it("loadOnEnter() - mock periods data so that data.maxAllowedIncrements for YEAR will be 5",
      async () => {
        // set necessary store data
        jest.spyOn(Periods, 'loadPeriods').mockImplementation(
          ()=>Promise.resolve(
            [
              {
                "period_unit": "YEAR",
                "period_unit_count": "1",
                "period_type": "BASE",
                "option_order": "1"
              },
            ]
          ));
        await wrapper.vm.loadOnEnter();
        expect(wrapper.vm.$data.maxAllowedIncrements).toBe(5);
      });

    it("loadOnEnter() - mock periods data so that data.maxAllowedIncrements for DAYS will be 5",
      async () => {
        // set necessary store data
        jest.spyOn(Periods, 'loadPeriods').mockImplementation(
          ()=>Promise.resolve(
            [
              {
                "period_unit": "DAY",
                "period_unit_count": "365",
                "period_type": "BASE",
                "option_order": "1"
              },
            ]
          ));
        await wrapper.vm.loadOnEnter();
        expect(wrapper.vm.$data.maxAllowedIncrements).toBe(5);
      });

    it("loadOnEnter() - mock periods data so that data.maxAllowedIncrements for WEEKS will be 4",
      async () => {
        // set necessary store data
        jest.spyOn(Periods, 'loadPeriods').mockImplementation(
          ()=>Promise.resolve(
            [
              {
                "period_unit": "WEEK",
                "period_unit_count": "35",
                "period_type": "BASE",
                "option_order": "1"
              },
            ]
          ));
        await wrapper.vm.loadOnEnter();
        expect(wrapper.vm.$data.maxAllowedIncrements).toBe(4);
      });

    it("loadOnEnter() - mock periods data so that data.maxAllowedIncrements for MONTHS will be 4",
      async () => {
        // set necessary store data
        jest.spyOn(Periods, 'loadPeriods').mockImplementation(
          ()=>Promise.resolve(
            [
              {
                "period_unit": "MONTH",
                "period_unit_count": "8",
                "period_type": "BASE",
                "option_order": "1"
              },
            ]
          ));
        await wrapper.vm.loadOnEnter();
        expect(wrapper.vm.$data.maxAllowedIncrements).toBe(4);
      });

    it("loadOnEnter() - mock periods data so that data.maxAllowedIncrements will display "+
        " default value",
    async () => {
      // set necessary store data
      jest.spyOn(Periods, 'loadPeriods').mockImplementation(
        ()=>Promise.resolve(
          [
            {
              "period_unit": "YEARZZZ",
              "period_unit_count": "8",
              "period_type": "BASE",
              "option_order": "1"
            },
          ]
        ));
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.maxAllowedIncrements).toBe(1);
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
        fundingIncrements:  [
          {
            "text": "1st QTR FY23",
            "amt": "0.00",
            "order": 2,
            "sysId": "",
            "qtrOrder": 1,
            "hasPeriodGap": false,
          },
          {
            "text": "4th QTR FY22",
            "amt": "0.00",
            "order": 1,
            "sysId": "",
            "qtrOrder": 2,
            "hasPeriodGap": false,
          },
        ]
      })
      jest.spyOn(FinancialDetails, "saveIFPData").mockImplementation();
      await wrapper.vm.saveOnLeave();
      expect(wrapper.vm.$data.allowContinue).toBe(true);
      // test successful sorting
      expect(wrapper.vm.$data.fundingIncrements[0].text).toBe("4th QTR FY22");
      expect(wrapper.vm.$data.fundingIncrements[1].text).toBe("1st QTR FY23");
     
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

    it("currentQuarter() - supplies startDate that is to be in 1st quarter ", async () => {
      wrapper.setData({
        startDate: new Date("12/22/2022")
      })
      const _currentQuarter = wrapper.vm.currentQuarter();
      expect(_currentQuarter).toBe(1);
    });

    it("quarterChange() - supplies correct args/data to successfully change  " +
        " data.fundingIncrements[]", async () => {
      wrapper.setData({
        fundingIncrements: fundingIncrements,
        fiscalQuarters: fiscalQuarters,
        selectedQuarters: selectedQuarters
      })
      const _fundingIncs = wrapper.vm.$data.fundingIncrements;
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
      expect(_fundingIncs[0].text).toEqual("1st QTR FY23");
      expect(_fundingIncs[1].text).toEqual("3rd QTR FY23");
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
    await wrapper.setData({
      hasValidatedOnContinue: true
    })
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

  it("shouldShowAddIncrementButton() sets necessary data to display `Add Increment Button` " +
      "below funding increments", async () => {
    await wrapper.setData({
      quarterSelectData: fiscalQuarters,
      selectedQuarters: [{"text": "4th QTR FY22", "multiSelectOrder": 1}]
    });
    expect(await wrapper.vm.$data.showAddIncrementButton).toBe(true);
  });

  it("shouldShowAddIncrementButton() sets necessary data to prevent `Add Increment Button` " +
      "from displaying below funding increments", async () => {
    await wrapper.setData({
      quarterSelectData: [
        {"text": "1st QTR FY24", "multiSelectOrder": 6, "disabled": false, "hidden": false}
      ],
      selectedQuarters: [{"text": "1st QTR FY24", "multiSelectOrder": 6}],
      outOfRangeIndex: 1,
    });
    expect(await wrapper.vm.$data.showAddIncrementButton).toBe(true);
  });



  it("addIncrement() adds necessary data to successfully add a new data.fundingIncrement ",
    async () => {
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

  it("insertIncrement()  adds necessary data to successfully insert funding increments " +
      "between fiscal periods with a gap ", async () => {
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
      "automatically populated with 6 default options", async () => {
    await wrapper.setData({
      fiscalQuarters: [
        {"text": "4th QTR FY22", "multiSelectOrder": 1, "disabled": false, "hidden": false},
      ],
    });
    wrapper.vm.$data.fiscalQuarters = [];
    await wrapper.vm.getFiscalQuarters(0);
    expect(wrapper.vm.$data.fiscalQuarters.length).toBe(6);
  });

  it("getFiscalQuarters() sets data.fundingIncrements=[] so that function returns " +
      "data.fiscalQuarters[] clone", async () => {
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
      "disabled===false", async () => {
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
    expect(_getFiscalQuarters.filter(
      (item: SelectData) => item.disabled === false)
    ).toHaveLength(1);
  });


  it("calcAmounts() - sets necessary data to ensure data.isFundingMet === false ",
    async () => {
      await wrapper.setData({
        fundingIncrements: [
          { "amt": "1.00" },
          { "amt": "2.00" },
          { "amt": "3.00" },
        ],
        costEstimate: "20.00",
        initialAmountStr: "10.00"
      });
      await wrapper.vm.calcAmounts("");
      // isFundingMet => 20 > 10 + 1 + 2 + 3
      expect(wrapper.vm.isFundingMet).toBe(false);
    });

  it("calcAmounts() - sets necessary data to ensure data.isFundingMet === true ",
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

  it("deleteFundingIncrement() adds necessary data to remove selected funding increment", 
    async () => {
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
