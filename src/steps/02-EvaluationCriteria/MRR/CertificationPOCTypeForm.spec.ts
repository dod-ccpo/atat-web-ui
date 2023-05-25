/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CertificationPOCTypeForm
  from "@/steps/02-EvaluationCriteria/MRR/CertificationPOCTypeForm.vue";
import validators from "../../../plugins/validation";
import {ContactDTO, FairOpportunityDTO, MilitaryRankDTO} from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ContactData from "@/store/contactData";

Vue.use(Vuetify);

describe("Testing CertificationPOCTypeForm Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  const mockPrimaryPOC: ContactDTO = {
    sys_id: "PRIM_1",
    first_name: "PrimFN",
    last_name: "PrimLN",
    middle_name: "",
    role: "MILITARY",
    rank_components: "RANK_1",
    suffix: "",
    salutation: "",
    phone: "111-111-1111",
    phone_extension: "",
    email: "prim@mail.mil",
    type: "PRIMARY",
    dodaac: "",
    can_access_package: "true",
    grade_civ: "",
    title: "Prim1 Title",
    manually_entered: ""
  };

  const mockCorPOC: ContactDTO = {
    sys_id: "COR_1",
    first_name: "CorFN",
    last_name: "CorLN",
    middle_name: "",
    role: "CIVILIAN",
    rank_components: "RANK_1",
    suffix: "",
    salutation: "",
    phone: "222-222-2222",
    phone_extension: "",
    email: "cor@mail.mil",
    type: "COR",
    dodaac: "",
    can_access_package: "true",
    grade_civ: "",
    title: "Cor1 Title",
    manually_entered: ""
  };

  const mockACorPOC: ContactDTO = {
    sys_id: "ACOR_1",
    first_name: "ACorFN",
    last_name: "ACorLN",
    middle_name: "",
    role: "MILITARY",
    rank_components: "RANK_1",
    suffix: "",
    salutation: "",
    phone: "333-333-3333",
    phone_extension: "",
    email: "acor@mail.mil",
    type: "ACOR",
    dodaac: "",
    can_access_package: "true",
    grade_civ: "",
    title: "Acor1 Title",
    manually_entered: ""
  };

  const mockNewTech: ContactDTO = {
    sys_id: "NTECH_1",
    first_name: "NTechFN",
    last_name: "NTechLN",
    middle_name: "",
    role: "CIVILIAN",
    rank_components: "RANK_1",
    suffix: "",
    salutation: "",
    phone: "444-444-4444",
    phone_extension: "",
    email: "ntech@mail.mil",
    type: "NEW",
    dodaac: "",
    can_access_package: "true",
    grade_civ: "",
    title: "NewTech Title",
    manually_entered: ""
  };

  const mockNewReq: ContactDTO = {
    sys_id: "NREQ_1",
    first_name: "NReqFN",
    last_name: "NReqLN",
    middle_name: "",
    role: "CIVILIAN",
    rank_components: "RANK_1",
    suffix: "",
    salutation: "",
    phone: "555-555-5555",
    phone_extension: "",
    email: "nreq@mail.mil",
    type: "NEW",
    dodaac: "",
    can_access_package: "true",
    grade_civ: "",
    title: "NewReq Title",
    manually_entered: ""
  };

  const mockMilitaryBranch1 = {
    sys_id: "MB1",
    name: "MB1 Test Name",
    label: "MB1 Test Label",
    value: "MB1_BRANCH",
    sequence: 1,
    hint: "MB1 Test Hint"
  }
  const mockMilitaryBranch2 = {
    sys_id: "MB2",
    name: "MB2 Test Name",
    label: "MB2 Test Label",
    value: "MB2_BRANCH",
    sequence: 2,
    hint: "MB2 Test Hint"
  }

  const mockMilitaryRankDTO: MilitaryRankDTO = {
    name: "TEST RANK NAME",
    grade: "TEST GRADE",
    branch: "SC1_BRANCH"
  }

  beforeEach(() => {
    jest.spyOn(AcquisitionPackage, 'getContact').mockImplementation(
      (type: string) => {
        if (type === "PRIMARY") {
          return Promise.resolve(mockPrimaryPOC);
        } else if (type === "COR") {
          return Promise.resolve(mockCorPOC);
        } else {
          return Promise.resolve(mockACorPOC);
        }
      }
    );

    jest.spyOn(ContactData, 'getContactBySysId').mockImplementation(
      (sysId: string) => {
        if (sysId === "NTECH_1") {
          return Promise.resolve(mockNewTech);
        } else {
          return Promise.resolve(mockNewReq);
        }
      }
    );

    jest.spyOn(ContactData, 'LoadMilitaryBranches').mockImplementation(
      () => Promise.resolve([mockMilitaryBranch1, mockMilitaryBranch2])
    );

    jest.spyOn(ContactData, 'GetMilitaryRank').mockImplementation(
      () => Promise.resolve(mockMilitaryRankDTO)
    );

    AcquisitionPackage.setFairOpportunity({
      technical_poc_type: "",
      technical_poc: "",
      requirements_poc_type: "",
      requirements_poc: ""
    });

    vuetify = new Vuetify();
    wrapper = mount(CertificationPOCTypeForm, {
      vuetify,
      localVue
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    AcquisitionPackage.setHasAlternateCOR(false);
    wrapper.vm.$data.certificationPOCTypeOptions = [];
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("loadOnEnter() - should make the required callouts and set the form data" +
    " as per the data returned by the store", async () => {
    jest.spyOn(wrapper.vm, 'setContactFormData').mockImplementation(
      () => Promise.resolve()
    );
    (AcquisitionPackage.fairOpportunity as FairOpportunityDTO).technical_poc_type = "PRIMARY";
    await wrapper.vm.loadOnEnter();
    expect(ContactData.getContactBySysId).not.toHaveBeenCalled();
    expect(wrapper.vm.setContactFormData).toHaveBeenCalled();
    (AcquisitionPackage.fairOpportunity as FairOpportunityDTO).technical_poc_type = "NEW";
    (AcquisitionPackage.fairOpportunity as FairOpportunityDTO).technical_poc = "PRIM_1";
    wrapper.vm.$data.certificationPOCTypeOptions = [];
    AcquisitionPackage.setHasAlternateCOR(true);
    await wrapper.vm.loadOnEnter();
    expect(ContactData.getContactBySysId).toHaveBeenCalled();
    expect(wrapper.vm.$data.certificationPOCTypeOptions.length).toBe(4);
    wrapper.vm.$data.certificationPOCTypeOptions = [];
    AcquisitionPackage.setHasAlternateCOR(false);
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.certificationPOCTypeOptions.length).toBe(3);
  });

  it("setPOCPropertyNames() - should override the default POC type mode", async () => {
    expect(wrapper.vm.$data.POCPropName).toBe("technical_poc");
    expect(wrapper.vm.$data.POCTypePropName).toBe("technical_poc_type");
    wrapper.vm.$props.POCType = "Requirements";
    wrapper.vm.setPOCPropertyNames();
    expect(wrapper.vm.$data.POCPropName).toBe("requirements_poc");
    expect(wrapper.vm.$data.POCTypePropName).toBe("requirements_poc_type");
  });

  it("saveOnLeave() - should make appropriate store calls to save the data", async () => {
    await wrapper.vm.loadOnEnter();
    jest.spyOn(ContactData, 'saveContact').mockImplementation(
      (contactDTO: ContactDTO) => {
        if (contactDTO.type === "PRIMARY") {
          return Promise.resolve(mockPrimaryPOC);
        } else if (contactDTO.type === "COR") {
          return Promise.resolve(mockCorPOC);
        } else if (contactDTO.type === "ACOR") {
          return Promise.resolve(mockACorPOC);
        } else {
          return Promise.resolve(mockNewTech);
        }
      }
    );
    jest.spyOn(ContactData, 'deleteContactBySysId').mockImplementation(
      () => Promise.resolve()
    );
    jest.spyOn(AcquisitionPackage, 'setFairOpportunity').mockImplementation(
      () => Promise.resolve()
    );
    await wrapper.vm.saveOnLeave();
    expect(ContactData.saveContact).not.toHaveBeenCalled();

    (AcquisitionPackage.fairOpportunity as FairOpportunityDTO).technical_poc_type = "NEW";
    (AcquisitionPackage.fairOpportunity as FairOpportunityDTO).technical_poc = "NTECH_1";
    wrapper.vm.$data.certificationPOCTypeOptions = [];
    await wrapper.vm.loadOnEnter();
    await wrapper.vm.saveOnLeave();
    expect(ContactData.saveContact).toHaveBeenCalled();
    expect(AcquisitionPackage.setFairOpportunity).toHaveBeenCalled();

    wrapper.vm.$data.certificationPOCType = "PRIMARY"; // user changed NEW to PRIMARY
    (AcquisitionPackage.fairOpportunity as FairOpportunityDTO).technical_poc_type = "NEW";
    await wrapper.vm.saveOnLeave();
    expect(ContactData.deleteContactBySysId).not.toHaveBeenCalled();
  });

  it("get currentContactFormData() - should get the current contact form " +
    "based on the data entered or updated in the form", async () => {
    await wrapper.setData({
      firstName: "SomeFN",
      selectedRank: {sysId: "RankSysId"},
      phone: "1112223333",
      selectedPhoneCountry: {abbreviation: "us"}
    })
    let currentContactDTO: ContactDTO = await wrapper.vm.currentContactFormData;
    expect(currentContactDTO.first_name).toBe("SomeFN");
    expect(currentContactDTO.rank_components).toBe("RankSysId");
    expect(currentContactDTO.phone).toBe("+1 1112223333");
    await wrapper.setData({
      selectedRank: null
    })
    currentContactDTO = await wrapper.vm.currentContactFormData;
    expect(currentContactDTO.rank_components).toBe("");
  });

  it("setContactFormData() - should set the form data using the data " +
    "that gets passed into the function", async () => {
    mockPrimaryPOC.rank_components = {
      link: "https://www.some.url.com",
      value: "RANK_1"
    } as unknown as string;
    wrapper.vm.setContactFormData(mockPrimaryPOC);
    expect(wrapper.vm.$data.sysId).toBe("PRIM_1");
  });
})
