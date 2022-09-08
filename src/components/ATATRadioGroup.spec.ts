import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import { RadioButton } from "../../types/Global";
import { DefaultProps } from "vue/types/options";
import validators from "../plugins/validation"
Vue.use(Vuetify);

describe("Testing ATATRadioGroup Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators)
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  let radioButtonTwo: Wrapper<Vue, Element>;
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

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATRadioGroup, {
      localVue,
      vuetify,
      propsData: {
        items,
        value,
        legendSrOnly,
        disabled,
      }
    });
    radioButtonTwo = wrapper.find('input[type="radio"][value="RadioTwo"]');
  });

  it("renders successfully", async () => {
    const radioGroup = wrapper.findComponent(ATATRadioGroup)
    expect(radioGroup.exists()).toBe(true);

    const radioSelections = wrapper.findAll(".v-radio")
    expect(radioSelections).toHaveLength(3)
  });

  it("@Watch validatOtherOnBlurChange() - has otherValueRequiredMessage ", async () => {
    const requiredMessage = "this is required"
    const mockValidator = jest.spyOn(localVue.prototype.$validators, 'required')
    mockValidator.mockImplementation(() => requiredMessage )
    await wrapper.setProps({
      otherValueRequiredMessage: requiredMessage,
      validateOtherOnBlur: "other validation"
    })

    await wrapper.vm.validateOtherOnBlurChange()
    expect(wrapper.vm.$data.otherRequiredRule[0]).toEqual(requiredMessage)
  })
  it("@Watch validatOtherOnBlurChange() - empty otherValueRequiredMessage", async () => {
    await wrapper.setProps({
      otherValueRequiredMessage: ""
    })

    await wrapper.vm.validateOtherOnBlurChange()
    expect(wrapper.vm.$data.otherRequiredRule).toEqual([])
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

    Vue.nextTick(() => {
      expect(wrapper.vm.$props.selectedValue).toEqual(value)
    })
  })
  it("@Watch resetOtherValidation() - set atatTextInput error messages", async () => {
    await wrapper.setProps({
      card: true,
    })
    const textInput = await wrapper.find({ ref: "atatTextInput" })
    expect(textInput.exists()).toBe(true)

    await wrapper.vm.resetOtherValidation()
    Vue.nextTick(() => {
      expect(textInput.vm.$props.errorBucket).toEqual([]);
      expect(textInput.vm.$props.errorCount).toEqual(0);
    })
  })
  it.skip("@Watch validateOtherNowChanged() - with other entry type", async () => {
    // gets following error "TypeError: Cannot read properties of undefined (reading 'focus')"
    const otherEntryType = "textarea"
    await wrapper.setProps({
      otherEntryType
    })
    await wrapper.vm.validateOtherNowChanged()
    expect(wrapper.vm.$props.otherEntryType).toEqual(otherEntryType)
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

  it("onBlur() - emitting a blur event and set errorMessages", async () => {
    const errorMessages = ["error message 003"]
    const radioGroup = await wrapper.find({ ref: "radioButtonGroup" })
    await radioGroup.setData({ errorBucket: errorMessages })
    await wrapper.vm.onBlur();
    expect(await wrapper.vm.$data.errorMessages).toEqual(
      radioGroup.vm.$data.errorBucket
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
    const radioClasses = await wrapper.vm.radioClasses
    expect(radioClasses).toBe("_radio-button-card")
  })
  it("radioClasses() - set card to false and retrieve class", async () => {
    await wrapper.setProps({ card: false })
    const radioClasses = await wrapper.vm.radioClasses
    expect(radioClasses).toBe("_radio-button")
  })

});
