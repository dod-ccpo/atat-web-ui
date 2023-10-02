import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Callout from "@/steps/02-EvaluationCriteria/EvalPlan/components/Callout.vue";

Vue.use(Vuetify);

describe("Testing CreateEvalPlan Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Callout, {
      vuetify,
      localVue,
      propsData: {
        sourceSelection: "TechProposal",
        method: "",
      }
    });
  });

  describe("Rendering Callout component", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("testing getters for eval plan variations", () => {
    it("testing no-tech-proposal required", async () => {
      await wrapper.setProps({
        sourceSelection: "NoTechProposal"
      });
      expect(wrapper.vm.isStandards).toBeTruthy();
      expect(wrapper.vm.heading).toBe("Compliance Standards");
      expect(wrapper.vm.listType).toBe("Standard");
      expect(wrapper.vm.introP).toContain("to provide a price quote");
      expect(wrapper.vm.subhead).toContain("compliance standards");
      expect(wrapper.vm.listItems).toHaveLength(2);
    });

    it("testing tech-proposal required - BVTO", async () => {
      await wrapper.setProps({
        sourceSelection: "TechProposal",
        method: "BVTO"
      });
      expect(wrapper.vm.isStandards).toBeTruthy();
      expect(wrapper.vm.heading).toBe("Compliance Standards");
      expect(wrapper.vm.listType).toBe("Standard");
      expect(wrapper.vm.introP).toContain("propose a technical solution");
      expect(wrapper.vm.subhead).toContain("CSP providing the best value");
      expect(wrapper.vm.listItems).toHaveLength(3);
    });

    it("testing tech-proposal required - LPTA", async () => {
      await wrapper.setProps({
        sourceSelection: "TechProposal",
        method: "LPTA"
      });
      expect(wrapper.vm.isStandards).toBeTruthy();
      expect(wrapper.vm.heading).toBe("Compliance Standards");
      expect(wrapper.vm.listType).toBe("Standard");
      expect(wrapper.vm.introP).toContain("propose a technical solution");
      expect(wrapper.vm.subhead).toContain("lowest priced offeror meeting");
      expect(wrapper.vm.listItems).toHaveLength(3);
    });


    it("testing set lump sum one CSP - Best Use method", async () => {
      await wrapper.setProps({
        sourceSelection: "SetLumpSum",
        method: "BestUse"
      });
      expect(wrapper.vm.isStandards).toBeFalsy();
      expect(wrapper.vm.heading).toBe("Assessment Areas");
      expect(wrapper.vm.listType).toBe("Criteria");
      expect(wrapper.vm.introP).toContain("white paper");
      expect(wrapper.vm.subhead).toContain("best use");
      expect(wrapper.vm.listItems).toHaveLength(4);
    });

    it("testing set lump sum one CSP - Lowest Risk method", async () => {
      await wrapper.setProps({
        sourceSelection: "SetLumpSum",
        method: "LowestRisk"
      });
      expect(wrapper.vm.isStandards).toBeFalsy();
      expect(wrapper.vm.heading).toBe("Assessment Areas");
      expect(wrapper.vm.listType).toBe("Criteria");
      expect(wrapper.vm.introP).toContain("white paper");
      expect(wrapper.vm.subhead).toContain("lowest risk");
      expect(wrapper.vm.listItems).toHaveLength(5);
    });

    it("testing equal set lump sum all CSPs", async () => {
      await wrapper.setProps({
        sourceSelection: "EqualSetLumpSum",
        method: ""
      });
      expect(wrapper.vm.isStandards).toBeFalsy();
      expect(wrapper.vm.heading).toBe("Why are there no required standards?");
      expect(wrapper.vm.introP).toContain("equal dollar amount");
      expect(wrapper.vm.subhead).toContain("equal parts to each CSP");
      expect(wrapper.vm.listItems).toHaveLength(0);
    });

  });

});
