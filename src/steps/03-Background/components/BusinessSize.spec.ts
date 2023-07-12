import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import BusinessSize from "@/steps/03-Background/components/BusinessSize.vue";

describe("Testing BusinessSize Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(BusinessSize, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("ensure setReadOnly() =>", () => {
    beforeEach(() => {
      wrapper.setData({
        isForm: false,
      });
    });
   
    it("returns YES", async () => {
      await wrapper.setProps({
        businessSize: ""
      })
      await wrapper.vm.setReadOnly();
      expect(wrapper.vm.$data.selectedBusinessSizeReadOnly).toEqual("YES");
    });
  
    it("returns NO", async () => {
      await wrapper.setProps({
        businessSize: "NO_NONE"
      })
      await wrapper.vm.setReadOnly();
      expect(wrapper.vm.$data.selectedBusinessSizeReadOnly).toEqual("NO");
    });
  })
});
