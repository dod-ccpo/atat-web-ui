import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import RegionsDeployedAndUserCount from "./RegionsDeployedAndUserCount.vue";
import validators from "@/plugins/validation";

Vue.use(Vuetify);

describe("Testing CurrentUsage Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(RegionsDeployedAndUserCount, {
      vuetify,
      localVue,
    });
  });

  describe("testing RegionsDeployedAndUserCount render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("testing watchers/methods", () => {
    it("watch - selectedRegions change", async () => {
      wrapper.vm.$data.selectedRegions = ["foo"];
      Vue.nextTick(() => {
        expect(wrapper.emitted("selectedRegionsUpdate")).toBeTruthy();
      })
    });

    it("watch - selectedRegions change", async () => {
      wrapper.vm.regionsUserDataUpdate(["foo", "bar"]);
      expect(wrapper.emitted("regionUserDataUpdate")).toBeTruthy();
    });
  })

})