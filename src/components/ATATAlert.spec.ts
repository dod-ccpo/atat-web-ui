import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ATATAlert from "@/components/ATATAlert.vue";

Vue.use(Vuetify);

describe("Testing ATATStepperNavigation", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATAlert, {
      vuetify,
      localVue
    });
  });

  describe("INITIALIZATION", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });


  describe("PROPS", () => {
    it("getIconSize", async () => {
      await wrapper.setProps({size: ''});
      expect(wrapper.vm.getIconSize()).toBe('icon-16');
    });
    it("getIconSize Large", async () => {
      await wrapper.setProps({size: 'large'});
      expect(wrapper.vm.getIconSize()).toBe('icon-20');
    });
    it("getIcon should return passed icon", async () => {
      await wrapper.setProps({icon: 'smile'});
      expect(wrapper.vm.getIcon()).toBe('smile');
    });
    it("getIcon should return success icon", async () => {
      await wrapper.setProps({icon: '', type: 'success'});
      expect(wrapper.vm.getIcon()).toBe('check_circle');
    });
    it("getIcon should return icon type", async () => {
      await wrapper.setProps({icon: '', type: 'type'});
      expect(wrapper.vm.getIcon()).toBe('type');
    });
  });

  describe("FUNCTIONS", () => {
    it("close", async () => {
      await wrapper.vm.close();
      expect(wrapper.vm.$props.show).toBe(false);
    });
  });
});
