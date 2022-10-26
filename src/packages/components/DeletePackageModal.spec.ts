import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import DeletePackageModal from "@/packages/components/DeletePackageModal.vue";

Vue.use(Vuetify);

describe("Testing Delete Modal", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(DeletePackageModal, {
      vuetify,
      localVue,
      propsData: {
        showModal:true
      }
    });
  });

  describe("testing Delete Modal Render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
  describe("testing Delete Modal Functions", () => {
    it("renders test okClicked() successfully", async () => {
      const showModal = wrapper.vm.$props.showModal
      wrapper.vm.$props.waitingForSignature = true
      wrapper.vm.$props.hasContributor = true
      expect(showModal).toBe(true);

      wrapper.vm.okClicked()
      Vue.nextTick(()=>{
        expect(showModal).toBe(false);

      })
    });

    it("renders test cancelClicked() successfully", async () => {
      const showModal = wrapper.vm.$props.showModal
      expect(showModal).toBe(true);

      wrapper.vm.cancelClicked()
      Vue.nextTick(()=>{
        expect(showModal).toBe(false);

      })
    });
  });
});
