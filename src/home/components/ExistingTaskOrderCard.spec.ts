import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ExistingTaskOrderCard from "./ExistingTaskOrderCard.vue";
import validators from "@/plugins/validation";

Vue.use(Vuetify);

describe("Existing Task Order Card Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ExistingTaskOrderCard, {
      vuetify,
      localVue
    });
  });

  describe("testing Existing Task Order card", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  });

});
