/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SurgeCapabilities from "@/steps/10-FinancialDetails/IGCE/SurgeCapabilities.vue";
import validators from "@/plugins/validation"
import AcquisitionPackage from "@/store/acquisitionPackage";
import { RequirementsCostEstimateDTO } from "@/api/models";
Vue.use(Vuetify);

describe("Testing SurgeCapabilities Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      () => Promise.resolve({}));

    vuetify = new Vuetify();
    wrapper = mount(SurgeCapabilities, {
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
    const surgeCap = "30";
    wrapper.setData({
      surgeCapabilities: surgeCap
    })
    const currentData: RequirementsCostEstimateDTO = 
      wrapper.vm.currentData;
    expect(currentData.surge_capabilities).toBe(surgeCap);
  });

  it("hasChanged() retrieves expected boolean value", async () => {
    const surgeCap = "30";
    wrapper.setData({
      surgeCapabilities: surgeCap,
      savedData:{
        surgeCapabilities: "40"
      }
    })
    const hasChanged: boolean = wrapper.vm.hasChanged();
    expect(hasChanged).toBe(true);
  });

  it("loadOnEnter() retrieves expected boolean value with valid " +
    "AcquisitionPackage.requirementsCostEstimate", async () => {
    const surgeCap = "45";
    jest.spyOn(AcquisitionPackage, "getRequirementsCostEstimate").mockImplementation(
      ()=>({
        surge_capabilities: surgeCap
      })
    )
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.savedData.surge_capabilities).toBe(surgeCap);
    expect(wrapper.vm.surgeCapabilities).toBe(surgeCap);
  });

  it("loadOnEnter() retrieves expected boolean value with undefined surge_capabilities" +
  "AcquisitionPackage.requirementsCostEstimate", async () => {
    jest.spyOn(AcquisitionPackage, "getRequirementsCostEstimate").mockImplementation(
      ()=>({
        surge_capabilities: undefined
      })
    )
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.surgeCapabilities).toBe("");
  });

  it("saveOnLeave() if data has changed, set new data to " +
  "AcquisitionPackage.setRequirementsCostEstimate", async () => {
    const surgeCap = "30";
    // setData results in hasChanged() === true
    wrapper.setData({
      surgeCapabilities: surgeCap,
      savedData:{
        surgeCapabilities: "40"
      }
    })
    await wrapper.vm.saveOnLeave();
    const reqCostEst = await AcquisitionPackage.requirementsCostEstimate;
    expect(reqCostEst?.surge_capabilities).toBe(surgeCap);
  });








})
