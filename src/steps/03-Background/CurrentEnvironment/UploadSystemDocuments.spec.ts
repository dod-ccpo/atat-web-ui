import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import UploadSystemDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadSystemDocuments.vue";
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";


Vue.use(Vuetify);

describe("Testing UploadSystemDocuments Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(UploadSystemDocuments, {
      vuetify,
      localVue
    });
  });

  describe("testing UploadSystemDocuments render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("test hasChanged()", async () => {
      wrapper.vm.$data.currentData = 'test'
      wrapper.vm.$data.savedData = 'test2'
      expect(wrapper.vm.hasChanged()).toBe(true);
    });

    // it("test saveOnLeave()", async () => {
    //   wrapper.vm.$data.hasChanged = true
    //   // eslint-disable-next-line camelcase
    //   wrapper.vm.$data.currentData = {system_documentation: 'test'}
    //   const result = AcquisitionPackage.currentEnvironment?.system_documentation
    //   jest.spyOn(AcquisitionPackage,"setCurrentEnvironment")
    //   wrapper.vm.saveOnLeave()
    //   Vue.nextTick(()=>{
    //     expect(result).toBe('test');
    //   })
    // })

    it("test onValueChange",()=>{
      wrapper.vm.$data.selectedUpload = "NO";
      const result = wrapper.vm.$data.removeAll
      wrapper.vm.selectedUploadChange()
      Vue.nextTick(()=>{
        expect(result).toBe(true);
      })
    })
  })


})
