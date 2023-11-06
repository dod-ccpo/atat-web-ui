/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import AcorInfo from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/AcorInfo.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";
import {ContactDTO} from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";

describe("Testing AcorInfo Component", () => {


  const mockCurrentDontactData: ContactDTO = {
    grade_civ: "",
    role: "",
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
    role: "",
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
  let wrapper: VueWrapper
  let vm: typeof wrapper.vm.$options
  beforeEach(() => {
    vi.spyOn(ContactData, 'initialize').mockImplementation(
      () => Promise.resolve()
    );

    wrapper = shallowMount(AcorInfo, {
      props: {
        
      },
      global: {
        plugins: [validators]
      }
    })
    vm =  (wrapper.vm as typeof wrapper.vm.$options)

    wrapper.setData({
      currentContractData: mockCurrentDontactData,
      savedContractData: mockSavedDontactData
    })

  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("saveOnLeave() - should call the store and save if any data changes", async () => {
    vi.spyOn(AcquisitionPackage, 'saveContactInfo').mockImplementation(
      () => Promise.resolve()
    );
 
    await wrapper.setData({
      currentContactData: {
        role: "ROLE_UPDATED"
      }
    })
    const saveOnLeave = await vm.saveOnLeave();
    expect(saveOnLeave).toBe(true)
  })
})
