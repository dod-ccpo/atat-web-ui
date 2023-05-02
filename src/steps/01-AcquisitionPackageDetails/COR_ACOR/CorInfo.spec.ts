/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CorInfo from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/CorInfo.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {ContactDTO} from "@/api/models";

Vue.use(Vuetify);

describe("Testing CorInfo Component", () => {
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const localVue = createLocalVue();
  localVue.use(validators);

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
  }

  beforeEach(() => {
    jest.spyOn(ContactData, 'initialize').mockImplementation(
      () => Promise.resolve()
    );

    vuetify = new Vuetify();
    wrapper = mount(CorInfo, {
      vuetify,
      localVue
    });

    wrapper.vm.$data.currentContactData = mockCurrentDontactData;
    wrapper.vm.$data.savedContactData = mockSavedDontactData;
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("saveOnLeave() - should call the store and save if any data changes", async () => {
    jest.spyOn(AcquisitionPackage, 'saveContactInfo').mockImplementation(
      () => Promise.resolve()
    );
    wrapper.vm.$data.currentContactData.role = "ROLE_UPDATED"
    await wrapper.vm.saveOnLeave();
    expect(AcquisitionPackage.saveContactInfo).toHaveBeenCalled();
  });
})
