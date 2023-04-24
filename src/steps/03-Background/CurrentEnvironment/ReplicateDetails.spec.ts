import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ReplicateDetails from "@/steps/03-Background/CurrentEnvironment/ReplicateDetails.vue";

Vue.use(Vuetify);

describe("Testing ReplicateDetails Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ReplicateDetails, {
      vuetify,
      localVue
    });
  });

  describe("testing ReplicateDetails render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
