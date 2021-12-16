import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import PostReview from "@/views/wizard/Step5/views/PostReview.vue";
import Vuex from "vuex";

Vue.use(Vuetify);

describe("Testing PostReview Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;
  let store: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({});
    wrapper = mount(PostReview, {
      localVue,
      store,
      vuetify,
      stubs: [],
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test unauthorizeUser users", async () => {
    wrapper.vm.authorizeUser(false);
    expect(wrapper.vm.isNoButtonClicked).toBe(true);
  });
  it("test authorizeUser users", async () => {
    wrapper.vm.authorizeUser(true);
    expect(wrapper.vm.isYesButtonClicked).toBe(true);
  });
});
