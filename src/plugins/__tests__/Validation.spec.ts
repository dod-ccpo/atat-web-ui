import Vue from "vue";
import Vuetify from "vuetify";
import validation from "../validation";


import { createLocalVue, mount,  Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ValidatorsExample from "@/validation/ValidatorsExample.vue";

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(validation);

describe("Testing Validators", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const buildValidationTest = async (fieldName: string, errorText: string, validValue: string)=> {

    let atatField = wrapper.findComponent({ ref: fieldName});
    expect(atatField.exists()).toBe(true);
    const input = atatField.find('input');
    expect(input.exists()).toBe(true);
    let errorMessage = atatField.find('.error--text');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toMatch(errorText);
    input.setValue(validValue);
    await wrapper.vm.validateForm();
    await Vue.nextTick();
    atatField = wrapper.findComponent({ ref: fieldName});
    errorMessage = atatField.find('.error--text');
    expect(errorMessage.exists()).toBe(false);
  }

  beforeEach(()=> {

    vuetify = new Vuetify();
    wrapper = mount(ValidatorsExample, {
      localVue,
      vuetify,
    });
  });


  describe("Min Length Validator", () => {

    const fieldName = "minLengthCustom";
    const errorText ="error need at least than 3 chars bud";
    const validValue = "123";

    it("validates successfully", async () => {
       
      buildValidationTest(fieldName, errorText, validValue);
      
    });
  });
  describe("Min Length Custom Validator", () => {

    const fieldName = "minLengthCustom";
    const errorText ="error need at least than 3 chars bud";
    const validValue = "123";

    it("validates successfully", async () => {
      buildValidationTest(fieldName, errorText, validValue);
      
    });
  });

  describe("Max Length Validator", () => {

    const fieldName = "maxLengthField";
    const errorText ="error Max 9 characters allowed.";
    const validValue = "123";

    it("validates successfully", async () => {
      buildValidationTest(fieldName, errorText, validValue);
    });
  });

  describe("Required Validator", () => {

    const fieldName = "requiredField";
    const errorText ="This field is required.";
    const validValue = "123";

    it("validates successfully", async () => {
      buildValidationTest(fieldName, errorText, validValue);      
    });
  });

  describe("Integer Validator", () => {
    const fieldName = "integerField";
    const errorText ="The value must be an integer number";
    const validValue = "123";

    it("validates successfully", async () => {
      buildValidationTest(fieldName, errorText, validValue);
      
    });
  });

});
