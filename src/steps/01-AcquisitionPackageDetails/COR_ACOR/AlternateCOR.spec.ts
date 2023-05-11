/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import AlternateCOR from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/AlternateCOR.vue";
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";

Vue.use(Vuetify);

describe("Testing AlternateCOR Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(AlternateCOR, {
      vuetify,
      localVue
    });
    AcquisitionPackage.setHasAlternateCOR(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("hasAlternateCOR() - should set the 'removeAcor' data of the component based on " +
    "what is configured", async () => {
    await wrapper.setData({
      hasAlternateCOR: "false"
    });
    expect(wrapper.vm.$data.removeAcor).toBe(true);
    await wrapper.setData({
      hasAlternateCOR: "true"
    });
    expect(wrapper.vm.$data.removeAcor).toBe(false);
  });

  it("saveOnLeave() - should call the store and save if remove acor is set", async () => {
    jest.spyOn(AcquisitionPackage, 'removeACORInformation').mockImplementation(
      () => Promise.resolve()
    );
    wrapper.vm.$data.removeAcor = true;
    await wrapper.vm.saveOnLeave();
    expect(AcquisitionPackage.removeACORInformation).toHaveBeenCalled();
  });
})
