import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import stepperNav from "@/wizard/Navigation/StepperNavigation.vue";
import { createLocalVue, mount } from "@vue/test-utils";

Vue.use(Vuetify);

const propsData = {
  Steps: [
    {
      step: 1,
      description: "Create Portfolio",
    },
    {
      step: 2,
      description: "Add Funding",
    },
    {
      step: 3,
      description: "Add Application",
    },
    {
      step: 4,
      description: "Add Team Members",
    },
    {
      step: 5,
      description: "Review and Submit",
    },
  ],
};

describe("Testing Stepper Navigation", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;
  let store: any;
  let state: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    state = {
      erroredSteps: [3, 4],
    };
    store = new Vuex.Store({ state });

    wrapper = mount(stepperNav, {
      store,
      localVue,
      vuetify,
      propsData: {
        propsData: propsData,
      },
    });
  });

  it("stepper navigation initialized", () => {
    const mountedSteps = wrapper.findAll(".wizard-stepper").length;
    const expectedSteps = propsData.Steps.length;
    expect(mountedSteps === expectedSteps);
  });

  it("step-01 clicked", async () => {
    await wrapper.find("#step_01").trigger("click");
    expect(wrapper.vm.getStepNumber).toBe(1);
    await wrapper.vm.$nextTick();
    await wrapper.find("#step_02").trigger("click");
    expect(wrapper.vm.currentStepNumber).toBe(3);
  });

  it("get getStepDescription function()", async () => {
    await wrapper.setProps({ stepNumber: 2 });
    expect(wrapper.vm.getStepDescription()).toBe("Add Funding");
  });

  it("get 'get getStepNumber' function()", async () => {
    await wrapper.setProps({ stepNumber: 2 });
    expect(wrapper.vm.getStepNumber).toBe(2);
  });

  it("get isStepComplete function()", async () => {
    const isStepComplete = wrapper.vm.isStepComplete(3);
    expect(isStepComplete).toBe(false);
  });

  it("clickedAction function()", async () => {
    await wrapper.vm.$emit("clickedAction", 4);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().clickedAction[0][0]).toBe(4);
  });
});
