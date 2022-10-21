import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import TaskOrderDetails from "@/portfolios/portfolio/components/TaskOrder/TaskOrderDetails.vue";
import { ClinTableRowData } from "types/Global";

Vue.use(Vuetify);

describe("Testing TaskOrderDetails Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(TaskOrderDetails, {
      localVue,
      vuetify,
      propsData: {
        selectedTaskOrder: [
          {
            taskOrderNumber:"#HC1028-22-F-0141",
            periodOfPerformance:"Oct. 1, 2021 - Sept. 30, 2022",
            totalObligated:"$1,000,000.00","totalValue":"$1,000,000.00",
            totalLifeCycle:"$1,000,000.00","totalFundsSpent":"$500,000.00",
            status:"On Track"
          },
        ]
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
      const fundsObj = wrapper.vm.fundsRemaining("1000", "500");
      expect(fundsObj.percent).toBe("50");
      expect(fundsObj.fundsRemaining).toBe("$500.00 remaining");
    });    

    // it("xxx", async () => {
      
    // });    

  })
})
