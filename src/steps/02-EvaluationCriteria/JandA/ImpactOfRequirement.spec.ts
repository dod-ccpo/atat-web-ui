/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ImpactOfRequirement from "@/steps/02-EvaluationCriteria/JandA/impactOfRequirement.vue";
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {FairOpportunityDTO} from "@/api/models";

Vue.use(Vuetify);

describe("Testing impactOfRequirement Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ImpactOfRequirement, {
      vuetify,
      localVue
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("savedData() - should get the saved data", async () => {
    await AcquisitionPackage.setFairOpportunity({
      requirement_impact: "Test impact of requirement description"
    })
    expect(wrapper.vm.savedData.requirement_impact)
      .toBe("Test impact of requirement description");
  });

  it("currentData() - should get the current data of the component", async () => {
    wrapper.vm.$data.impactOfRequirementExplanation = "Some modification";
    expect(wrapper.vm.currentData.requirement_impact)
      .toBe("Some modification");
  });

  it("hasChanged() - should check if the current data has changed from the " +
    "saved data and return a boolean", async () => {
    expect(wrapper.vm.hasChanged()).toBe(false);
    wrapper.vm.$data.impactOfRequirementExplanation = "Some modification";
    expect(wrapper.vm.hasChanged()).toBe(true);
  });

  it("saveOnLeave() - should call the store and save if any data changes", async () => {
    jest.spyOn(AcquisitionPackage, 'setFairOpportunity').mockImplementation(
      () => Promise.resolve()
    );
    wrapper.vm.$data.impactOfRequirementExplanation = "Some modification";
    await wrapper.vm.saveOnLeave();
    expect(AcquisitionPackage.setFairOpportunity).toHaveBeenCalled();
  });

  it("loadOnEnter() - should load the fair opportunity data and set " +
    "component data properties based on the loaded data", async () => {
    const fairOpportunity = AcquisitionPackage.fairOpportunity as FairOpportunityDTO;
    fairOpportunity.requirement_impact = undefined;
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.impactOfRequirementExplanation)
      .toBe(undefined); // unchanged from initialization
    fairOpportunity.requirement_impact =
      "Test impact of requirement description";
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.impactOfRequirementExplanation)
      .toBe("Test impact of requirement description");
  });
})
