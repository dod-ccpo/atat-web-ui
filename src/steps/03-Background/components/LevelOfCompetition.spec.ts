import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import LevelOfCompetition from "@/steps/03-Background/components/LevelOfCompetition.vue";

describe("Testing LevelOfCompetition Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(LevelOfCompetition, {
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
        competitiveStatus: ""
      })
      await wrapper.vm.setReadOnly();
      expect(wrapper.vm.$data.selectedCompetitiveStatusReadOnly).toEqual("YES");
    });
  
    it("returns NO", async () => {
      await wrapper.setProps({
        competitiveStatus: "NO_NONE"
      })
      await wrapper.vm.setReadOnly();
      expect(wrapper.vm.$data.selectedCompetitiveStatusReadOnly).toEqual("NO");
    });
  })
});
