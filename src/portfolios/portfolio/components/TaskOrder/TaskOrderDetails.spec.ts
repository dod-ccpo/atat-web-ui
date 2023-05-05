import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import TaskOrderDetails from "@/portfolios/portfolio/components/TaskOrder/TaskOrderDetails.vue";
import { ClinTableRowData } from "types/Global";
import { ClinDTO } from "@/api/models";
import { Statuses } from "@/store/acquisitionPackage";

Vue.use(Vuetify);

//TODO fix tests logging "Error loading Task Order Details"
describe("Testing TaskOrderDetails Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  /* eslint-disable camelcase */
  const clins: ClinDTO[] = [
    {
      sys_id: "1234",
      clin_number: "1001",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "",
      clin_status: Statuses.OnTrack.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 50,
    },    
    {
      sys_id: "1234",
      clin_number: "1002",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "",
      clin_status: Statuses.OnTrack.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 0,
    },
    {
      sys_id: "1234",
      clin_number: "1003",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "",
      clin_status: Statuses.OnTrack.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 110,
    },
    {
      sys_id: "2345",
      clin_number: "1004",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "",
      clin_status: Statuses.OptionExercised.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 50,
    },
  ];

  const pendingClins: ClinDTO[] = [
    {
      sys_id: "3456",
      clin_number: "2002",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "2022-02-01",
      clin_status: Statuses.OptionPending.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 50,
    },
    {
      sys_id: "3456",
      clin_number: "2001",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "2022-01-01",
      clin_status: Statuses.OptionPending.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 50,
    },
    {
      sys_id: "3456",
      clin_number: "2003",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "2022-01-01",
      clin_status: Statuses.OptionPending.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 50,
    },
  ];

  const expiredClins: ClinDTO[] = [
    {
      sys_id: "4567",
      clin_number: "0002",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "2022-01-01",
      clin_status: Statuses.Expired.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 200,
    },     
    {
      sys_id: "4567",
      clin_number: "0001",
      idiq_clin: "",
      pop_end_date: "",
      pop_start_date: "2022-01-01",
      clin_status: Statuses.Expired.value,
      funds_obligated: 100,
      funds_total: 200,
      funds_spent_clin: 200,
    },   
  ];
  /* eslint-enable camelcase */

  const allClins: ClinDTO[] = clins.concat(pendingClins, expiredClins);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(TaskOrderDetails, {
      localVue,
      vuetify,
      propsData: {
        selectedTaskOrder:
          {
            taskOrderNumber:"#HC1028-22-F-0141",
            periodOfPerformance:"Oct. 1, 2021 - Sept. 30, 2022",
            totalObligated:"$1,000,000.00","totalValue":"$1,000,000.00",
            totalLifeCycle:"$1,000,000.00","totalFundsSpent":"$500,000.00",
            status:"On Track"
          }
      }
    });
  });
 
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("Testing functions",()=>{
    it("test handleClick()",()=>{
      const showDetails = wrapper.vm.$props.showDetails
      expect(showDetails).toBe(false);
      wrapper.vm.handleClick()
      Vue.nextTick(() => {
        expect(showDetails).toBe(true);
      })
    });

    it("toggles show/hide text value", async () => {
      await wrapper.setData({
        showInactive: false
      });
      const showHideStr = wrapper.vm.showHide();
      expect(showHideStr).toBe("Show");
      await wrapper.setData({
        showInactive: true
      });
      Vue.nextTick(() => {
        expect(showHideStr).toBe("Hide");
      })

    });

    it("getValign() - sets vertical cell alignment", async () => {
      let item: ClinTableRowData = {
        isPending: true,
        popStartDate: "",
      };
      const vAlignM = wrapper.vm.getValign(item);
      expect(vAlignM).toBe("middle");
      item = {
        isPending: false,
        isExpired: true,
        isOverspent: true,
        popStartDate: "",
      };
      const vAlignT = wrapper.vm.getValign(item);
      Vue.nextTick(() => {
        expect(vAlignT).toBe("top");
      })
    });

    it("toggleInactive() = used for show/hide inactive clins", async () => {
      wrapper.vm.$data.showInactive = false;
      wrapper.vm.toggleInactive();
      expect(wrapper.vm.$data.showInactive).toBeTruthy();
    });    

    it("fundsRemaining() - sets object with remaining $ and %", async () => {
      let fundsObj = wrapper.vm.fundsRemaining("1000", "500");
      expect(fundsObj.percent).toBe("50");
      expect(fundsObj.fundsRemaining).toBe("$500.00 remaining");
      fundsObj = wrapper.vm.fundsRemaining("0", "0")
    });    

    it("collectTableData() - builds CLIN data for the table", async () => {
      await wrapper.setData({
        clins: allClins
      });
      await wrapper.vm.collectTableData();
      expect(wrapper.vm.$data.inactiveCount).toBe(5);
      expect(wrapper.vm.$data.totals.percent).toBe("53");
      expect(wrapper.vm.$data.totals.fundsRemaining).toBe("$190.00 remaining");
    });    

    it("addSeparators() - adds wider border to top of new clin sections", async () => {
      await wrapper.setData({
        optionPendingClins: pendingClins,
        expiredClins: expiredClins,
      })
      await wrapper.vm.addSeparators();
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.optionPendingClins[0].startnewClinGroup).toBeTruthy();
        expect(wrapper.vm.$data.expiredClins[0].startnewClinGroup).toBeTruthy();  
      })
    });    

    it("sortRows() - orders clins for the table", async () => {
      const tableData: ClinTableRowData[] = [
        {
          CLINNumber: "1002",
          popStartDate: "",
        },
        {
          CLINNumber: "1001",
          popStartDate: "",
        }
      ];
      await wrapper.setData({
        tableData,
        optionPendingClins: pendingClins,
        expiredClins: expiredClins,
      });
      await wrapper.vm.sortRows();
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.tableData[0].CLINNumber).toBe("1001");
        expect(wrapper.vm.$data.optionPendingClins[0].CLINNumber).toBe("2001");
        expect(wrapper.vm.$data.expiredClins[0].CLINNumber).toBe("0001");
      })
      
    });    

    // it("xxx", async () => {
      
    // });    

  })
})
