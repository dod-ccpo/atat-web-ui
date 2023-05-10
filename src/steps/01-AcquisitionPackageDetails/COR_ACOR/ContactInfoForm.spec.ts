/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ContactInfoForm from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/ContactInfoForm.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";

Vue.use(Vuetify);

describe("Testing ContactInfoForm Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {
    jest.spyOn(ContactData, 'initialize').mockImplementation(
      () => Promise.resolve()
    );

    vuetify = new Vuetify();
    wrapper = mount(ContactInfoForm, {
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

  it("contactTypeChange() - should reset the form if loading is complete", async () => {
    jest.spyOn(wrapper.vm, 'resetData').mockImplementation(
      () => Promise.resolve()
    );
    wrapper.vm.$data.loaded = true;
    await wrapper.vm.contactTypeChange();
    expect(wrapper.vm.resetData).toHaveBeenCalled();
  });

  it("contactTypeChange() - should make a callout to reset the form based on " +
    "whether the loading is complete or not", async () => {
    jest.spyOn(wrapper.vm, 'resetData').mockImplementation(
      () => Promise.resolve()
    );
    wrapper.vm.$data.loaded = false;
    await wrapper.vm.contactTypeChange();
    expect(wrapper.vm.resetData).not.toHaveBeenCalled();
    wrapper.vm.$data.loaded = true;
    await wrapper.vm.contactTypeChange();
    expect(wrapper.vm.resetData).toHaveBeenCalled();
  });

  it("resetData() - should compile some Vue nextTick operation on form reset", async () => {
    const contactInfoForm = await wrapper.find("CORACORContactForm");
    wrapper.vm.$props.isForm = true;
    wrapper.vm.$props.isWizard = true;
    await wrapper.vm.resetData();
    expect(contactInfoForm).not.toBeNull();
  });
})
