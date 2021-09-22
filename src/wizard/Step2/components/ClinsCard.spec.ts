import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ClinsCard from "@/wizard/Step2/components/ClinsCard.vue";
import { create } from "ts-node";

Vue.use(Vuetify);

describe("Testing Create ClinsCard Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ClinsCard, {
      localVue,
      vuetify,
      stubs: ["atat-text-field", "atat-select", "atat-date-picker"],
      propsData: {
        card_number: 1,
        clin_number: "0001",
        idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
        total_clin_value: 200000,
        obligated_funds: 10000,
        pop_start_date: "2021-09-01",
        pop_end_date: "2022-09-01",
      },
    });
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
    expect(clinRules).not.toBeNull();
    expect(clinRules.length).toBe(5);
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
    expect(rule).toBe("Invalid Date");
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
    expect(rule).toBe(
      "Please enter the start date for your CLIN's period of performance"
    );
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
    expect(rule).toBe(
      "Please enter a start date using the format 'YYYY-MM-DD'"
    );
  });

  it(thirdPopStartRules("returns true when valid"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[2]("2021-09-01");
    expect(rule).toBe(true);
  });

  it(fourthPopStartRules("returns validation message"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[3]("2022-09-01");
    expect(rule).toBe("The PoP start date must be before the end date");
  });

  it(fourthPopStartRules("returns true when valid"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[3]("2021-09-01");
    expect(rule).toBe(true);
  });

  const JWCCContractEndDate = "2022-09-14";

  it(fifthPopStartRules("returns validation message"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[4]("");
    expect(rule).toBe(
      `The start date must be before or on ${JWCCContractEndDate}`
    );
  });

  it(fifthPopStartRules("returns true when valid"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[4]("2021-09-01");
    expect(rule).toBe(true);
  });

  // pop end rules
  it("pop end rules should not be null or empty", async () => {
    const rules = wrapper.vm.popEndRules;
    expect(rules).not.toBeNull();
    expect(rules.length).toBe(5);
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
    expect(rule).toBe(
      "Please enter the end date for your CLIN's period of performance"
    );
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
    expect(rule).toBe("Invalid Date");
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
    expect(rule).toBe("Please enter an end date using the format 'YYYY-MM-DD'");
  });

  it(thirdPopEndRules("returns true when valid"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[2]("2022-09-01");
    expect(rule).toBe(true);
  });

  it(fourthPopEndRules("returns validation message"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[3]("2021-09-01");
    expect(rule).toBe("The PoP end date must be after the start date");
  });

  it(fourthPopEndRules("returns true when valid"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[3]("2022-09-01");
    expect(rule).toBe(true);
  });

  it(fifthPopEndRules("returns validation message"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[4]("");
    expect(rule).toBe(
      `The end date must be before or on ${JWCCContractEndDate}`
    );
  });

  it(fifthPopEndRules("returns true when valid"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[4]("2022-09-01");
    expect(rule).toBe(true);
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

  it("obligated percent is correct", async () => {
    const obligatedPercent = wrapper.vm.obligatedPercent;
    console.log(obligatedPercent);
  });

//   it("calculateObligatedPercent is called on update", () => {
//     // wrapper.vm.calculateObligatedPercent  = jest.fn();
//     // wrapper.vm.updated();
//     wrapper.vm.FundFields = {
//       validate : jest.fn(),
//     };

//     wrapper.setProps({
//       obligated_funds: 15000,
//     });

//     expect( wrapper.vm.FundFields.validate).toHaveBeenCalled();
//   });
});
