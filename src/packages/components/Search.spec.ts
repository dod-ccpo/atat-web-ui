import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Search from "./Search.vue";

Vue.use(Vuetify);

describe("Testing Search Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Search, {
      vuetify,
      localVue
    });
  });

  describe("testing Funding Alert", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });


  });
});
