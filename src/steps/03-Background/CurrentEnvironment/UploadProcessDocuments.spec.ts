import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import UploadProcessDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadProcessDocuments.vue";


Vue.use(Vuetify);

describe("Testing UploadProcessDocuments Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(UploadProcessDocuments, {
      vuetify,
      localVue
    });
  });

  describe("testing UploadProcessDocuments render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("test hasChanged()", async () => {
      wrapper.vm.$data.currentData = 'test'
      wrapper.vm.$data.savedData = 'test2'
      expect(wrapper.vm.hasChanged()).toBe(true);
    });

    it("test saveOnLeave()", async () => {
      wrapper.vm.$data.hasChanged = true
      wrapper.vm.$data.currentData = {migration_documentation: 'test'}
      const result = AcquisitionPackage.currentEnv.migration_documentation
      jest.spyOn(AcquisitionPackage,"setCurrentEnv")
      wrapper.vm.saveOnLeave()
      Vue.nextTick(()=>{
        expect(result).toBe('test');
      })
    })
    it("test onValueChange",()=>{
      wrapper.vm.$data.selectedUpload = "NO";
      const result = wrapper.vm.$data.removeAll
      wrapper.vm.onValueChange()
      Vue.nextTick(()=>{
        expect(result).toBe(true);
      })
    })
  })


})
