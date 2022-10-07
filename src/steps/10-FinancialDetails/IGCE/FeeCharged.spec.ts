import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation"
import FeeCharged from "@/steps/10-FinancialDetails/IGCE/FeeCharged.vue";
import { RequirementsCostEstimateDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
Vue.use(Vuetify);

describe("Testing FeeCharged Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators)

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FeeCharged, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("currentData() retrieves expected object", async () => {
    const feeCharged = "YES";
    wrapper.setData({
      feePercentage: "12",
      feeCharged: feeCharged
    })
    const currentData: RequirementsCostEstimateDTO = 
      wrapper.vm.currentData;
    expect(currentData.feeCharged).toBe(feeCharged);
  });

  it("currentData() with feeCharged==='NO' to delete $data.feePercentage", async () => {
    const feeCharged = "NO";
    wrapper.setData({
      feePercentage: "12",
      feeCharged: feeCharged
    })
    const currentData: RequirementsCostEstimateDTO = 
      wrapper.vm.currentData;
    expect(currentData.feePercentage).toBe("");
  });

  it("hasChanged() retrieves expected boolean value", async () => {
    const feeCharged = "YES";
    wrapper.setData({
      feeCharged: feeCharged,
      savedData:{
        feeCharged: "NO"
      }
    })
    const hasChanged: boolean = wrapper.vm.hasChanged();
    expect(hasChanged).toBe(true);
  });

  it("loadOnEnter() retrieves expected boolean value with valid " +
  "AcquisitionPackage.requirementsCostEstimate", async () => {
    const feeCharged = "YES";
    jest.spyOn(AcquisitionPackage, "getRequirementsCostEstimate").mockImplementation(
      ()=>({
        feeCharged: feeCharged
      })
    )
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.savedData.feeCharged).toBe(feeCharged);
    expect(wrapper.vm.$data.feeCharged).toBe(feeCharged);
  });

  it("loadOnEnter() retrieves expected boolean value with undefined " +
  "AcquisitionPackage.requirementsCostEstimate", async () => {
    jest.spyOn(AcquisitionPackage, "getRequirementsCostEstimate").mockImplementation(
      ()=>({
        feeCharged: undefined
      })
    )
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.feeCharged).toBe("");
  });

  it("saveOnLeave() if data has changed, set new data to " +
  "AcquisitionPackage.setRequirementsCostEstimate", async () => {
    const feeCharged = "YES";
    const feePercentage="15";
    // setData results in hasChanged() === true
    wrapper.setData({
      feeCharged,
      feePercentage,
      savedData:{
        feeCharged: 'NO',
        feePercentage: ''
      }
    })
    await wrapper.vm.saveOnLeave();
    const reqCostEst = await AcquisitionPackage.requirementsCostEstimate;
    expect(reqCostEst?.feeCharged).toBe(feeCharged);
  });


})
