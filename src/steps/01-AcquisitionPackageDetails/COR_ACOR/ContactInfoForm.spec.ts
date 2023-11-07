/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import ContactInfoForm from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/ContactInfoForm.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";



describe("Testing ContactInfoForm Component", () => {
 
  const wrapper: VueWrapper = shallowMount(ContactInfoForm, {
    props: {},
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)
  beforeEach(() => {
    vi.spyOn(ContactData, 'initialize').mockImplementation(
      () => Promise.resolve()
    );
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("contactTypeChange() - should reset the form if loading is complete", async () => {
    vi.spyOn(vm, 'resetData').mockImplementation(
      () => Promise.resolve()
    );
    vm.$data.loaded = true;
    await vm.contactTypeChange();
    expect(vm.resetData).toHaveBeenCalled();
  });

  it("contactTypeChange() - should make a callout to reset the form based on " +
    "whether the loading is complete or not", async () => {
    vi.spyOn(vm, 'resetData').mockImplementation(
      () => Promise.resolve()
    );
    vm.$data.loaded = false;
    await vm.contactTypeChange();
    expect(vm.resetData).not.toHaveBeenCalled();
    vm.$data.loaded = true;
    await vm.contactTypeChange();
    expect(vm.resetData).toHaveBeenCalled();
  });

  it("resetData() - should compile some Vue nextTick operation on form reset", async () => {
    const contactInfoForm = await wrapper.find("CORACORContactForm");
    vm.$props.isForm = true;
    vm.$props.isWizard = true;
    await vm.resetData();
    expect(contactInfoForm).not.toBeNull();
  });
})
