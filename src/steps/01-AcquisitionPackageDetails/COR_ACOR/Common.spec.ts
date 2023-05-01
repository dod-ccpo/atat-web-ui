/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Common from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/Common.vue";
import validators from "../../../plugins/validation";
import ContactData from "@/store/contactData";
import {ContactDTO, MilitaryRankDTO} from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {CorAcorSelectData} from "../../../../types/Global";

Vue.use(Vuetify);

describe("Testing Common Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  const mockSystemChoiceDTO1 = {
    sys_id: "SC_1",
    name: "SC1 Test Name",
    label: "SC1 Test Label",
    value: "SC1_BRANCH",
    sequence: 1,
    hint: "SC1 Test Hint"
  }
  const mockSystemChoiceDTO2 = {
    sys_id: "SC_2",
    name: "SC2 Test Name",
    label: "SC2 Test Label",
    value: "SC2_BRANCH",
    sequence: 2,
    hint: "SC2 Test Hint"
  }

  const mockContactDTO: ContactDTO = {
    sys_id: "CON_1",
    first_name: "",
    last_name: "",
    middle_name: "",
    role: "MILITARY",
    rank_components: "RANK_1",
    suffix: "",
    salutation: "",
    phone: "111-111-1111",
    phone_extension: "",
    email: "test.adamson-civ@mail.mil",
    type: "Primary Contact",
    dodaac: "",
    can_access_package: "true",
    grade_civ: "",
    title: "",
    manually_entered: "", // not used on Primary Contact contact entry form
  };

  const mockMilitaryRankDTO: MilitaryRankDTO = {
    name: "TEST RANK NAME",
    grade: "TEST GRADE",
    branch: "SC1_BRANCH"
  }

  const mockCorAcorSelectData: CorAcorSelectData = {
    id: "TEST_COR_ACOR_ID",
    firstName: "TEST COR_ACOR_FN",
    lastName: "TEST COR_ACOR_LN",
    fullName: "TEST COR_ACOR_FULL",
    email: "TEST COR_ACOR_EMAIL",
    phone: "TEST COR_ACOR_PH",
    orgName: "TEST COR_ACOR_ON"
  }

  beforeEach(() => {
    jest.spyOn(ContactData, 'LoadMilitaryBranches').mockImplementation(
      () => Promise.resolve([mockSystemChoiceDTO1, mockSystemChoiceDTO2])
    );
    jest.spyOn(AcquisitionPackage, 'getContact').mockImplementation(
      () => Promise.resolve(mockContactDTO)
    );
    jest.spyOn(ContactData, 'GetMilitaryRank').mockImplementation(
      () => Promise.resolve(mockMilitaryRankDTO)
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
      .toBe("RANK_1");
  });

  it("selectedContactChange() - sets the component properties as expected", async () => {
    await wrapper.vm.selectedContactChange(null);
    expect(await wrapper.vm.$data.firstName)
      .toBe("");
    await wrapper.vm.selectedContactChange(mockCorAcorSelectData);
  });

  it("toggleContactForm() - toggles the contact form", async () => {
    expect(await wrapper.vm.$data.showContactForm).toBe(false);
    await wrapper.vm.toggleContactForm();
    expect(await wrapper.vm.$data.showContactForm).toBe(true);
  });

  it("autocompleteInputUpdate() - resets the boolean that shows contact form", async () => {
    await wrapper.vm.autocompleteInputUpdate(false);
    expect(await wrapper.vm.$data.showContactForm).toBe(false);
    await wrapper.vm.autocompleteInputUpdate(true);
    expect(await wrapper.vm.$data.showContactForm).toBe(true);
  });

  it("getter corOrAcor() should get the cor or acor mode",
    async () => {
      await wrapper.setProps({
        isACOR: true
      })
      let _corOrAcor = await wrapper.vm.corOrAcor;
      expect(_corOrAcor).toBe("ACOR");
      await wrapper.setProps({
        isACOR: false
      })
      _corOrAcor = await wrapper.vm.corOrAcor;
      expect(_corOrAcor).toBe("COR");
    });

  it("getter getRules() should get rules based on whether the contact form is open or closed",
    async () => {
      await wrapper.setData({
        showContactForm: true
      })
      let _getRules = await wrapper.vm.getRules;
      expect(_getRules.length).toBe(0);
      await wrapper.setData({
        showContactForm: false
      })
      _getRules = await wrapper.vm.getRules;
      expect(_getRules.length).toBe(1);
    });
})
