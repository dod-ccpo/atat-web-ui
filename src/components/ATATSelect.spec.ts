import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATSelect from "@/components/ATATSelect.vue";
import { DefaultProps } from "vue/types/options";
Vue.config.productionTip = false;
Vue.use(Vuetify);


describe("Testing ATATSelect Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSelect, {
      localVue,
      vuetify,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  })

  describe("testing atatSelect.vue", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findComponent(ATATSelect).classes()[0]).toBe("atat-select")
    });

    it("set rules props then ensure the select wrapper is equal to rules props", async () => {
      const select = await wrapper.find({ ref: "atatSelect" })
      expect(await select.vm.$props.rules).toEqual([])
    })

    it("onChange() - change value from empty to non-empty string", async () => {
      const changedValue = "value_04";
      await wrapper.vm.onChange(changedValue);
      expect(wrapper.vm.$data.selected).toEqual(changedValue);
    });

    it("onBlur() - sets value, then blurs to ensure blur event is emitted " +
        "with value", async () => {
      const value = "value_03";
      await wrapper.vm.onBlur(value);
      expect(wrapper.emitted("blur")?.flat()[0]).toEqual(value);
    });

    it("onInput() - ensure supplied param equals props.selectedValue", async () => {
      const inputValue = "ATAT"
      await wrapper.vm.onInput(inputValue)
      Vue.nextTick(() => {
        expect(wrapper.vm.$props.selectedValue).toBe(inputValue)
      })
    });

    it("setErrorMessage() - calls method, sets necessary data on v-select component " +
      "and ensures $data.errorMessages === v-select.$data.errorBucket", async () => {
      jest.useFakeTimers();
      const select = await wrapper.find({ ref: "atatSelect" });
      const errors = ['error msg 1'];
      await select.setData({
        errorBucket: errors
      })
      await wrapper.vm.setErrorMessage();
      jest.advanceTimersByTime(10000);

      expect(await wrapper.vm.$data.errorMessages).toEqual(
        select.vm.$data.errorBucket
      );
    });
  });
});
