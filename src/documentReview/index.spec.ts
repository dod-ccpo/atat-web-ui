import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import DocumentReview from "@/documentReview/Index.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import validators from "../plugins/validation";
import ContactData from "@/store/contactData";
import { ContactDTO, MilitaryRankDTO } from "@/api/models";

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuetify);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {

    jest.spyOn(ContactData, 'LoadMilitaryBranches').mockImplementation(
      ()=>Promise.resolve([{ name: "foo", label: "bar", value: "baz"}]));

    const rank: MilitaryRankDTO = { name: "this", grade: "that", branch: "other" };     
    jest.spyOn(ContactData, 'GetMilitaryRank').mockReturnValue(
      new Promise(resolve => resolve(rank))
    );
  
    /* eslint-disable camelcase */

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

    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      ()=>Promise.resolve({
        "scope": "scope goes here",
        "title": "title goes here",
        "emergency_declaration": "true",
        "exception_to_fair_opportunity": "YES",
      })
    );

    jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      ()=>Promise.resolve()
    );

    jest.spyOn(AcquisitionPackage, 'saveContactInfo').mockImplementation(
      ()=>Promise.resolve()
    );

    vuetify = new Vuetify();
    wrapper = mount(DocumentReview, {
      localVue,
      vuetify,
      propsData: {
        docData: {
          projectOverview: {
            title: "",
            scope: "",
            emergency_declaration: "",
          },
          organization: {},
          fairOpportunity: {
            exception_to_fair_opportunity: "",
          },
          currentContract: {},
          cor: contact,    
          acor: contact    
        },
        savedDocData: {
          projectOverview: {
            title: "",
            scope: "",
            emergency_declaration: "",
          },
          organization: {},
          fairOpportunity: {
            exception_to_fair_opportunity: "",
          },
          currentContract: {},
          cor: contact,    
          acor: contact    
        }
  
      }
    });

  });

  afterEach(()=>{
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("showView('form') - set $data.displayView to `form`", async () => {
    await wrapper.vm.showView('form')
    expect(wrapper.vm.$data.displayView).toBe('form');
  });

  it("showView('') - set $data.displayView to `form`", async () => {
    await wrapper.vm.showView('')
    expect(wrapper.vm.$data.displayView).toBe('form');
  });
 

  it("get panelContent() - ensure panelContent returns component", async () => {
    const loadedComponent = await wrapper.vm.panelContent as Vue.Component;
    expect(loadedComponent.name).toBe("CommentsPanel");
  });

  it("mounted() - ensure $data.displayView===form", async()=>{
    expect(await wrapper.vm.$data.displayView).toBe('form');
  })

  it("loadOnEnter - returns storeData successfully", async()=>{
    await wrapper.vm.loadOnEnter();  
    expect(await wrapper.vm.$data.docData.projectOverview.title).toBe("title goes here");
    expect(await wrapper.vm.$data.docData.projectOverview.emergency_declaration ).toBe("true");
  })

  it("saveOnLeave() - projectOverview - compare a diff $data.docData and $doc.savedDocData " +
    "to ensure section is in $data.docDataSectonsToSave", async()=>{
    wrapper.vm.$data.docData.projectOverview.title = "foo";
    wrapper.vm.$data.savedDocData.projectOverview.title = "bar";

    await wrapper.vm.saveOnLeave();
    expect(await wrapper.vm.$data.docDataSectionsToSave.some(
      (section: string) => section === "projectOverview"
    )).toBe(true)
  })

  it("saveOnLeave() - COR - compare a diff $data.docData and $doc.savedDocData " +
  "to ensure section is in $data.docDataSectonsToSave", async()=>{
    wrapper.vm.$data.docData.cor.dodaac = "foo";
    wrapper.vm.$data.savedDocData.cor.dodaac = "bar";

    await wrapper.vm.saveOnLeave();
    expect(await wrapper.vm.$data.docDataSectionsToSave.some(
      (section: string) => section === "cor"
    )).toBe(true)
  })
  it("saveOnLeave() - ACOR - compare a diff $data.docData and $doc.savedDocData " +
  "to ensure section is in $data.docDataSectonsToSave", async()=>{
    wrapper.vm.$data.docData.acor.dodaac = "foo";
    wrapper.vm.$data.savedDocData.acor.dodaac = "bar";

    await wrapper.vm.saveOnLeave();
    expect(await wrapper.vm.$data.docDataSectionsToSave.some(
      (section: string) => section === "acor"
    )).toBe(true)
  })


  it("saveOnLeave() - COR - compare a diff $data.docData and $doc.savedDocData " +
  "to ensure section is in $data.docDataSectonsToSave", async()=>{
    wrapper.vm.$data.docData.cor.dodaac = "foo";
    wrapper.vm.$data.savedDocData.cor.dodaac = "bar";

    await wrapper.vm.saveOnLeave();
    expect(await wrapper.vm.$data.docDataSectionsToSave.some(
      (section: string) => section === "cor"
    )).toBe(true)
  })


  it("saveOnLeave() - trigger switch() default", async()=>{
    await wrapper.setData({
      docDataSectionsToSave:[
        "projectOverview", 
        "organization", 
        "fairOpportunity", 
        "currentContract"
      ]
    })
    const _saveOnLeave = await wrapper.vm.saveOnLeave();
    expect(_saveOnLeave).toBe(true)
  })

});
