/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import PersonCard from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/PersonCard.vue";
import validators from "../../../plugins/validation";
import {CorAcorSelectData} from "../../../../types/Global";
import {ContactDTO} from "@/api/models";

Vue.use(Vuetify);

describe("Testing PersonCard Component", () => {
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const localVue = createLocalVue();
  localVue.use(validators);
  
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
  }

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PersonCard, {
      propsData: {
        selectedContact: mockCorAcorSelectData,
        showContactForm: false
      },
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

  it("removeCorInfo() - should remove the core info", async () => {
    await wrapper.vm.removeCorInfo();
    expect(wrapper.vm._showContactForm).toBe(false);
  });

  it("corOrAcor() should get the cor or acor mode",
    async () => {
      let _corOrAcor = await wrapper.vm.corOrAcor;
      expect(_corOrAcor).toBe("COR");
      await wrapper.setProps({
        isACOR: true
      })
      _corOrAcor = await wrapper.vm.corOrAcor;
      expect(_corOrAcor).toBe("ACOR");
    });
})
