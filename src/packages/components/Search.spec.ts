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

  describe("testing Search functions", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("test clearSearch()", async () => {
      wrapper.vm.$props._searchString = "hello"
      expect(wrapper.vm.$props._searchString).toBe("hello");

      wrapper.vm.clearSearch()
      Vue.nextTick(() => {
        expect(wrapper.vm.$props._searchString).toBe("");
      })
    });

    it("test searchPackages emits value",()=>{
      wrapper.vm.searchPackages()
      Vue.nextTick(() => {
        expect(wrapper.vm.emitted().search).toBeTruthy();
      })
    })
  });
});
