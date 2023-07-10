import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import ProcurementHistorySummary from "@/steps/03-Background/CurrentContract/ProcurementHistorySummary.vue";

const currentContractDTO = {
  instance_number: 1,
  current_contract_exists: "YES",
  incumbent_contractor_name: "incumbent_contractor_name",
  contract_number: "123",
  task_delivery_order_number: "123",
  contract_order_expiration_date: "10/12/2039",
  contract_order_start_date: "10/12/2023",
  competitive_status: "cs",
  business_size: "bs",
  acquisition_package: "123",
  is_valid: true,
  sys_created_by: "me",
  is_current: true,
}

describe("Testing ProcurementHistorySummary Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProcurementHistorySummary, {
      localVue,
      vuetify,
    });
  });

  it("tests that component renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("Testing GETTERS", () => {
    beforeEach(() => {
     wrapper.setData(
      {dataSource: [currentContractDTO]}
     )
    });
  
    it("hasContractData() => returns boolean", async () => {
      expect(wrapper.vm.hasContractData).toBe(true);
    });
  
   });

 });
