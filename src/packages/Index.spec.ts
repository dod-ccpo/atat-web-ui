import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Packages from "./Index.vue";

Vue.use(Vuetify);

describe("Testing Packages Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Packages, {
      vuetify,
      localVue
    });
  });

  describe("testing tabClicked()", () => {
    it("renders successfully", async () => {
      wrapper.vm.tabClicked("ALL");
      const activeTab = wrapper.vm.$data.activeTab
      expect(activeTab).toBe("ALL");
    });
  });
});
