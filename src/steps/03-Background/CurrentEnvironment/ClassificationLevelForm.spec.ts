/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import Vuex from "vuex";
import ClassificationLevelForm
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelForm.vue";
import validators from "../../../plugins/validation";
import AcquisitionPackage, { StoreProperties }
  from "@/store/acquisitionPackage";



describe("Testing CurrentEnvironment Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;
  const store = new Vuex.Store(AcquisitionPackage)

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ClassificationLevelForm, {
      localVue,
      vuetify,
    });
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
    const impactLevelId = wrapper.vm.impactLevelId
    expect(impactLevelId).toBe("Please select at least one impact level.");
  });
  it("Get impact level error message when isCloud is false", async () => {
    await wrapper.setProps({isCloud:false})
    const impactLevelId = wrapper.vm.impactLevelId
    expect(impactLevelId).toBe("Please select at least one type of information that you are hosting.");
  });

})
