/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import ClassificationLevelForm
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelForm.vue";
import validators from "../../../plugins/validation";
import classificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { createStore } from 'vuex';
//import api from '@/api'
// vi.mock('@/store/acquisitionPackage')
// vi.mock('@/store/IGCE')
// vi.mock('@/store/descriptionOfWork')
vi.mock('@/api')
//vi.mock('@/store/classificationRequirements')

// vi.mock('@/api', () => {
//   {
//     vi.fn(() => Promise.resolve(classificationsMock))
//   }
// })
//TODO PropSync Issue
describe("Testing CurrentEnvironment Component", () => {
  //, async () => {
  //   const actual:typeof classificationRequirements = await vi
  //     .importActual('@/store/classificationRequirements')
  //   return {
  //     ...actual,
  //     getAllClassificationLevels: vi.fn()
  //   }
  // })
  const onPremImpactOptions =  [
    {
      id: "PublicRelease",
      label: `Information approved for public release (Low Confidentiality 
        and Moderate Integrity)`,
      value: "2",
      description: "Equivalent to a Impact Level 2 (IL2) deployment"
    },
    {
      id: "CUI",
      label: "Controlled Unclassified Information (CUI)",
      value: "1",
      description: "Equivalent to a Impact Level 4 (IL4) deployment"
    },
    {
      id: "NationalSecuritySystems",
      label: "CUI and National Security Systems",
      value: "",
      description: "Equivalent to a Impact Level 5 (IL5) deploytment"
    },
  ]
  const classificationsMock:ClassificationLevelDTO[] = [
    {
      "sys_id":"1",
      "sys_updated_by":"admin",
      "sys_created_on":"2022-05-12 17:24:10",
      "display":"Unclassified - IL4",
      "sys_mod_count":"2",
      "impact_level":"IL4",
      "sys_updated_on":"2023-04-28 19:25:39",
      "classification":"U",
      "sys_tags":"",
      "sys_created_by":"",
      "dow_task_number_component":2
    },
    {
      "sys_id":"2",
      "sys_updated_by":"admin",
      "sys_created_on":"2022-05-12 17:24:10",
      "display":"Unclassified - IL2",
      "sys_mod_count":"2",
      "impact_level":"IL2",
      "sys_updated_on":"2023-04-28 19:25:39",
      "classification":"U",
      "sys_tags":"",
      "sys_created_by":"",
      "dow_task_number_component":2
    }
  ]
  const cloudImpactOptionsMock = [
    {
      // eslint-disable-next-line max-len
      description: "Accommodates DoD information approved for public release (Low Confidentiality and Moderate Integrity)",
      id: "IL2",
      label: "Unclassified / Impact Level 2 (IL2)",
      value: "2"
    },
    {
      description: "Accommodates DoD Controlled Unclassified Information (CUI)",
      id: "IL4",
      label: "Unclassified / Impact Level 4 (IL4)",
      value: "1"
    }
  ]
  const actions = {
    // all: vi.fn(),
    handler: {get: vi.fn(),},
    getAllClassificationLevels: vi.fn().mockResolvedValue(
      [{impact_level: '',
        classification: 'TS'}],
    ),
    saveClassifiedInformationTypes: vi.fn(),
    loadSelectedClassificationLevelsByAqId: vi.fn(),
    getCDSInIGCEEstimateTable: vi.fn(),
    loadCdsSolutionByPackageId: vi.fn(),
    deleteClassificationLevels: vi.fn(),
    deleteTrainingEstimates: vi.fn(),
    deleteSelectedServiceOfferingsClassificationInstances: vi.fn(),
    addCurrentSelectedClassLevelListToDB: vi.fn()
  }
  const mockStore = createStore({
    modules: {
      classificationRequirements: {
        namespaced: true,
        actions
      }
    }
  })
  const wrapper = shallowMount(ClassificationLevelForm, {
    props: {
      isHybrid: false, 
      hybridText: 'hybridText'
    },
    // data() {
    //   return {
    //     allClassificationLevels: [{
    //       impact_level: 'IL6',
    //       classification: 'S'
    //     },{impact_level: '',
    //       classification: 'TS'}],
    //     //getAllClassificationLevels: vi.fn()
    //   }
    // },
    global: {
      plugins: [mockStore,validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  beforeEach(() => {
    // wrapper.setData({
    //   allClassificationLevels: [{
    //     impact_level: 'IL6',
    //     classification: 'S'
    //   },{impact_level: '',
    //     classification: 'TS'}]
    // })
    classificationRequirements.getAllClassificationLevels()
    vi.spyOn(classificationRequirements, 'loadClassificationLevels')
      .mockImplementation(()=> Promise.resolve())
    // vi.spyOn(classificationRequirements, 'getAllClassificationLevels').mockImplementation(
    //   () => Promise.resolve(classificationsMock)
    // );

    wrapper.setProps({selectedClassifications:["1","2"]})
  });

  it.only("renders successfully", async () => {
    console.log(2)
    expect(wrapper.exists()).toBe(true);
  });

  it("Get impact level when isCloud is true", async () => {
    await wrapper.setProps({isCloud:true})
    const impactLevelId = vm.impactLevelId
    expect(impactLevelId).toBe("CloudClassificationCheckboxes");
  });
  it("Get impact level when isCloud is false", async () => {
    await wrapper.setProps({isCloud:false})
    const impactLevelId = vm.impactLevelId
    expect(impactLevelId).toBe("OnPremClassificationCheckboxes");
  });
  it("Get impact level error message when isCloud is true", async () => {
    await wrapper.setProps({isCloud:true})
    const impactLevelError = vm.impactLevelErrorMessage
    expect(impactLevelError).toBe("Please select at least one impact level.");
  });
  it("Get impact level error message when isCloud is false", async () => {
    await wrapper.setProps({isCloud:false})
    const impactLevelError = vm.impactLevelErrorMessage
    expect(impactLevelError)
      .toBe("Please select at least one type of information that you are hosting.");
  });
  it.skip("Get impact level Options when isCloud is true", async () => {
    await wrapper.setProps({isCloud:true})
    const impactLevelError = vm.impactLevelOptions
    expect(impactLevelError).toStrictEqual(cloudImpactOptionsMock);
  });
  it.skip("Get impact level Options when isCloud is false", async () => {
    await wrapper.setProps({isCloud:false})
    const impactLevelError = vm.impactLevelOptions
    expect(impactLevelError)
      .toStrictEqual(onPremImpactOptions);
  });

  it("testing watcher 'selectedTopLevelClassification'", async () => {
    await wrapper.setData({selectedTopLevelClassifications:[]})
    await vm.$nextTick()
    vm.$data.selectedTopLevelClassifications = ["U","TS"]
    await vm.$nextTick()
    const selectedTopLevelClassification = vm.$data.selectedTopLevelClassifications
    expect(selectedTopLevelClassification).toStrictEqual(["U","TS"]);
  });
  it("testing watcher 'selectedImpactLevels' newVal > oldVal", async () => {
    await wrapper.setData({selectedImpactLevels:[]})
    await vm.$nextTick()
    vm.$data.selectedImpactLevels = ["1","2"]
    await vm.$nextTick()
    const selectedImpactLevels = vm.$data.selectedImpactLevels
    expect(selectedImpactLevels).toStrictEqual(["1","2"]);
  });
  it("testing watcher 'selectedImpactLevels' oldVal > newVal", async () => {
    await wrapper.setData({selectedImpactLevels:["1","2"]})
    await vm.$nextTick()
    vm.$data.selectedImpactLevels = ["1"]
    await vm.$nextTick()
    const selectedImpactLevels = vm.$data.selectedImpactLevels
    expect(selectedImpactLevels).toStrictEqual(["1"]);
  });

})
