import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ClinsCardList from "@/wizard/Step2/components/ClinsCardList.vue";

Vue.use(Vuetify);

describe("Testing Create ClinsCard Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  const validPropsData = {
    clins: [
      {
        card_number: 1,
        clin_number: "0001",
        idiq_clin: "Agkistrodon piscivorus",
        total_clin_value: 243820,
        obligated_funds: 11050,
        pop_start_date: "2021-11-01",
        pop_end_date: "2022-11-17",
      },
      {
        card_number: 2,
        clin_number: "0008",
        idiq_clin: "Uraeginthus granatina",
        total_clin_value: 268717,
        obligated_funds: 13461,
        pop_start_date: "2021-12-20",
        pop_end_date: "2022-12-03",
      },
      {
        card_number: 3,
        clin_number: "0005",
        idiq_clin: "Lasiodora parahybana",
        total_clin_value: 257756,
        obligated_funds: 11511,
        pop_start_date: "2021-09-28",
        pop_end_date: "2022-12-04",
      },
      {
        card_number: 4,
        clin_number: "0003",
        idiq_clin: "Phalacrocorax niger",
        total_clin_value: 294665,
        obligated_funds: 14661,
        pop_start_date: "2021-11-04",
        pop_end_date: "2022-12-19",
      },
      {
        card_number: 5,
        clin_number: "0009",
        idiq_clin: "Castor fiber",
        total_clin_value: 209168,
        obligated_funds: 13753,
        pop_start_date: "2021-11-17",
        pop_end_date: "2022-10-10",
      },
      {
        card_number: 6,
        clin_number: "0004",
        idiq_clin: "Tapirus terrestris",
        total_clin_value: 265444,
        obligated_funds: 12721,
        pop_start_date: "2021-10-28",
        pop_end_date: "2022-11-01",
      },
    ],
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ClinsCardList, {
      localVue,
      vuetify,
      stubs: ["atat-text-field", "atat-select", "atat-date-picker"],
      propsData: validPropsData,
    });
  });

  it("Has valid data ", async () => {
    await Vue.nextTick();
    const valid = await wrapper.vm.validate();
    expect(valid).toBe(true);
  });
});
