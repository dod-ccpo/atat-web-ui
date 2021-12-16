import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ClinsCardList from "@/views/wizard/Step2/components/ClinsCardList.vue";

Vue.use(Vuetify);

describe("Testing Create ClinsCardList Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
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
        pop_start_date: "01-11-2021",
        pop_end_date: "11-17-2022",
      },
      {
        card_number: 2,
        clin_number: "0008",
        idiq_clin: "Uraeginthus granatina",
        total_clin_value: 268717,
        obligated_funds: 13461,
        pop_start_date: "12-20-2021",
        pop_end_date: "12-03-2022",
      },
      {
        card_number: 3,
        clin_number: "0005",
        idiq_clin: "Lasiodora parahybana",
        total_clin_value: 257756,
        obligated_funds: 11511,
        pop_start_date: "09-28-2021",
        pop_end_date: "12-04-2022",
      },
      {
        card_number: 4,
        clin_number: "0003",
        idiq_clin: "Phalacrocorax niger",
        total_clin_value: 294665,
        obligated_funds: 14661,
        pop_start_date: "11-04-2021",
        pop_end_date: "12-19-2022",
      },
      {
        card_number: 5,
        clin_number: "0009",
        idiq_clin: "Castor fiber",
        total_clin_value: 209168,
        obligated_funds: 13753,
        pop_start_date: "11-04-2021",
        pop_end_date: "10-10-2021",
      },
      {
        card_number: 6,
        clin_number: "",
        idiq_clin: "",
        total_clin_value: 0,
        obligated_funds: 0,
        pop_start_date: "",
        pop_end_date: "",
      },
    ],
  };

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

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ClinsCardList, {
      localVue,
      vuetify,
      store,
      stubs: [
        "atat-text-field",
        "atat-select",
        "atat-date-picker",
        "atat-currency-field",
      ],
      propsData: validPropsData,
    });
  });

  it("Has valid data ", async () => {
    await Vue.nextTick();
    const valid = await wrapper.vm.validate();
    expect(valid).toBe(false);
  });
  it("Has no data ", async () => {
    await Vue.nextTick();
    await wrapper.setProps({
      clins: [],
    });
    const valid = await wrapper.vm.validate();
    expect(valid).toBe(false);
  });

  it("Test ExpandAddedClin", async (done) => {
    await wrapper.vm.ExpandAddedClin();
    setTimeout(() => {
      expect(wrapper.exists()).toBe(true);
      done();
    }, 500);
  });

  it("Test ExpandClin", async (done) => {
    await wrapper.vm.ExpandClin(15);
    setTimeout(() => {
      expect(wrapper.exists()).toBe(true);
      done();
    }, 500);
  });
  it("Test ExpandClin", async () => {
    await wrapper.vm.clinLength;

    expect(wrapper.exists()).toBe(true);
  });
});
