import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import form  from "@/documentReview/Form.vue";
import validators from "../plugins/validation";
import ContactData from "@/store/contactData";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { ContactDTO, MilitaryRankDTO } from "@/api/models";
Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  /* eslint-disable camelcase */

  beforeEach(async () => {

    jest.spyOn(ContactData, 'LoadMilitaryBranches').mockImplementation(
      ()=>Promise.resolve([{ name: "foo", label: "bar", value: "baz"}]));

    const rank: MilitaryRankDTO = { name: "this", grade: "that", branch: "other" };     
    jest.spyOn(ContactData, 'GetMilitaryRank').mockReturnValue(
      new Promise(resolve => resolve(rank))
    );

    const contact: ContactDTO = {
      type: "",
      role: "",
      rank_components: "",
      salutation: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      formal_name: "",
      suffix: "",
      title: "",
      phone: "",
      phone_extension: "",
      email: "",
      grade_civ: "",
      dodaac: "",
      can_access_package: "",
      manually_entered: "",    
    }

    jest.spyOn(AcquisitionPackage, 'loadContactInfo').mockImplementation(
      () => Promise.resolve(contact)); 

    vuetify = new Vuetify();
    wrapper = mount(form, {
      localVue,
      vuetify,
      propsData:{
        docData:{
          projectOverview:{
            title: "title",
            scope: "scope",
            emergency_declaration: "Yes"
          },
          organization: {},
          fairOpportunity: {
            exception_to_fair_opportunity: "",
          },      
          currentContract: {
            current_contract_exists: "true"
          },
          cor: contact,
          acor: contact,
        }
      }
    });
   
  });

  it("renders successfully", async () => {
    expect(await wrapper.exists()).toBe(true);
  });

  // it("sets COR dodaac value", async () => {
  //   wrapper.vm.$data._docData = {};
  //   wrapper.vm.$data._docData.cor = {};
  //   wrapper.vm.$data._docData.cor.dodaac = "bar";
  //   await wrapper.vm.dodaacChange("foo", "COR");
  //   expect(await wrapper.vm.$data._docData.cor.dodaac).toBe("foo");
  // });

  // it("sets ACOR dodaac value", async () => {
  //   await wrapper.vm.dodaacChange("foo", "ACOR");
  //   expect(wrapper.vm.$data._docData.acor.dodaac).toBe("foo");
  // });


})

