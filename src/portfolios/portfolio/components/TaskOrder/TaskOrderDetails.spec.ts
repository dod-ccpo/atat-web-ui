import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import TaskOrderDetails from "@/portfolios/portfolio/components/TaskOrder/TaskOrderDetails.vue";
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
    })
  })
})
