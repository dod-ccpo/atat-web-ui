/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, shallowMount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CertificationPOCs from "@/steps/02-EvaluationCriteria/MRR/CertificationPOCs.vue";
import validators from "../../../plugins/validation";

Vue.use(Vuetify);

describe("Testing CertificationPOCs Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(CertificationPOCs, {
      vuetify,
      localVue
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("saveOnLeave() - should set the component property such that save is triggered", async () => {
    expect(wrapper.vm.$data.saveForm).toBe(false);
    await wrapper.vm.saveOnLeave();
    expect(wrapper.vm.$data.saveForm).toBe(true);
  });
})
