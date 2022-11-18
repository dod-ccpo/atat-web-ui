import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CurrentUsage from "./CurrentUsage.vue";
import validators from "@/plugins/validation";

Vue.use(Vuetify);

describe("Testing CurrentUsage Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentUsage, {
      vuetify,
      localVue,
      propsData: {
        currentUsageDescription: "foo",
        usageTrafficSpikeCauses: [],
        eventSpikeDescription: "",
        periodSpikeDescription: "",      
      }
    });
  });

  describe("testing CurrentUsage render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("testing watchers", () => {
    it("watch - currentUsageDescription change", async () => {
      wrapper.vm.$props.eventSpikeDescription = "foo";
      wrapper.vm.$props.currentUsageDescription = "EVEN_USAGE";
      Vue.nextTick(() => {
        expect(wrapper.vm.$props.currentUsage.surgeUsageEvent).toBe("");
      })
    });
  })

})
