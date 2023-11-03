/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import CorInfo from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/CorInfo.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {ContactDTO} from "@/api/models";


describe("Testing CorInfo Component", () => {

  const mockCurrentDontactData: ContactDTO = {
    grade_civ: "",
    role: "TEST_ROLE",
    dodaac: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    type: "",
    can_access_package: "",
    phone: "",
    phone_extension: "",
    rank_components: "",
    salutation: "",
    first_name: "",
    email: "",
    title: "",
    manually_entered: "",
    acquisition_package: ""
  }

  const mockSavedDontactData: ContactDTO = {
    grade_civ: "",
    role: "TEST_ROLE",
    dodaac: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    type: "",
    can_access_package: "",
    phone: "",
    phone_extension: "",
    rank_components: "",
    salutation: "",
    first_name: "",
    email: "",
    title: "",
    manually_entered: "",
    acquisition_package: ""
  }

  const wrapper: VueWrapper = shallowMount(CorInfo, {
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

    vm.$data.currentContactData = mockCurrentDontactData;
    vm.$data.savedContactData = mockSavedDontactData;
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("saveOnLeave() - should call the store and save if any data changes", async () => {
    vi.spyOn(AcquisitionPackage, 'saveContactInfo').mockImplementation(
      () => Promise.resolve()
    );
    vm.$data.currentContactData.role = "ROLE_UPDATED"
    await vm.saveOnLeave();
    expect(AcquisitionPackage.saveContactInfo).toHaveBeenCalled();
  });
})
