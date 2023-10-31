import Vue from "vue";
//import Vuetify from "vuetify";
import validation from "./validation";


//import { createLocalVue, mount,  Wrapper } from "@vue/test-utils";
//import { DefaultProps } from "vue/types/options";
import ValidatorsExample from "@/validation/ValidatorsExample.vue";
import { VueWrapper, shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';

// vi.mock("@/validation/ValidatorsExample.vue", async () => {
//   const actual = await vi.importActual(
//     "@/validation/ValidatorsExample.vue") as typeof ValidatorsExample;
//   return {
//     ...actual,
//     validateForm: vi.fn(),
//   };
// });
const wrapper: VueWrapper = shallowMount(ValidatorsExample);

describe('Testing Validators', () => {

  
  describe("Required Email", () => {
    const validValue = [
      {
        fieldName: 'emailField',
        errorText: '',
        value: 'test@mail.mil'
      },
      {
        fieldName: 'emailField',
        errorText: '',
        value: 'test@abc.gov'
      },
      {
        fieldName: 'emailField',
        errorText: '',
        value: 'test@test.mail.mil'
      },
      {
        fieldName: 'emailField',
        errorText: '',
        value: 'test@g7.mail.mil'
      },
      {
        fieldName: 'emailField',
        errorText: '',
        value: 'test@us.branch.mail.mil'
      },
      {
        fieldName: 'emailField',
        errorText: '',
        value: 'test@test.mail.gov'
      },
      {
        fieldName: 'emailField',
        errorText: '',
        value: 'test@g7.b4.gov'
      },
      {
        fieldName: 'emailField',
        errorText: '',
        value: 'test@us.state.gov'
      }
    ]
    const invalidDomain = [
      {
        fieldName: 'emailField',
        errorText: 'Please use your .mil or .gov email address.',
        value: 'test@gmail.com'
      },
      {
        fieldName: 'emailField',
        errorText: 'Please use your .mil or .gov email address.',
        value: 'test@yahoo.mail'
      },
      {
        fieldName: 'emailField',
        errorText: 'Please use your .mil or .gov email address.',
        value: 'test@atat.com'
      }
    ]
    const failureValues = [
      {
        fieldName: 'emailField',
        errorText: 'Please use standard domain format, like ‘@mail.mil’',
        value: 'test@test.us'
      },
      {
        fieldName: 'emailField',
        errorText: 'Please use standard domain format, like ‘@mail.mil’',
        value: 'dapps@atat.me'
      },
      {
        fieldName: 'emailField',
        errorText: 'Please use standard domain format, like ‘@mail.mil’',
        value: 'test@hello.ai'
      }
    ]
    it("validates email successfully", async () => {
      for(const item of validValue) {
        const testval =  await checkEmailTest(item.fieldName,item.errorText,item.value,false)
        console.log("here's testval", testval);
      }
    })
    it("validates email but wrong domain(s)", async () => {
      for(const item of invalidDomain) {
        await checkEmailTest(item.fieldName,item.errorText,item.value,true)
      }
    })
    it("fails on email recognition", async () => {
      for(const item of failureValues) {
        await checkEmailTest(item.fieldName,item.errorText,item.value,true)
      }
    })
  })
  
  const checkEmailTest = async (
    fieldName: string, errorText: string, value:string, expectErrorMessage: boolean
  ) => {
    let emailField = wrapper.findComponent({ref: fieldName});
    const input = emailField.find('input');
    input.setValue(value);
    await (wrapper.vm as any).validateForm();
    Vue.nextTick();
    emailField = wrapper.findComponent({ref: fieldName});
    const errorMessage = await emailField.find('.error--text');
    expect(errorMessage.exists()).toBe(expectErrorMessage)
  }
});