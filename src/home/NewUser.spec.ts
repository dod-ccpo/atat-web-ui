import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import NewUser from "./NewUser.vue";

Vue.use(Vuetify);

describe("Testing New User Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(NewUser, {
      vuetify,
      localVue
    });
  });

  describe("testing New User", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  });

});
