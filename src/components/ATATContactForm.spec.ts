import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATContactForm from "@/components/ATATContactForm.vue";
import validators from "../plugins/validation"
import ContactData from "@/store/contactData"
import { DefaultProps } from "vue/types/options";

Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATContactForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators)

  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATContactForm, {
      localVue,
      vuetify,
    });
  });


  describe("Testing ATATContactForm Component", () => {
    jest.spyOn(ContactData, 'LoadMilitaryBranches').mockImplementation(() => {
      return [
        { name: "name_1", label: "label_1", value: "value_1" },
        { name: "name_2", label: "label_2", value: "value_2" } 
      ] as any
    })

    it("renders successfully", async () => {
      const atatContactForm = wrapper.findComponent(ATATContactForm)
      expect(atatContactForm.exists()).toBe(true)
    });

    it("@Watch branchChange() - setting a selectedBranch to trigger update", async () => {
      const selectedBranch = {
        text: "U.S. Army",
        value: "ARMY"
      }
      wrapper.vm.$props.selectedBranch = selectedBranch
      expect(wrapper.vm.$props.selectedBranch.value).toEqual(selectedBranch.value)
    })

    it("contactTypeChange() - select contact type to change", async () => {     
      const resetDataSpy = jest.spyOn(wrapper.vm, "resetData")
      await wrapper.setProps({ loaded: true }) 
      await wrapper.vm.contactTypeChange()
      expect(resetDataSpy).toHaveBeenCalledTimes(1)
    })
  })
})