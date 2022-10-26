/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SurgeCapacity from "@/steps/10-FinancialDetails/IGCE/SurgeCapacity.vue";
import validators from "../../../plugins/validation"
import IGCEStore from "@/store/IGCE";
Vue.use(Vuetify);

describe("Testing SurgeCapacity Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators)

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SurgeCapacity, {
      localVue,
      vuetify,
    });
  });
  
  afterEach(()=>{
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });


  it("hasChanged() retrieves expected boolean value", async () => {
    await wrapper.setData({
      currentData:{
        capacity: "YES",
      },
      savedData:{
        capacity: "NO"
      }
    })
    const hasChanged: boolean = await wrapper.vm.hasChanged();
    expect(hasChanged).toBe(true);
  });

  it("saveOnLeave() if data has changed, ensure data has saved to store by calling  " +
  "IGCEStore.setSurgeRequirements", async () => {
    const surgeCap = "YES";
    // setData results in hasChanged() === true
    wrapper.setData({
      capacity: "YES",
      savedData:{
        capacity: "NO"
      }
    })
    await wrapper.vm.saveOnLeave();
    const reqCostEst = await IGCEStore.getSurgeRequirements();
    expect(reqCostEst.capacity).toBe(surgeCap);
  });


})
