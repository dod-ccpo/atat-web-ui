import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATSelect from "@/components/ATATSelect.vue";
import { SelectData } from "types/Global";
Vue.use(Vuetify);

describe("Testing ATATTextField Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<Vue, Element>;

  const items: SelectData[] = [
    {text: "Value 01", value: "value_01"},
    {text: "Value 02", value: "value_02"},
    {text: "Value 03", value: "value_03"},
    {text: "Value 04", value: "value_04"},
    {text: "Value 05", value: "value_05"},
  ]

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSelect, {
      localVue,
      vuetify,
      propsData: {
        items,
        rules: [(v: string) => !!v || "is required"],
      }
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Events > onchange ", async () => {
    // await wrapper.setData({
    //   selected: "",
    // });
    // expect(wrapper.vm.$data.selected).toBe("");

    await wrapper.vm.$emit("onchange","value_04");
    expect(wrapper.vm.$data.selected).toBe("value_04");
  });

});
