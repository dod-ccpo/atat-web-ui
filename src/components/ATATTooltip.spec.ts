import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import ATATTooltip from "@/components/ATATTooltip.vue";
import {DefaultProps} from "vue/types/options";
Vue.use(Vuetify);

describe("Testing ATATTooltip.vue Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATTooltip, {
      localVue,
      vuetify,
      propsData:{
        tooltipText: "dummy tooltip text",
        tooltipTitle: "dummy tooltip title"
      }
    });
  });

  describe("functions", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
});
