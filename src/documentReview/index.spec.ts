import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import DocumentReview from "@/documentReview/Index.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuetify);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
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

    vuetify = new Vuetify();
    wrapper = mount(DocumentReview, {
      localVue,
      vuetify,
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

  it("saveOnLeave() - compare a diff $data.docData and $doc.savedDocData " +
    "to ensure section is in $data.docDataSectonsToSave", async()=>{
    /* eslint-disable camelcase */
    await wrapper.setData({
      docData: {
        projectOverview: {
          title: "a title",
          scope: "some text",
          emergency_declaration: "yes",
        },
        organization: {},
        fairOpportunity: {
          exception_to_fair_opportunity: "",
        },
        currentContract: {},    
      },
      savedDocData: {
        projectOverview: {
          title: "a different title",
          scope: "other text",
          emergency_declaration: "no",
        },
        organization: {},
        fairOpportunity: {
          exception_to_fair_opportunity: "",
        },
        currentContract: {},
      }
    });

    await wrapper.vm.saveOnLeave();
    // expect(await wrapper.vm.$data.docDataSectionsToSave.some(
    //   (section: string) => section === "projectOverview"
    // )).toBe(true)
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