import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CreateEvalPlan from "@/steps/02-EvaluationCriteria/EvalPlan/CreateEvalPlan.vue";
import validators from "@/plugins/validation";
import SlideoutPanel from "@/store/slideoutPanel";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { EvaluationPlanDTO } from "@/api/models";
import { initial } from "cypress/types/lodash";

Vue.use(Vuetify);


/* eslint-disable camelcase */
const initialEvalPlan: EvaluationPlanDTO = {
  source_selection: "",
  method: "",
  standard_specifications: [],
  custom_specifications: [],    
};

const evalPlanPopulated: EvaluationPlanDTO = {
  source_selection: "TechProposal",
  method: "BVTO",
  standard_specifications: [],
  custom_specifications: [],    
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

    // it("get currentData() - returns current data object", async () => {
    //   await wrapper.setData({
    //     selectedEvalOption: "TechProposal"
    //   });
    //   const data = wrapper.vm.currentData;
    //   expect(data.source_selection).toBe("TechProposal");
    // });

    // it("loadOnEnter() - gets eval plan data from store", async () => {
    //   await AcquisitionPackage.setEvaluationPlan(evalPlanPopulated);
    //   await wrapper.vm.loadOnEnter();
    //   expect(wrapper.vm.$data.selectedEvalOption).toBe("TechProposal")
    // });

    // it("saveOnLeave() - saves eval plan data to store", async () => {
    //   await AcquisitionPackage.setEvaluationPlan(initialEvalPlan);
    //   await wrapper.vm.loadOnEnter();
    //   await wrapper.setData({
    //     selectedEvalOption: "TechProposal",
    //   });
    //   await wrapper.vm.saveOnLeave();
    //   const hasChanged = wrapper.vm.hasChanged();
    //   expect(hasChanged).toBeTruthy();
    //   const evalPlanDataFromStore = AcquisitionPackage.getEvaluationPlan;
    //   expect(evalPlanDataFromStore?.source_selection).toBe("TechProposal")  
    // });

  });

});
