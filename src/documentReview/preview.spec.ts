import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import preview  from "@/documentReview/Preview.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(preview, {
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
      initialize: ()=>Promise.resolve(),
      ensureInitialized: ()=>Promise.resolve(),
    }));
    await AcquisitionPackage.setInitialized(true);
    await wrapper.vm.loadOnEnter();  
    expect(await wrapper.vm.$data.currentTitle).toBe("title goes here");
  })

})
