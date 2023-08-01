/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import validators from "../../../../plugins/validation";
import CurrentContractOptions 
  from "@/steps/03-Background/CurrentContract/components/CurrentContractOptions.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { RadioButton } from "types/Global";

describe("Testing CurrentContractOptions Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;
  localVue.use(validators);

    // object to determine an exception to fair opportunity
    const hasEFO =  {exception_to_fair_opportunity: "YES_FAR_16_505_B_2_I_C"};
    // object to determine NO exception to fair opportunity
    const hasNoEFO = {exception_to_fair_opportunity: "NO_NONE"};
    // object to determine EMPTY exception to fair opportunity
    const hasEmptyEFO = {exception_to_fair_opportunity: ""};

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentContractOptions, {
      localVue,
      vuetify,
    });
  });

  afterEach(() => {
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("DATA ()=>", ()=>{
    it("expected currentContractOptions if $prop isWizard === true", async()=>{
      await wrapper.setProps({
        isWizard: true,
        hasExceptionToFairOpportunity: true
      })
      expect(wrapper.vm.$data.currentContractOptions.every(
        ((cco: RadioButton) => {
          console.log(cco.label)
          return cco.label.indexOf('previous') > 0
        }
      ))).toBe(false)
    })
    // it("getYesLabel()=> returns string WITHOUT `previous`", async()=>{
    //   await wrapper.setProps({
    //     hasExceptionToFairOpportunity: false
    //   })
    //   expect(wrapper.vm.getYesLabel()).not.toContain(`previous`);
    // })
  })



  describe("FUNCTIONS ()=>", ()=>{
    it("getYesLabel()=> returns string WITH `previous`", async()=>{
      await wrapper.setProps({
        hasExceptionToFairOpportunity: true
      })
      expect(wrapper.vm.getYesLabel()).toContain(`previous`);
    })
    it("getYesLabel()=> returns string WITHOUT `previous`", async()=>{
      await wrapper.setProps({
        hasExceptionToFairOpportunity: false
      })
      expect(wrapper.vm.getYesLabel()).not.toContain(`previous`);
    })
  })
  
  
});
