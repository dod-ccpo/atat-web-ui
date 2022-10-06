/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SurgeCapacity from "@/steps/10-FinancialDetails/IGCE/SurgeCapacity.vue";
import { RequirementsCostEstimateDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
Vue.use(Vuetify);

describe("Testing SurgeCapacity Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

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

  it("currentData() retrieves expected object", async () => {
    const surgeCap = "YES";
    wrapper.setData({
      surgeCapacity: surgeCap
    })
    const currentData: RequirementsCostEstimateDTO = 
      wrapper.vm.currentData;
    expect(currentData.surge_capacity).toBe(surgeCap);
  });

  it("hasChanged() retrieves expected boolean value", async () => {
    const surgeCap = "YES";
    wrapper.setData({
      surgeCapacity: surgeCap,
      savedData:{
        surgeCapacity: "NO"
      }
    })
    const hasChanged: boolean = wrapper.vm.hasChanged();
    expect(hasChanged).toBe(true);
  });

  it("loadOnEnter() retrieves expected boolean value with valid " +
  "AcquisitionPackage.requirementsCostEstimate", async () => {
    const surgeCap = "YES";
    jest.spyOn(AcquisitionPackage, "getRequirementsCostEstimate").mockImplementation(
      ()=>({
        surge_capacity: surgeCap
      })
    )
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.savedData.surge_capacity).toBe(surgeCap);
    expect(wrapper.vm.surgeCapacity).toBe(surgeCap);
  });

  it("loadOnEnter() retrieves expected boolean value with undefined surge_capacity " +
  "AcquisitionPackage.requirementsCostEstimate", async () => {
    jest.spyOn(AcquisitionPackage, "getRequirementsCostEstimate").mockImplementation(
      ()=>({
        surge_capacity: undefined
      })
    )
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.surgeCapacity).toBe("");
  });

  it("saveOnLeave() if data has changed, set new data to " +
  "AcquisitionPackage.setRequirementsCostEstimate", async () => {
    const surgeCap = "YES";
    // setData results in hasChanged() === true
    wrapper.setData({
      surgeCapacity: surgeCap,
      savedData:{
        surgeCapacity: "NO"
      }
    })
    await wrapper.vm.saveOnLeave();
    const reqCostEst = await AcquisitionPackage.requirementsCostEstimate;
    expect(reqCostEst?.surge_capacity).toBe(surgeCap);
  });


})
