/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import ClassificationLevelForm
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelForm.vue";
import validators from "../../../plugins/validation";
import classificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";



describe("Testing CurrentEnvironment Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

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

  beforeEach(() => {
    jest.spyOn(classificationRequirements, 'getAllClassificationLevels').mockImplementation(
      () => Promise.resolve(classificationsMock)
    );
    vuetify = new Vuetify();
    wrapper = mount(ClassificationLevelForm, {
      localVue,
      vuetify,
    });
    wrapper.setProps({selectedClassifications:["1","2"]})
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Get impact level when isCloud is true", async () => {
    await wrapper.setProps({isCloud:true})
    const impactLevelId = wrapper.vm.impactLevelId
    expect(impactLevelId).toBe("CloudClassificationCheckboxes");
  });
  it("Get impact level when isCloud is false", async () => {
    await wrapper.setProps({isCloud:false})
    const impactLevelId = wrapper.vm.impactLevelId
    expect(impactLevelId).toBe("OnPremClassificationCheckboxes");
  });
  it("Get impact level error message when isCloud is true", async () => {
    await wrapper.setProps({isCloud:true})
    const impactLevelError = wrapper.vm.impactLevelErrorMessage
    expect(impactLevelError).toBe("Please select at least one impact level.");
  });
  it("Get impact level error message when isCloud is false", async () => {
    await wrapper.setProps({isCloud:false})
    const impactLevelError = wrapper.vm.impactLevelErrorMessage
    expect(impactLevelError)
      .toBe("Please select at least one type of information that you are hosting.");
  });
  it("Get impact level Options when isCloud is true", async () => {
    await wrapper.setProps({isCloud:true})
    const impactLevelError = wrapper.vm.impactLevelOptions
    expect(impactLevelError).toStrictEqual(cloudImpactOptionsMock);
  });
  it("Get impact level Options when isCloud is false", async () => {
    await wrapper.setProps({isCloud:false})
    const impactLevelError = wrapper.vm.impactLevelOptions
    expect(impactLevelError)
      .toStrictEqual(onPremImpactOptions);
  });

  it("testing watcher 'selectedTopLevelClassification'", async () => {
    await wrapper.setData({selectedTopLevelClassifications:[]})
    await Vue.nextTick()
    wrapper.vm.$data.selectedTopLevelClassifications = ["U","TS"]
    await Vue.nextTick()
    const selectedTopLevelClassification = wrapper.vm.$data.selectedTopLevelClassifications
    expect(selectedTopLevelClassification).toStrictEqual(["U","TS"]);
  });
  it("testing watcher 'selectedImpactLevels' newVal > oldVal", async () => {
    await wrapper.setData({selectedImpactLevels:[]})
    await Vue.nextTick()
    wrapper.vm.$data.selectedImpactLevels = ["1","2"]
    await Vue.nextTick()
    const selectedImpactLevels = wrapper.vm.$data.selectedImpactLevels
    expect(selectedImpactLevels).toStrictEqual(["1","2"]);
  });
  it("testing watcher 'selectedImpactLevels' oldVal > newVal", async () => {
    await wrapper.setData({selectedImpactLevels:["1","2"]})
    await Vue.nextTick()
    wrapper.vm.$data.selectedImpactLevels = ["1"]
    await Vue.nextTick()
    const selectedImpactLevels = wrapper.vm.$data.selectedImpactLevels
    expect(selectedImpactLevels).toStrictEqual(["1"]);
  });


})
