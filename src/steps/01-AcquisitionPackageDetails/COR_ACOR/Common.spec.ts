/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Common from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/Common.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";
import {ContactDTO} from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";

Vue.use(Vuetify);

describe("Testing Common Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  const mockSystemChoiceDTO1 = {
    sys_id: "SC1_1",
    name: "SC1 Test Name",
    label: "SC1 Test Label",
    value: "SC1 Test Value",
    sequence: 1,
    hint: "SC1 Test Hint"
  }
  const mockSystemChoiceDTO2 = {
    sys_id: "SC_2",
    name: "SC2 Test Name",
    label: "SC2 Test Label",
    value: "SC2 Test Value",
    sequence: 2,
    hint: "SC2 Test Hint"
  }

  const mockContactDTO: ContactDTO = {
    sys_id: "CON_1",
    first_name: "",
    last_name: "",
    middle_name: "",
    role: "MILITARY",
    rank_components: { link: "TEST LINK", value: "RANK_1" } as unknown as string,
    suffix: "",
    salutation: "",
    phone: "",
    phone_extension: "",
    email: "",
    type: "Primary Contact",
    dodaac: "",
    can_access_package: "true",
    grade_civ: "",
    title: "",
    manually_entered: "", // not used on Primary Contact contact entry form
  };

  beforeEach(() => {
    jest.spyOn(ContactData, 'LoadMilitaryBranches').mockImplementation(
      () => Promise.resolve([mockSystemChoiceDTO1, mockSystemChoiceDTO2])
    );
    jest.spyOn(AcquisitionPackage, 'getContact').mockImplementation(
      () => Promise.resolve(mockContactDTO)
    );

    vuetify = new Vuetify();
    wrapper = mount(Common, {
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

  it("loadOnEnter() - returns storeData and sets other data successfully", async () => {
    await wrapper.vm.loadOnEnter();
    expect(await wrapper.vm.$data.branchData[0]['text'])
      .toBe("U.S. " + mockSystemChoiceDTO1.label);
    expect(await wrapper.vm.$data.selectedRole)
      .toBe("MILITARY");
    expect(await wrapper.vm.$data.savedData.rank_components)
      .toBe("MILITARY");
  });
})
