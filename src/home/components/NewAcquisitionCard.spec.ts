import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import NewAcquisitionCard from "./NewAcquisitionCard.vue";

Vue.use(Vuetify);

describe("Helpful Resources Link Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(NewAcquisitionCard, {
      vuetify,
      localVue
    });
  });

  describe("testing Helpful Resources Link", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  });

});
