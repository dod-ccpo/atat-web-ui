import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ProjectOverview from "@/steps/01-AcquisitionPackageDetails/ProjectOverview.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProjectOverview, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

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
  })

  it("getForm() returns Vue component with validate() function", async() =>{
    const vueComponent = await wrapper.vm.Form;
    expect(vueComponent.validate()).toBe(true);
  })

  it("validateForm() returns Vue component", async() =>{
    jest.
  })

})

