import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ArchiveModal from "@/packages/components/ArchiveModal.vue";

Vue.use(Vuetify);

describe("Testing Archive Modal", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ArchiveModal, {
      vuetify,
      localVue
    });
  });

  describe("testing Archive Modal Render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
  describe("testing Archive Modal Functions", () => {
    it("renders test okClicked() successfully", async () => {
      wrapper.vm.$props.showModal = true
      wrapper.vm.$props.waitingForSignature = true
      wrapper.vm.$props.hasContributor = true
      const showModal = wrapper.vm.$props.showModal
      expect(showModal).toBe(true);

      wrapper.vm.okClicked()
      Vue.nextTick(()=>{
        expect(showModal).toBe(false);

      })
    });

    it("renders test cancelClicked() successfully", async () => {
      wrapper.vm.$props.showModal = true
      const showModal = wrapper.vm.$props.showModal
      expect(showModal).toBe(true);

      wrapper.vm.cancelClicked()
      Vue.nextTick(()=>{
        expect(showModal).toBe(false);

      })
    });
  });
});
