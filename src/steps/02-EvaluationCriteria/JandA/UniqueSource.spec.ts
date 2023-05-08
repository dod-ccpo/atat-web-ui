/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import UniqueSource from "@/steps/02-EvaluationCriteria/JandA/UniqueSource.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {FairOpportunityDTO} from "@/api/models";

Vue.use(Vuetify);

describe("Testing UniqueSource Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {
    jest.spyOn(ContactData, 'initialize').mockImplementation(
      () => Promise.resolve()
    );

    vuetify = new Vuetify();
    wrapper = mount(UniqueSource, {
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

  it("btnRestoreIconColor() - should return the color based on whether the default" +
    "text is modified or not", async () => {
    expect(await wrapper.vm.restoreIconColor).toBe("disabled");
    wrapper.vm.$data.uniqueSourceExplanation = "AWS is the only capable CSP"
    expect(wrapper.vm.restoreIconColor).toBe("primary");
  });

  it("isMinGovReqExpDefaultUnmodified() - should return the appropriate boolean if the default" +
    "text is modified", async () => {
    expect(await wrapper.vm.isMinGovReqExpDefaultUnmodified).toBe(true);
    wrapper.vm.$data.uniqueSourceExplanation = "Some modification"
    expect(wrapper.vm.isMinGovReqExpDefaultUnmodified).toBe(false);
  });

  it("onRestoreMinGovReqExpClick() - should set the correct component property " +
    "such that the modal gets opened", async () => {
    wrapper.vm.onRestoreMinGovReqExpClick();
    expect(wrapper.vm.$data.showRestoreModal).toBe(true);
  });

  it("okClicked() - should reset few component data properties", async () => {
    wrapper.vm.$data.uniqueSourceExplanation = "Some modification"
    expect(wrapper.vm.$data.turnRulesOff).toBe(false);
    expect(wrapper.vm.$data.uniqueSourceExplanation)
      .not.toBe(wrapper.vm.$data.suggestedText);

    wrapper.vm.okClicked();
    expect(wrapper.vm.$data.turnRulesOff).toBe(true);
    expect(wrapper.vm.$data.uniqueSourceExplanation)
      .toBe(wrapper.vm.$data.suggestedText);
    expect(wrapper.vm.$data.showRestoreModal).toBe(false);
  });

  it("setSuggestedText() - should set the suggested text dynamically" +
    " based on the CSP chosen", async () => {
    wrapper.vm.$data.csp = "Some CSP";
    wrapper.vm.setSuggestedText();
    expect(wrapper.vm.$data.suggestedText.indexOf("Some CSP")).toBe(0);
  });

  it("cancelClicked() - should set the data such that the modal gets closed", async () => {
    wrapper.vm.$data.showRestoreModal = true;
    wrapper.vm.cancelClicked();
    expect(wrapper.vm.$data.showRestoreModal).toBe(false);
  });

  it("savedData() - should get the saved data", async () => {
    await AcquisitionPackage.setFairOpportunity({
      why_csp_is_only_capable_source: "AWS is the only capable CSP"
    })
    expect(wrapper.vm.savedData.why_csp_is_only_capable_source)
      .toBe("AWS is the only capable CSP");
  });

  it("currentData() - should get the current data of the component", async () => {
    wrapper.vm.$data.uniqueSourceExplanation = "Some modification";
    expect(wrapper.vm.currentData.why_csp_is_only_capable_source)
      .toBe("Some modification");
  });

  it("hasChanged() - should check if the current data has changed from the " +
    "saved data and return a boolean", async () => {
    expect(wrapper.vm.hasChanged()).toBe(false);
    wrapper.vm.$data.uniqueSourceExplanation = "Some modification";
    expect(wrapper.vm.hasChanged()).toBe(true);
  });

  it("saveOnLeave() - should call the store and save if any data changes", async () => {
    jest.spyOn(AcquisitionPackage, 'setFairOpportunity').mockImplementation(
      () => Promise.resolve()
    );
    wrapper.vm.$data.uniqueSourceExplanation = "Some modification";
    await wrapper.vm.saveOnLeave();
    expect(AcquisitionPackage.setFairOpportunity).toHaveBeenCalled();
  });

  it("loadOnEnter() - should load the fair opportunity data and set several" +
    "component data properties based on the loaded data", async () => {
    await AcquisitionPackage.setFairOpportunity({
      why_csp_is_only_capable_source: undefined,
      proposed_csp: undefined,
      exception_to_fair_opportunity: "NOT-VALID-VALUE"
    })
    const fairOpportunity = AcquisitionPackage.fairOpportunity as FairOpportunityDTO;
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.csp).toBe("this CSP");
    expect(wrapper.vm.$data.cspAdditionalInstructions)
      .toBe("the chosen source");
    expect(wrapper.vm.$data.showLogicalFollowOnInstructions)
      .toBe(false);
    fairOpportunity.why_csp_is_only_capable_source =
      "AWS is the only capable CSP";
    fairOpportunity.proposed_csp = "AWS";
    fairOpportunity.exception_to_fair_opportunity = "YES_FAR_16_505_B_2_I_C";
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.csp).toBe("AWS");
    expect(wrapper.vm.$data.cspAdditionalInstructions)
      .toBe("AWS");
    expect(wrapper.vm.$data.showLogicalFollowOnInstructions)
      .toBe(true);
  });
})
