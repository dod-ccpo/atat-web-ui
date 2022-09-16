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
    vuetify = new Vuetify();
    wrapper = mount(DocumentReview, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("showView('form') - set $displayView to `form`", async () => {
    await wrapper.vm.showView('form')
    expect(wrapper.vm.$data.displayView).toBe('form');
  });

  it("showView('') - set $displayView to `form`", async () => {
    await wrapper.vm.showView('')
    expect(wrapper.vm.$data.displayView).toBe('form');
  });
 

  it("get panelContent() - ensure panelContent returns component", async () => {
    const loadedComponent = await wrapper.vm.panelContent as Vue.Component;
    expect(loadedComponent.name).toBe("CommentsPanel");
  });

  it("mounted() - ensure $data.displayView===form", async()=>{
    console.log('hi tony')
    expect(await wrapper.vm.$data.displayView).toBe('form');
  })

  it("loadOnEnter - returns storeData successfully", async()=>{
    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      ()=>Promise.resolve({
        "scope": "scope goes here",
        "title": "title goes here",
        "emergency_declaration": "true"
      })
    );

    jest.mock("@/store/acquisitionPackage", () => ({
      initialize: jest.fn(),
      ensureInitialized: jest.fn()
    }));
    await wrapper.vm.loadOnEnter();  
    expect(await wrapper.vm.$data.currentTitle).toBe("title goes here");
    expect(await wrapper.vm.$data.emergencyDeclaration ).toBe("yes");
  })

});