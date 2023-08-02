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

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentContractOptions, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("GETTERS()=>", ()=>{
    describe("currentContractOptions ()=>", ()=>{
      it("expected currentContractOptions.label if $prop isWizard", async()=>{
        await wrapper.setProps({
          isWizard: true,
          hasExceptionToFairOpportunity: true
        })
        const currentContractOptions = wrapper.vm.currentContractOptions;
        // ensures both labels are not `Yes.` or `No.`
        const expectedLabelsIfIsWizard = currentContractOptions.every(
          ((cco: RadioButton) => {
            return cco.label.length > 4
          }
        ));
        expect(expectedLabelsIfIsWizard).toBe(true)
      })

      it("expected currentContractOptions.label if $prop !isWizard", async()=>{
        await wrapper.setProps({
          isWizard: false,
        })
        const currentContractOptions = wrapper.vm.currentContractOptions;
        // ensures both labels are either `Yes.` or `No.`
        const expectedLabelsIfIsWizard = currentContractOptions.every(
          ((cco: RadioButton) => {
            return cco.label.length <= 4
          }
        ));
        expect(expectedLabelsIfIsWizard).toBe(true)
      })
    })
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
