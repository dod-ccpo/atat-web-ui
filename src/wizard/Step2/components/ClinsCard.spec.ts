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
    expect(clinRules.length).toBe(1);
  });

  const firstPopStartRule = createTestDescription("1st pop start rule");
  const secondPopStartRule = createTestDescription("2nd pop start rule");

  it(firstPopStartRule("rule returns validation message"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[0]("100");
    expect(rule).toBe(
      "Please enter a start date using the format 'MM/DD/YYYY'"
    );
  });

  it(firstPopStartRule("returns true when valid"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[0]("2021-09-01");
    expect(rule).toBe(
      "Please enter a start date using the format 'MM/DD/YYYY'"
    );
  });

  it(secondPopStartRule("returns validation message"), async () => {
    await Vue.nextTick();
    const popStartRules = wrapper.vm.popStartRules;
    const rule = popStartRules[0]("");
    expect(rule).toBe(
      "Please enter a start date using the format 'MM/DD/YYYY'"
    );
  });

  const JWCCContractEndDate = "2022-09-14";

  // pop end rules
  it("pop end rules should not be null or empty", async () => {
    const rules = wrapper.vm.popEndRules;
    wrapper.setProps({ pop_end_date: "" });
    expect(rules).not.toBeNull();
    expect(rules.length).toBe(1);
  });
  const firstPopEndRule = createTestDescription("1st pop end rule");

  it(firstPopEndRule("rule returns validation message"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[0]();
    expect(rule).toBe("Please enter an end date using the format 'MM/DD/YYYY'");
  });

  it(firstPopEndRule("returns true when valid"), async () => {
    await Vue.nextTick();
    const popEndRules = wrapper.vm.popEndRules;
    const rule = popEndRules[0]("2021-09-01");
    expect(rule).toBe("Please enter an end date using the format 'MM/DD/YYYY'");
  });

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

  //testing private functions created after september 2021
  it("test delete clin", async () => {
    await wrapper.vm.deleteClin(1);
    expect(wrapper.exists()).toBe(true);
  });

  it("test cancel delete clin", async () => {
    await wrapper.vm.cancelDeleteClin();
    expect(wrapper.exists()).toBe(true);
  });
  it("test open", async () => {
    await wrapper.vm.open();
    expect(wrapper.vm.openItem).toBe(0);
  });

  it("test validateFormFields", async () => {
    await wrapper.vm.validateFormFields();
    expect(wrapper.exists()).toBe(true);
  });

  it("test open delete clin", async (done) => {
    await wrapper.vm.openDeleteClinModal();
    setTimeout(() => {
      expect(wrapper.exists()).toBe(true);
      done();
    }, 500);
  });
  it("test allowedDates", async () => {
    await wrapper.vm.allowedDates("2022-09-01");
    expect(wrapper.exists()).toBe(true);
  });
  it("test Destroyed", async () => {
    await wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
  it("test setDateRange", async () => {
    await wrapper.setProps({
      pop_end_date: "2021-09-01",
      pop_start_date: "2022-09-01",
    });
    await wrapper.vm.setDateRange();
    expect(wrapper.exists()).toBe(true);
  });
  it("test clin form clicked", async (done) => {
    document.body.innerHTML = `
    <div class="clin-datepicker-control">
    <div id="test">blank</div>
    </div>
     `;
    await wrapper.vm.clinFormClicked(
      `<div id="clin-datepicker-text-boxes-clin_1" class="clin-datepicker-control"><div class="width-100 d-flex justify-start"><label id="start_date_text_field_label-clin_1" for="start-date-text-box-clin_1" class="font-weight-bold form-field-label"> Start Date </label><label id="end_date_text_field_label-clin_1" for="end-date-text-box-clin_1" class="font-weight-bold form-field-label"> End Date </label></div><div role="alert" class="mt-0 width-100"><div class="error--text"><div class="v-messages__message"> Please enter a start date using the format 'MM/DD/YYYY' </div></div></div><div id="datepicker-text-boxes-clin_1" class="width-100 d-flex justify-start mt-2"><div class="textbox-button d-flex justify-start"><div class="v-input v-input--has-state v-input--hide-details v-input--is-label-active v-input--is-dirty v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined v-text-field--placeholder error--text datepicker-text-box start-date"><div class="v-input__control"><div class="v-input__slot"><fieldset aria-hidden="true"><legend style="width: 0px;"></legend></fieldset><div class="v-text-field__slot"><input id="start-date-text-box-clin_1" placeholder="MM/DD/YYYY" type="text"></div><div class="v-input__append-inner"><div class="v-input__icon v-input__icon--clear"><button type="button" aria-label="clear icon" class="v-icon notranslate v-icon--link material-icons theme--light error--text">clear</button></div></div></div></div></div><button type="button" class="start-date-button v-btn v-btn--icon v-btn--round theme--light v-size--default" id="start-date-text-box-button-clin_1" aria-label="Open calendar to select Start Date"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate black--text date-picker-icon start-date-icon material-icons theme--light">calendar_today</i></span></button></div><div class="textbox-button d-flex justify-start"><div class="v-input v-input--hide-details v-input--is-label-active v-input--is-dirty v-input--is-focused v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined v-text-field--placeholder primary--text focused datepicker-text-box end-date"><div class="v-input__control"><div class="v-input__slot"><fieldset aria-hidden="true"><legend style="width: 0px;"></legend></fieldset><div class="v-text-field__slot"><input id="end-date-text-box-clin_1" placeholder="MM/DD/YYYY" type="text"></div><div class="v-input__append-inner"><div class="v-input__icon v-input__icon--clear"><button type="button" aria-label="clear icon" class="v-icon notranslate v-icon--link material-icons theme--light primary--text">clear</button></div></div></div></div></div><button type="button" class="end-date-button v-btn v-btn--icon v-btn--round theme--light v-size--default" id="end-date-text-box-button-clin_1" aria-label="Open calendar to select End Date"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate black--text date-picker-icon end-date-icon material-icons theme--light">calendar_today</i></span></button></div><div role="menu" class="v-menu__content theme--light menuable__content__active " style="min-width: 0px; top: -375px; left: -2px; transform-origin: left top; z-index: 8;"><div class="two-date-pickers pa-6"><div tabindex="-1" class="h3 d-flex align-center justify-space-between"><span>What is the PoP End Date?</span><button type="button" class="close-datepicker-button v-btn v-btn--icon v-btn--round theme--light v-size--small" id="close-datepickers-clin_1" aria-label="Close datepicker"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate black--text close-datepicker-button material-icons theme--light">close</i></span></button></div><hr class="mt-6 mb-4"><div class="d-flex align-start"><div class="v-picker v-card v-picker--date first-month theme--light" id="firstMonthDatePicker-clin_1" transition="false"><div class="v-picker__body v-picker__body--no-title theme--light" style="width: 290px;"><div><div class="v-date-picker-header theme--light"><button type="button" disabled="disabled" class="v-btn v-btn--disabled v-btn--icon v-btn--round theme--light v-size--default" aria-label="Previous month"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light">chevron_left</i></span></button><div class="v-date-picker-header__value"><div class="accent--text"><button type="button">January 2002</button></div></div><button type="button" class="v-btn v-btn--icon v-btn--round theme--light v-size--default" aria-label="Next month"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light">chevron_right</i></span></button></div><div class="v-date-picker-table v-date-picker-table--date theme--light hover-end"><table><thead><tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr></thead><tbody><tr><td></td><td></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">1</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">2</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">3</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">4</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">5</div></button></td></tr><tr><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">6</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">7</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">8</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">9</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">10</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">11</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">12</div></button></td></tr><tr><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">13</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">14</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">15</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">16</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">17</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">18</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">19</div></button></td></tr><tr><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">20</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">21</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">22</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">23</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">24</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">25</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">26</div></button></td></tr><tr><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">27</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">28</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">29</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">30</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">31</div></button></td><td></td><td></td></tr></tbody></table></div></div></div></div><div class="v-picker v-card v-picker--date second-month theme--light" id="secondMonthDatePicker-clin_1" transition="false"><div class="v-picker__body v-picker__body--no-title theme--light" style="width: 290px;"><div><div class="v-date-picker-header theme--light"><button type="button" disabled="disabled" class="v-btn v-btn--disabled v-btn--icon v-btn--round theme--light v-size--default" aria-label="Previous month"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light">chevron_left</i></span></button><div class="v-date-picker-header__value"><div class="accent--text"><button type="button">February 2002</button></div></div><button type="button" class="v-btn v-btn--icon v-btn--round theme--light v-size--default" aria-label="Next month"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light">chevron_right</i></span></button></div><div class="v-date-picker-table v-date-picker-table--date theme--light hover-end"><table><thead><tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">1</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">2</div></button></td></tr><tr><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">3</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">4</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">5</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">6</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">7</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">8</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">9</div></button></td></tr><tr><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">10</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">11</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">12</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">13</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">14</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">15</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">16</div></button></td></tr><tr><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">17</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">18</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">19</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">20</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">21</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">22</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">23</div></button></td></tr><tr><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">24</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">25</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">26</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">27</div></button></td><td><button type="button" class="v-btn v-btn--flat v-btn--text v-btn--rounded v-btn--disabled theme--light" disabled=""><div class="v-btn__content">28</div></button></td><td></td><td></td></tr></tbody></table></div></div></div></div></div></div></div></div><div class="width-100 d-flex justify-start mt-2 text--base"> Month, Day, Year (e.g. MM/DD/YYYY) </div></div>`
    );
    setTimeout(() => {
      expect(wrapper.exists()).toBe(true);
      done();
    }, 500);
  });
});
// {
//     card_number: 2,
//         clin_number: "0002",
//     idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
//     total_clin_value: 200000,
//     obligated_funds: 10000,
//     pop_start_date: "2021-09-01",
//     pop_end_date: "2022-09-01",
// },
