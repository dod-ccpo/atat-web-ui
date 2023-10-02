import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CreateEvalPlan from "@/steps/02-EvaluationCriteria/EvalPlan/CreateEvalPlan.vue";
import validators from "@/plugins/validation";
import SlideoutPanel from "@/store/slideoutPanel";
import { EvaluationPlanDTO } from "@/api/models";
import { initial } from "cypress/types/lodash";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";

Vue.use(Vuetify);


/* eslint-disable camelcase */
const initialEvalPlan: EvaluationPlanDTO = {
  source_selection: "",
  method: "",
  standard_specifications: "",
  custom_specifications: "",    
};

const evalPlanPopulated: EvaluationPlanDTO = {
  source_selection: "TECH_PROPOSAL",
  method: "BVTO",
  standard_specifications: "",
  custom_specifications: "",    
} ;
/* eslint-enable camelcase */

describe("Testing CreateEvalPlan Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CreateEvalPlan, {
      vuetify,
      localVue
    });
  });

  describe("testing CreateEvalPlan render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("testing methods", () => {
    it("tests openSlideoutPanel with an event", async () => {
      const isSlideOutOpen = SlideoutPanel.slideoutPanelIsOpen
      const eObject = {
        currentTarget: 'test',
        preventDefault: jest.fn(),
        cancelBubble: false,
      }
      await wrapper.vm.openSlideoutPanel(eObject); 
      wrapper.vm.$nextTick(()=> expect(isSlideOutOpen).toBe(true))       
    });

    it("getter - currentData() - returns current data object", async () => {
      await wrapper.setData({
        sourceSelection: "TechProposal"
      });
      const data = wrapper.vm.currentData;
      expect(data.source_selection).toBe("TECH_PROPOSAL");
    });

    it("loadOnEnter() - gets eval plan data from store", async () => {
      await EvaluationPlan.setEvaluationPlan(evalPlanPopulated);
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.sourceSelection).toBe("TECH_PROPOSAL")
    });

    it("saveOnLeave() - saves eval plan data to store", async () => {
      await EvaluationPlan.setEvaluationPlan(initialEvalPlan);
      // await wrapper.vm.loadOnEnter();
      await wrapper.setData({
        sourceSelection: "TECH_PROPOSAL",
        selectedMethod: "BVTO",
        savedData: {
          // eslint-disable-next-line camelcase
          source_selection: "foo",
          method: "LPTA",
        }
      });
      Vue.nextTick(async () => {
        await wrapper.vm.saveOnLeave();
        const hasChanged = wrapper.vm.hasChanged;
        console.log("FOOOO")
        expect(hasChanged).toBeTruthy();
        console.log("BAAARRR")
        const evalPlanDataFromStore = EvaluationPlan.evaluationPlan as EvaluationPlanDTO;
        console.log("BAZZZZ")
        expect(evalPlanDataFromStore?.source_selection).toBe("TECH_PROPOSAL")  
        console.log("QUXXXX")
      })
    });
    it("Watcher - sourceSelection - resets current method", async () => {
      wrapper.vm.$data.sourceSelection = "TECH_PROPOSAL";
      wrapper.vm.$data.selectedMethod = "LPTA";
      expect(wrapper.vm.currentData.method).toBe("LPTA");
      Vue.nextTick(() => {
        wrapper.vm.$data.sourceSelection = "NO_TECH_PROPOSAL";
        expect(wrapper.vm.currentData.method).toBe("");  
      })
    });

    it("getters - methodOptions() - returns options for TechProposal required", async () => {
      wrapper.vm.$data.techProposalOptions = ["A"];
      wrapper.vm.$data.lumpSumOptions = ["B", "C"];
      wrapper.vm.$data.sourceSelection = "TECH_PROPOSAL";
      const options = wrapper.vm.methodOptions;
      expect(options.length).toBe(1);
    });

    it("getters - methodOptions() - returns options for SetLumpSum", async () => {
      wrapper.vm.$data.techProposalOptions = ["A"];
      wrapper.vm.$data.lumpSumOptions = ["B", "C"];
      wrapper.vm.$data.sourceSelection = "SET_LUMP_SUM";
      const options = wrapper.vm.methodOptions;
      expect(options.length).toBe(2);
    });

    it("getters - methodMessagingSubstr() - returns substring for TechProposal", async () => {
      wrapper.vm.$data.sourceSelection = "TECH_PROPOSAL";
      const substr = wrapper.vm.methodMessagingSubstr;
      expect(substr).toBe("method of evaluation");
    })

    it("getters - methodMessagingSubstr() - returns substring for NOT TechProposal", async () => {
      wrapper.vm.$data.sourceSelection = "NO_TECH_PROPOSAL";
      const substr = wrapper.vm.methodMessagingSubstr;
      expect(substr).toBe("technique");
    })


  });

});
