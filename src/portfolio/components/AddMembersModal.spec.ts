import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import AddMembersModal from "@/portfolio/components/AddMembersModal.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

Vue.use(Vuetify);

describe("Testing AddMembersModal", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(AddMembersModal, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    AcquisitionPackage.setProjectTitle("testing");
    expect(wrapper.exists()).toBe(true);
  });

});
