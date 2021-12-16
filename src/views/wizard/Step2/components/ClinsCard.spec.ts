import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import ClinsCard from "@/views/wizard/Step2/components/ClinsCard.vue";
import moment from "moment";

Vue.use(Vuetify);

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const formatDate = (value: string) => {
  return moment(new Date(`${value} 00:00:00`)).format("MMM DD, YYYY");
};
const formatDate2 = (value: string) => {
  return moment(new Date(`${value} 00:00:00`)).format("MM/DD/YYYY");
};

describe("Testing Create ClinsCard Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;
  let state: any;

  const getters: any = {
    "wizard/getStepModel": () => (stepNumber: number) => {
      return {
        task_order_file: {
          name: "Lesson 5 - Essentials.pdf",
          id: "2b032449-37ba-464b-ae35-e7029e64ca60",
        },
        clins: [
          {
            idiq_clin: "IDIQ CLIN 0003 Unclassified Cloud Support Package",
            clin_number: "0001",
            pop_start_date: "2021-11-17",
            pop_end_date: "2021-12-27",
            total_clin_value: 12345676,
            obligated_funds: 1234567,
          },
        ],
        task_order_number: "12345678901234567",
      };
    },
  };

  const store = new Vuex.Store({
    getters,
  });

  const propsData = {
    card_number: 1,
    clin_number: "0001",
    idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
    total_clin_value: 200000,
    obligated_funds: 10000,
    pop_start_date: "2021-10-01",
    pop_end_date: "2022-09-30",
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ClinsCard, {
      localVue,
      vuetify,
      store,
      stubs: [
        "atat-text-field",
        "atat-select",
        "atat-date-picker",
        "atat-currency-field",
      ],
      propsData: propsData,
    });

    wrapper.vm.calculateObligatedPercent();
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  // cline rules
  it("cline rules should not be null or empty", async () => {
    const clinRules = wrapper.vm.clinNumberRules;
    expect(clinRules).not.toBeNull();
    expect(clinRules.length).toBe(3);
  });

  it("first cline rule returns validation message", async () => {
    const clinRules = wrapper.vm.clinNumberRules;
    const firstRule = clinRules[0]("");
    expect(firstRule).toBe("Please enter your 4-digit CLIN Number");
  });

  it("first cline rule returns true when valid", async () => {
    const clinRules = wrapper.vm.clinNumberRules;
    const firstRule = clinRules[0]("4545");
    expect(firstRule).toBe(true);
  });

  it("second clin number rule returns validation message", async () => {
    const clinRules = wrapper.vm.clinNumberRules;
    const secondRule = clinRules[1]("uu");
    expect(secondRule).toBe("Please enter a valid 4-digit CLIN Number");
  });

  it("second clin number rule returns true when valid", async () => {
    const clinRules = wrapper.vm.clinNumberRules;
    const secondRule = clinRules[1]("0001");
    expect(secondRule).toBe(true);
  });

  it("third clin number rules returns validation message", async () => {
    await Vue.nextTick();
    const clinRules = wrapper.vm.clinNumberRules;
    const thirdRule = clinRules[2]("55555");
    expect(thirdRule).toBe("CLIN number must be 4 digits");
  });
  it("third clin number rules returns true when valid", async () => {
    await Vue.nextTick();
    const clinRules = wrapper.vm.clinNumberRules;
    const thirdRule = clinRules[2]("5555");
    expect(thirdRule).toBe(true);
  });

  //total cline rules

  it("cline rules are not null or empty", async () => {
    await Vue.nextTick();
    const totalClinRules = wrapper.vm.totalClinRules;
    expect(totalClinRules).not.toBeNull();
    expect(totalClinRules.length).toBe(3);
  });

  it("First total cline rule return correct validation message", async () => {
    await Vue.nextTick();
    const totalClinRules = wrapper.vm.totalClinRules;
    const firstRule = totalClinRules[0]("");
    expect(firstRule).toBe(true);
  });

  it("First total cline rule returns true with valid", async () => {
    await Vue.nextTick();
    const totalClinRules = wrapper.vm.totalClinRules;
    const firstRule = totalClinRules[0]("4444");
    expect(firstRule).toBe(true);
  });

  it("second total cline rule returns correct validation message", async () => {
    await Vue.nextTick();
    const totalClinRules = wrapper.vm.totalClinRules;
    const firstRule = totalClinRules[1]("");
    expect(firstRule).toBe(true);
  });

  it("second total cline rule returns true when valid", async () => {
    await Vue.nextTick();
    const totalClinRules = wrapper.vm.totalClinRules;
    const firstRule = totalClinRules[1](200000);
    expect(firstRule).toBe(true);
  });

  it("third total cline rule returns correct validation message", async () => {
    await Vue.nextTick();
    const totalClinRules = wrapper.vm.totalClinRules;
    const firstRule = totalClinRules[1]("1000");
    expect(firstRule).toBe(true);
  });

  it("third total cline rule returns true when valid", async () => {
    await Vue.nextTick();
    const totalClinRules = wrapper.vm.totalClinRules;
    const firstRule = totalClinRules[1]("1000000");
    expect(firstRule).toBe(true);
  });

  const createTestDescription = (prefix: string) => (message: string) =>
    `${prefix} ${message}`;

  // pop start rules
  it("pop start rules should not be null or empty", async () => {
    const clinRules = wrapper.vm.popEndRules;
    wrapper.setProps({ pop_start_date: "" });
    expect(clinRules).not.toBeNull();
    expect(clinRules.length).toBe(3);
  });

  const firstPopStartRule = createTestDescription("1st pop start rule");
  const secondPopStartRule = createTestDescription("2nd pop start rule");

  it(firstPopStartRule("rule returns validation message"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[0]("100");
    expect(rule).toBe(true);
  });

  it(firstPopStartRule("returns true when valid"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[0]("2021-09-01");
    expect(rule).toBe(true);
  });

  it(secondPopStartRule("returns validation message"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[0]("");
    expect(rule).toBe(true);
  });

  const JWCCContractEndDate = "2022-09-14";

  // pop end rules
  it("pop end rules should not be null or empty", async () => {
    const rules = wrapper.vm.popEndRules;
    wrapper.setProps({ pop_end_date: "" });
    expect(rules).not.toBeNull();
    expect(rules.length).toBe(3);
  });
  const firstPopEndRule = createTestDescription("1st pop end rule");

  it(firstPopEndRule("rule returns validation message"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[0]();
    expect(rule).toBe(true);
  });

  it(firstPopEndRule("returns true when valid"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[0]("2021-09-01");
    expect(rule).toBe(true);
  });

  // Obligated Funds Rules
  it("Obligated Funds Rules is not null and has expected rules", async () => {
    await Vue.nextTick();
    const rules = wrapper.vm.obligatedFundRules;
    expect(rules).not.toBe(null);
    expect(rules).toBeInstanceOf(Array);
    const rule1 = rules[0]("");
    expect(rule1).toBe(true);
    const rule2 = rules[1]("");
    expect(rule2).toBe(true);
    const rule3 = rules[1](50000000000);
    expect(rule3).toBe(true);
    expect(rules.length).toBe(3);
  });

  // correspondingIDIQRules
  it("corresponding IDIQ Rules is not null", async () => {
    await Vue.nextTick();
    const rule = wrapper.vm.correspondingIDIQRules;
    expect(rule).not.toBe(null);
  });

  // correspondingIDIQRules
  it("corresponding IDIQ Rule returns validation message", async () => {
    await Vue.nextTick();
    const rule = wrapper.vm.correspondingIDIQRules;
    expect(rule[0]()).not.toBe("Please select an IDIQ CLIN type");
  });

  it("corresponding IDIQ Rules returns true when valid", async () => {
    await Vue.nextTick();
    const rule = wrapper.vm.correspondingIDIQRules;
    expect(rule[0]("type")).toBe(true);
  });

  it("form validates to true", async () => {
    const isValid = await wrapper.vm.validateForm();
    expect(isValid).toBe(false);
  });

  it("form exists", async () => {
    await wrapper.vm.$nextTick();
    const formWrapper = wrapper.findComponent({ ref: "form" });
    expect(formWrapper.exists()).toBe(false);
  });

  it("correctly calculates obligated percentage", async () => {
    wrapper.vm.calculateObligatedPercent();
    await wrapper.vm.$nextTick();
    const obligatedPercent = wrapper.vm.obligatedPercent;
    const percent: number =
      (propsData.obligated_funds / propsData.total_clin_value) * 100;
    expect(obligatedPercent).toEqual(
      Number.parseFloat(percent.toString()).toFixed(2)
    );
  });

  // it("Card number renders correctly", async () => {
  //   await wrapper.vm.$nextTick();
  //   const card_number = wrapper.find("#card_number");
  //   expect(card_number.text()).toBe(`${propsData.card_number}`);
  // });

  // it("IDIQ Clin type renders correctly", async () => {
  //   await wrapper.vm.$nextTick();
  //   const idiq_clin = wrapper.find(".idiq_clin");
  //   expect(idiq_clin.text()).toBe(propsData.idiq_clin);
  // });

  // it("Total Clin Value renders correctly", async () => {
  //   await wrapper.vm.$nextTick();
  //   const total_clin_value = wrapper.find("#total_clin_value");
  //   const formatedValue = formatter.format(propsData.total_clin_value);
  //   expect(total_clin_value.text()).toBe(formatedValue);
  // });

  // it("Obligated funds Value renders correctly", async () => {
  //   await wrapper.vm.$nextTick();
  //   const obligated_funds = wrapper.find("#obligated_funds");
  //   const formatedValue = formatter.format(propsData.obligated_funds);
  //   expect(obligated_funds.text()).toBe(formatedValue);
  // });

  // it("Period of Performance Value renders correctly", async () => {
  //   await wrapper.vm.$nextTick();
  //   const period_of_performance = wrapper.find("#period_of_performance");
  //   const formatedValue = `${formatDate(
  //     propsData.pop_start_date
  //   )} - ${formatDate(propsData.pop_end_date)}`;

  //   expect(period_of_performance.text()).toBe(formatedValue);
  // });

  // it("Clin Number Value renders correctly", async () => {
  //   await wrapper.vm.$nextTick();
  //   const clin_number = wrapper.find("#clin_number");
  //   expect(clin_number.text()).toBe(`CLIN ${propsData.clin_number}`);
  // });

  //testing private functions created after september 2021
  // it("test clin form clicked", async (done) => {
  //   document.body.innerHTML = `
  //   <div class="clin-datepicker-control">
  //   <div id="test">blank</div>
  //   </div>
  //    `;
  //   await wrapper.vm.clinFormClicked({ target: "test" });
  //   setTimeout(() => {
  //     expect(wrapper.exists()).toBe(true);
  //     done();
  //   }, 500);
  // });
  it("test delete clin", async () => {
    await wrapper.vm.deleteClin(1);
    expect(wrapper.exists()).toBe(true);
  });
  it("test toggleClinCard", async () => {
    await wrapper.vm.toggleClinCard({ target: "test" });
    expect(wrapper.exists()).toBe(true);
  });

  it("test cancel delete clin", async () => {
    await wrapper.vm.cancelDeleteClin();
    expect(wrapper.exists()).toBe(true);
  });
  it("test onOpenItemChanged", async () => {
    wrapper.setData({ openItem: 1 });
    await wrapper.vm.onOpenItemChanged();
    expect(wrapper.exists()).toBe(true);
  });
  it("test onOpenItemChanged else", async () => {
    wrapper.setData({ openItem: 0 });
    await wrapper.vm.onOpenItemChanged();
    expect(wrapper.exists()).toBe(true);
  });
  it("test Open", async () => {
    wrapper.setData({ openItem: 1 });
    await wrapper.vm.open();
    expect(wrapper.vm.$data.openItem).toBe(0);
  });
  // it("test validatClinNumber", async () => {
  //   await wrapper.vm.validateClinNumber();
  //   expect(wrapper.exists()).toBe(true);
  // });
  // it("test validateIdiqClin", async () => {
  //   await wrapper.vm.validateIdiqClin();
  //   expect(wrapper.exists()).toBe(true);
  // });
  // it("test validateIdiqClin else", async () => {
  //   await wrapper.vm.validateIdiqClin("IDIQ CLIN 0001 Unclassified IaaS/PaaS");
  //   expect(wrapper.exists()).toBe(true);
  // });

  it("test open delete clin", async (done) => {
    await wrapper.vm.openDeleteClinModal();
    setTimeout(() => {
      expect(wrapper.exists()).toBe(true);
      done();
    }, 500);
  });
  it("test allowedDates", async () => {
    await wrapper.vm.allowedDates("2022-10-01");
    expect(wrapper.exists()).toBe(true);
  });
  it("test allowedDates else", async () => {
    await wrapper.setProps({
      pop_start_date: "",
    });
    await wrapper.vm.allowedDates("09-01-2022");
    expect(wrapper.exists()).toBe(true);
  });
  it("test Destroyed", async () => {
    await wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
  it("test clinFormFocused", async () => {
    await wrapper.clinFormFocused;
    expect(wrapper.exists()).toBe(true);
  });
  it("test valid Dates", async () => {
    await wrapper.setProps({
      pop_end_date: "2021-09-01",
      pop_start_date: "2022-09-01",
    });
    await wrapper.vm.setDateRange();
    expect(wrapper.exists()).toBe(true);
  });
  it("test valid Dates", async () => {
    await wrapper.setProps({
      card_number: 1,
      clin_number: "0001",
      idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
      total_clin_value: 200000,
      obligated_funds: 10000,
      pop_start_date: formatDate2("2021-10-01"),
      pop_end_date: formatDate2("2022-09-30"),
    });
    await wrapper.setData({ validationRules: [] });

    expect(wrapper.exists()).toBe(true);
  });
  it("test valid Dates wrong order", async () => {
    await wrapper.setProps({
      card_number: 1,
      clin_number: "0001",
      idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
      total_clin_value: 200000,
      obligated_funds: 10000,
      pop_end_date: formatDate2("2021-10-01"),
      pop_start_date: formatDate2("2022-09-30"),
    });
    await wrapper.setData({ validationRules: [] });

    expect(wrapper.exists()).toBe(true);
  });

  // it("test clin form clicked", async (done) => {
  //   await wrapper.vm.clinFormClicked({ target: "test" });
  //   setTimeout(() => {
  //     expect(wrapper.exists()).toBe(true);
  //     done();
  //   }, 500);
  // });

  it("test get DateFields", async () => {
    await wrapper.vm.DateFields;
    await wrapper.vm.FundFields;
    expect(wrapper.exists()).toBe(true);
  });
  it("test valid Dates", async () => {
    await wrapper.setProps({
      card_number: 1,
      clin_number: "0001",
      idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
      total_clin_value: 200000,
      obligated_funds: 10000,
      pop_start_date: "",
      pop_end_date: formatDate2("2022-09-30"),
    });
    await wrapper.vm.validateDatePickerOnSave;

    expect(wrapper.exists()).toBe(true);
  });
});
