/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import PersonCard from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/PersonCard.vue";
import validators from "../../../plugins/validation";
import {CorAcorSelectData} from "../../../../types/Global";
import {ContactDTO} from "@/api/models";


describe("Testing PersonCard Component", () => {
  
  const mockCorAcorSelectData: CorAcorSelectData = {
    id: "COR_ACOR_ID",
    firstName: "Test FN",
    lastName: "Test LN",
    fullName: "Test FullN",
    email: "test@mail.mil",
    phone: "111-111-3213",
    orgName: "Test Org Name",
  }

  const mockCorInfo: ContactDTO = {
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
  const wrapper: VueWrapper = shallowMount(PersonCard, {
    props: {
      selectedContact: mockCorAcorSelectData,
      showContactForm: false
    },
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("removeCorInfo() - should remove the core info", async () => {
    await vm.removeCorInfo();
    expect(vm._showContactForm).toBe(false);
  });

  it("corOrAcor() should get the cor or acor mode",
    async () => {
      let _corOrAcor = await vm.corOrAcor;
      expect(_corOrAcor).toBe("COR");
      await wrapper.setProps({
        isACOR: true
      })
      _corOrAcor = await vm.corOrAcor;
      expect(_corOrAcor).toBe("ACOR");
    });
})
