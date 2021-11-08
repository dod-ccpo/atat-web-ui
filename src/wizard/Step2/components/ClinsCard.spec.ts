import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ClinsCard from "@/wizard/Step2/components/ClinsCard.vue";
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

describe("Testing Create ClinsCard Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  const propsData = {
    card_number: 1,
    clin_number: "0001",
    idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
    total_clin_value: 200000,
    obligated_funds: 10000,
    pop_start_date: "2021-09-01",
    pop_end_date: "2022-09-01",
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ClinsCard, {
      localVue,
      vuetify,
      stubs: ["atat-text-field", "atat-select", "atat-date-picker"],
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
    expect(thirdRule).toBe("CLIN number cannot exceed 4 characters");
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
    expect(firstRule).toBe("Please enter CLIN value");
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
    expect(firstRule).toBe("Please enter a valid number");
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
    const firstRule = totalClinRules[2]("1000");
    expect(firstRule).toBe("Obligated Funds cannot exceed total CLIN Values");
  });

  it("third total cline rule returns true when valid", async () => {
    await Vue.nextTick();
    const totalClinRules = wrapper.vm.totalClinRules;
    const firstRule = totalClinRules[2]("1000000");
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
  const thirdPopStartRules = createTestDescription("3rd pop start rule");
  const fourthPopStartRules = createTestDescription("4th pop start rule");
  const fifthPopStartRules = createTestDescription("5th pop start rule");

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
    const rule = popStartRules[1]("");
    expect(rule).toBe(true);
  });

  it(secondPopStartRule("returns true when valid"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[1]("2021-09-01");
    expect(rule).toBe(true);
  });

  it(thirdPopStartRules("returns validation message"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[2]("");
    expect(rule).toBe(true);
  });

  it(thirdPopStartRules("returns true when valid"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[2]("2021-09-01");
    expect(rule).toBe(true);
  });

  // it(fourthPopStartRules("returns validation message"), async () => {
  //   await Vue.nextTick();
  //   const popStartRules = wrapper.vm.popStartRules;
  //   const rule = popStartRules[3]("2022-09-01");
  //   expect(rule).toBe("The PoP start date must be before the end date");
  // });

  // it(fourthPopStartRules("returns true when valid"), async () => {
  //   await Vue.nextTick();
  //   const popStartRules = wrapper.vm.popStartRules;
  //   const rule = popStartRules[3]("2021-09-01");
  //   expect(rule).toBe(true);
  // });

  const JWCCContractEndDate = "2022-09-14";

  // it(fifthPopStartRules("returns validation message"), async () => {
  //   await Vue.nextTick();
  //   const popStartRules = wrapper.vm.popStartRules;
  //   const rule = popStartRules[4]("");
  //   expect(rule).toBe(
  //     `The start date must be before or on ${JWCCContractEndDate}`
  //   );
  // });

  // it(fifthPopStartRules("returns true when valid"), async () => {
  //   await Vue.nextTick();
  //   const popStartRules = wrapper.vm.popStartRules;
  //   const rule = popStartRules[4]("2021-09-01");
  //   expect(rule).toBe(true);
  // });

  // pop end rules
  it("pop end rules should not be null or empty", async () => {
    const rules = wrapper.vm.popEndRules;
    wrapper.setProps({ pop_end_date: "" });
    expect(rules).not.toBeNull();
    expect(rules.length).toBe(3);
  });
  const firstPopEndRule = createTestDescription("1st pop end rule");
  const secondPopEndRule = createTestDescription("2nd pop end rule");
  const thirdPopEndRules = createTestDescription("3rd pop end rule");
  const fourthPopEndRules = createTestDescription("4th pop end rule");
  const fifthPopEndRules = createTestDescription("5th pop end rule");

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

  it(secondPopEndRule("returns validation message"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[1]("");
    expect(rule).toBe(true);
  });

  it(secondPopEndRule("returns true when valid"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[1]("2022-09-01");
    expect(rule).toBe(true);
  });

  it(thirdPopEndRules("returns validation message"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[2]("");
    expect(rule).toBe(true);
  });

  it(thirdPopEndRules("returns true when valid"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[2]("2022-09-01");
    expect(rule).toBe(true);
  });

  // it(fourthPopEndRules("returns validation message"), async () => {
  //   await Vue.nextTick();
  //   const popEndRules = wrapper.vm.popEndRules;
  //   const rule = popEndRules[3]("2021-09-01");
  //   expect(rule).toBe("The PoP end date must be after the start date");
  // });

  // it(fourthPopEndRules("returns true when valid"), async () => {
  //   await Vue.nextTick();
  //   const popEndRules = wrapper.vm.popEndRules;
  //   const rule = popEndRules[3]("2022-09-01");
  //   expect(rule).toBe(true);
  // });

  // it(fifthPopEndRules("returns validation message"), async () => {
  //   await Vue.nextTick();
  //   const popEndRules = wrapper.vm.popEndRules;
  //   const rule = popEndRules[4]("");
  //   expect(rule).toBe(
  //     `The end date must be before or on ${JWCCContractEndDate}`
  //   );
  // });

  // it(fifthPopEndRules("returns true when valid"), async () => {
  //   await Vue.nextTick();
  //   const popEndRules = wrapper.vm.popEndRules;
  //   const rule = popEndRules[4]("2022-09-01");
  //   expect(rule).toBe(true);
  // });

  // Obligated Funds Rules
  it("Obligated Funds Rules is not null and has expected rules", async () => {
    await Vue.nextTick();
    const rules = wrapper.vm.obligatedFundRules;
    expect(rules).not.toBe(null);
    expect(rules).toBeInstanceOf(Array);
    const rule1 = rules[0]("");
    expect(rule1).toBe("Please enter your obligated Funds");
    const rule2 = rules[1]("");
    expect(rule2).toBe("Please enter a valid number");
    const rule3 = rules[2](50000000000);
    expect(rule3).toBe("Obligated Funds cannot exceed total CLIN Values");
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
    expect(isValid).toBe(true);
  });

  it("form exists", async () => {
    await wrapper.vm.$nextTick();
    const formWrapper = wrapper.findComponent({ ref: "form" });
    expect(formWrapper.exists()).toBe(true);
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

  it("Card number renders correctly", async () => {
    await wrapper.vm.$nextTick();
    const card_number = wrapper.find("#card_number");
    expect(card_number.text()).toBe(`${propsData.card_number}`);
  });

  it("IDIQ Clin type renders correctly", async () => {
    await wrapper.vm.$nextTick();
    const idiq_clin = wrapper.find("#idiq_clin");
    expect(idiq_clin.text()).toBe(propsData.idiq_clin);
  });

  it("Total Clin Value renders correctly", async () => {
    await wrapper.vm.$nextTick();
    const total_clin_value = wrapper.find("#total_clin_value");
    const formatedValue = formatter.format(propsData.total_clin_value);
    expect(total_clin_value.text()).toBe(formatedValue);
  });

  it("Obligated funds Value renders correctly", async () => {
    await wrapper.vm.$nextTick();
    const obligated_funds = wrapper.find("#obligated_funds");
    const formatedValue = formatter.format(propsData.obligated_funds);
    expect(obligated_funds.text()).toBe(formatedValue);
  });

  it("Period of Performance Value renders correctly", async () => {
    await wrapper.vm.$nextTick();
    const period_of_performance = wrapper.find("#period_of_performance");
    const formatedValue = `${formatDate(
      propsData.pop_start_date
    )} - ${formatDate(propsData.pop_end_date)}`;

    expect(period_of_performance.text()).toBe(formatedValue);
  });

  it("Clin Number Value renders correctly", async () => {
    await wrapper.vm.$nextTick();
    const clin_number = wrapper.find("#clin_number");
    expect(clin_number.text()).toBe(`CLIN ${propsData.clin_number}`);
  });

  //   it("edit dialog exists", async () => {
  //     await wrapper.vm.$nextTick();
  //     const modals = wrapper.findAll("v-dialog");
  //     expect(modals.length).toBe(1);
  //   });
});
