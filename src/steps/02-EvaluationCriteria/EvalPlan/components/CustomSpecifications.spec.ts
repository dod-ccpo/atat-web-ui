import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CustomSpecifications 
  from "@/steps/02-EvaluationCriteria/EvalPlan/components/CustomSpecifications.vue";

Vue.use(Vuetify);

describe("Testing CreateEvalPlan Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CustomSpecifications, {
      vuetify,
      localVue,
      propsData: {
        customSpecifications: [],
        sourceSelection: "NoTechProposal",
        isDifferentiator: false,
        isOptional: true,
      }
    });
  });

  describe("testing Callout component", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("testing getters", () => {
    it("isStandards() - to be 'compliance standard'", async () => {
      expect(wrapper.vm.specificationType).toBe("compliance standard");
    });

    it("isStandards() - to be 'assessment area'", async () => {
      await wrapper.setProps({
        sourceSelection: "foo"
      });
      expect(wrapper.vm.specificationType).toBe("assessment area");
    });

    it("isStandards() - to be 'differentiator'", async () => {
      await wrapper.setProps({
        isDifferentiator: true
      });
      expect(wrapper.vm.specificationType).toBe("differentiator");
    });
  });

  describe("testing methods", () => {
    it("addCustomSpec() - adds a custom specification row", async () => {
      wrapper.vm.addCustomSpec();
      expect(wrapper.vm.$props.customSpecifications.length).toBe(1);
    });

    it("deleteCustomSpec() - removes a custom specification row", async () => {
      await wrapper.setProps({
        customSpecifications: ["foo", "bar"]
      });
      wrapper.vm.deleteCustomSpec();
      expect(wrapper.vm.$props.customSpecifications.length).toBe(1);
    });

  });


})
