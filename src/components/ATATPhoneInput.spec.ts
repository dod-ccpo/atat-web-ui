import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATPhoneInput from "@/components/ATATPhoneInput.vue";
import { DefaultProps } from "vue/types/options";

Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATPhoneInput Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATPhoneInput, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    const phoneInput = wrapper.findComponent(ATATPhoneInput)
    expect(phoneInput.exists()).toBe(true);
    expect(phoneInput.classes()).toContain("_atat-phone-field")
    expect(phoneInput.attributes("id")).toContain("PhoneControl")

    const countriesDropdown = wrapper.find("._country-select");
    expect(countriesDropdown.classes()).toContain("_country-select")
    expect(countriesDropdown.classes()).toContain("v-input")

    const textField = wrapper.find("._phone-number-input");
    expect(textField.classes()).toContain("_phone-number-input")
    expect(textField.classes()).toContain("v-input")

    const extensionField = wrapper.find("#PhoneExtensionControl");
    expect(extensionField.classes()).toContain("_atat-phone-extension-field")
    expect(extensionField.attributes("id")).toContain("PhoneExtensionControl")
  });

  it("labels - Phone Number", async () => {
    const labelText = "Test Phone Label"
    await wrapper.setProps({ label: labelText })
    const label = wrapper.find('#PhoneNumber_TextFieldLabel')
    expect(label.text()).toBe(labelText)
  })

  it("labels - Extension", async () => {
    const label = wrapper.find('#PhoneNumber_ExtensionTextFieldLabel')
    expect(label.text()).toContain("Extension")
  })

  it("inputActions() - ensure supplied extension equals props.extension", async () => {
    const extensionInput = "x3867"
    await wrapper.vm.inputActions(extensionInput)
    // also runs setExtensionMask()
    Vue.nextTick(() => {
      expect(wrapper.vm.$props.extension).toEqual(extensionInput)
    })
  })

  it("searchCountries() - ensure all countries return in results", async () => {
    await wrapper.setData({ searchTerm: "" })
    wrapper.vm.searchCountries()

    expect(wrapper.vm.$data.searchResults.length).toEqual(31)
  })
  it("searchCountries() - ensure countries with 'cr' return in results", async () => {
    await wrapper.setData({ searchTerm: "cr" })
    wrapper.vm.searchCountries()

    expect(wrapper.vm.$data.searchResults.length).toEqual(1)
    expect(wrapper.vm.$data.searchResults[0].name).toEqual("Croatia")
  })

  it("setErrorMessage() - provides phoneInput.$data.errorBucket automatically to ensure " +
  "$data.errorMessage === phoneInput.$data.errorBucket ", async () => {
    const phoneInput = wrapper.findComponent(ATATPhoneInput)
    const errorMessages = ["error message 001"]
    await phoneInput.setData({
      errorBucket: errorMessages
    })
    await wrapper.vm.setErrorMessage();
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.errorMessages).toBe(errorMessages);
    })
  })

  it("@Watch onValueChange() - change value to update ", async () => {
    const updatedValue = "39583424"
    await wrapper.setProps({ value: updatedValue })
    await wrapper.vm.onValueChange()
    expect(wrapper.vm.$props.value).toEqual(updatedValue)
  })

  it("onChange() - call event and ensure `blur` event is emitted with $props.value", async () => {
    const value = "3485834";
    await wrapper.setProps({
      value
    })
    const textField = wrapper.find("#PhoneNumber_textField")
    expect(textField.exists()).toBe(true)
    await textField.trigger("blur");
    expect(await wrapper.emitted("blur")?.flat()[0]).toBe(value);
  })

  it("wrapperClass() - setting $vuetify.breakpoint.mdAndDown to retrieve class", async () => {
    wrapper.vm.$vuetify.breakpoint.mdAndDown = true
    const wrapperClass = await wrapper.vm.wrapperClass
    expect(wrapperClass).toBe("d-block")
  })
  it("wrapperClass() - setting $vuetify.breakpoint.mdAndDown to retrieve class", async () => {
    wrapper.vm.$vuetify.breakpoint.mdAndDown = false
    const wrapperClass = await wrapper.vm.wrapperClass
    expect(wrapperClass).toBe("d-flex")
  })
  it("extensionClass() - setting $vuetify.breakpoint.mdAndDown to retrieve class", async () => {
    wrapper.vm.$vuetify.breakpoint.mdAndDown = true
    const extensionClass = await wrapper.vm.extensionClass
    expect(extensionClass).toBe("mt-6")
  })
  it("extensionClass() - setting $vuetify.breakpoint.mdAndDown to retrieve class", async () => {
    wrapper.vm.$vuetify.breakpoint.mdAndDown = false
    const extensionClass = await wrapper.vm.extensionClass
    expect(extensionClass).toBe("ml-6")
  })
  
  it("select country - expand country dropdown and select one of the .v-list-items", async () => {
    const dropDown = wrapper.findAll("#CountryCodeDropdown")
    const countryItemNumber = 4
    const country = wrapper.vm.$data.countries[countryItemNumber] // Bulgaria
    expect(dropDown.exists()).toEqual(true)
    await dropDown.trigger("click")
    
    // captures onChange() and methods insides
    const listItems = wrapper.findAll(".v-list-item")
    expect(listItems.at(countryItemNumber).exists()).toEqual(true)
    await listItems.at(countryItemNumber).trigger("click")

    const countryCodePrefix = wrapper.find(".v-text-field__prefix")
    expect(countryCodePrefix.exists()).toEqual(true)
    Vue.nextTick(() => {
      expect(countryCodePrefix.text()).toBe(country.countryCode)
    })
  })
});
