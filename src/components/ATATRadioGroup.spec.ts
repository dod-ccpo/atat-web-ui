import { describe, it, expect, vi } from 'vitest';
import { VueWrapper, shallowMount, mount } from '@vue/test-utils';
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ATATTooltip from "@/components/ATATTooltip.vue";
import { RadioButton } from "../../types/Global";
import validators from "../plugins/validation"

describe("Testing ATATRadioGroup Component", () => {

  const items: RadioButton[] = [
    {
      id: "RadioOne",
      label: "RadioOne",
      value: "RadioOne",
    },
    {
      id: "RadioTwo",
      label: "RadioTwo",
      value: "RadioTwo",
    },
    {
      id: "RadioThree",
      label: "RadioThree",
      value: "RadioThree",
    },
  ];
  const value = "RadioOne";
  const legendSrOnly = false;
  const disabled = false;
  const vuetify = createVuetify({
    components,
    directives,
  })
  const wrapper: VueWrapper = mount(ATATRadioGroup, {
    props: {
      items,
      value,
      legendSrOnly,
      disabled
    },
    global: {
      plugins: [validators,vuetify]
    }
  });

  
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)


  // beforeEach(() => {
  //   vuetify = new Vuetify();
  //   wrapper = mount(ATATRadioGroup, {
  //     localVue,
  //     vuetify,
  //     propsData: {
  //       items,
  //       value,
  //       legendSrOnly,
  //       disabled,
  //     }
  //   });
  //   radioButtonTwo = wrapper.find('input[type="radio"][value="RadioTwo"]');
  // });

  it("renders successfully", async () => {
    console.log(wrapper.html())
    const radioGroup = wrapper.findComponent(ATATRadioGroup)
    expect(radioGroup.exists()).toBe(true);

    const radioSelections = wrapper.findAll(".v-radio")
    expect(radioSelections).toHaveLength(3)
  });

  it("@Watch validatOtherOnBlurChange() - has otherValueRequiredMessage ", async () => {
    const requiredMessage = "this is required"
    const mockValidator = vi.spyOn(vm.$validators, 'required')
    mockValidator.mockImplementation(() => requiredMessage )
    await wrapper.setProps({
      otherValueRequiredMessage: requiredMessage,
      validateOtherOnBlur: "other validation"
    })

    await vm.validateOtherOnBlurChange()
    expect(vm.$data.otherRequiredRule[0]).toEqual(requiredMessage)
  })
  it("@Watch validatOtherOnBlurChange() - empty otherValueRequiredMessage", async () => {
    await wrapper.setProps({
      otherValueRequiredMessage: ""
    })

    await vm.validateOtherOnBlurChange()
    expect(vm.$data.otherRequiredRule).toEqual([])
  })
  it("@Watch valueChange() - click the third radio button for emitted select event", async () => {
    const value = "RadioThree"
    const radioThree = wrapper.find(`input[type="radio"][value=${value}]`)
    expect(radioThree.exists()).toBe(true)
    await radioThree.trigger("click")
    await wrapper.setProps({
      value,
    })
    expect(wrapper.emitted("radioButtonSelected")?.flat()[0]).toMatch(value);
  })
  it("@Watch valueChange() - with other value", async () => {
    const value = "RadioThree"
    const radioThree = wrapper.find(`input[type="radio"][value=${value}]`)
    expect(radioThree.exists()).toBe(true)
    await wrapper.setProps({
      value,
      hasOtherValue: true,
      otherValue: value
    })

    vm.$nextTick(() => {
      expect(vm.$props.value).toContain(value)
    })
  })
  it.skip("@Watch resetOtherValidation() - set atatTextInput error messages", async () => {
    await wrapper.setProps({
      card: true,
    })
    const textInput = await wrapper.find({ ref: "atatTextInput" })
    expect(textInput.exists()).toBe(true)

    await vm.resetOtherValidation()
    vm.nextTick(() => {
      expect(vm.$props.errorBucket).toEqual([]);
      expect(vm.$props.errorCount).toEqual(0);
    })
  })
  it.skip("@Watch validateOtherNowChanged() - with other entry type", async () => {
    // gets following error "TypeError: Cannot read properties of undefined (reading 'focus')"
    const otherEntryType = "textarea"
    await wrapper.setProps({
      otherEntryType
    })
    await vm.validateOtherNowChanged()
    expect(vm.$props.otherEntryType).toEqual(otherEntryType)
  })

  it("ATATTooltip - set tooltipText to make ATATTooltip visible " +
  "and invoke getTooltipLabel() ", async () => {
    await wrapper.setProps({
      id: "RadioGroupId",
      tooltipText: "useful tooltip"
    })
    const tooltip = wrapper.findComponent(ATATTooltip)
    expect(tooltip.exists()).toBe(true)
  })

  it.skip("onBlur() - emitting a blur event and set errorMessages", async () => {
    const errorMessages = ["error message 003"]
    const radioGroup = await wrapper.find({ ref: "radioButtonGroup" })
    await wrapper.setData({ errorBucket: errorMessages })
    await vm.onBlur();
    expect(await vm.$data.errorMessages).toEqual(
      vm.$data.errorBucket
    );
  })

  it("legend screen reader only", async () => {
    const legendSrOnly = wrapper.find(".d-sr-only");

    await wrapper.setProps({ legendSrOnly: true });
    expect(legendSrOnly).toBeDefined;

    await wrapper.setProps({ legendSrOnly: false });
    expect(legendSrOnly).toBeUndefined;
  });

  it("radio buttons disabled", async () => {
    const disabledRadio = wrapper.find(".v-radio--is-disabled");

    await wrapper.setProps({disabled: true});
    expect(disabledRadio).toBeDefined;
  
    await wrapper.setProps({disabled: false});
    expect(disabledRadio).toBeUndefined;
  });

  it("radioClasses() - set card to true and retrieve class", async () => {
    await wrapper.setProps({ card: true })
    const radioClasses = await vm.radioClasses
    expect(radioClasses).toBe("_radio-button-card")
  })
  it("radioClasses() - set card to false and retrieve class", async () => {
    await wrapper.setProps({ card: false })
    const radioClasses = await vm.radioClasses
    expect(radioClasses).toBe("_radio-button")
  })

});
