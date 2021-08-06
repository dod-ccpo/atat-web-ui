import Vue from "vue";
import Vuetify from "vuetify";
// import { jest } from "@vue/cli-plugin-unit-jest"
Vue.use(Vuetify);
Vue.config.productionTip = false;
import sinon from 'sinon'

import stepperNav from "@/wizard/Navigation/StepperNavigation.vue";

import { shallowMount } from "@vue/test-utils";

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

describe("Testing Button Navigation Bar", () => {
  // let shallowMountFunction: (options?: object) => Wrapper<Vue>
  let sMount: any;
  beforeEach(() => {
    sMount = shallowMount(stepperNav, {
      propsData: {
        propsData: propsData,
      },
      stubs:['#step-01']
    });
  });

  it("stepper navigation initialization", () => {
    const mountedSteps = sMount.findAll(".wizard-stepper").length;
    const expectedSteps = propsData.Steps.length;
    expect(mountedSteps === expectedSteps);
  });

  it("get getStepDescription function()", async () => {
    await sMount.setProps({ stepNumber: 2 });
    expect(sMount.vm.getStepDescription()).toBe('Add Funding');
  });

  it("get 'get getStepNumber' function()", async () => {
    await sMount.setProps({ stepNumber: 2 });
    expect(sMount.vm.getStepNumber).toBe(2);
  });

  it("get 'set getStepNumber' function()", async () => {
    await sMount.setProps({ stepNumber: 3 });
    await sMount.setData({ currentStepNumber: 2 });
    expect(sMount.vm.getStepNumber).toBe(3);
  });


  it("get isStepComplete function()", async () => {
    await sMount.setProps({ stepNumber: 3 });
    expect(sMount.vm.getStepNumber).toBe(3);
    expect(sMount.vm.isStepComplete()).toBe(false);
  });

  // it("clickedAction function()", async () => {
  //   await sMount.vm.$emit("clickedAction", 4);
  //   await sMount.vm.$nextTick();
  //   await sMount.vm.$nextTick();
  //   await sMount.vm.$nextTick();
  //   expect(sMount.emitted().clickedAction[0][0]).toBe(4);
  // });
  
  it("clickedAction function()", async () => {
    const spy = sinon.spy()
    await sMount.vm.$nextTick();
    await sMount.find("#step-01").trigger("click");
    // await sMount.vm.clickedAction(4);
    expect(spy).toHaveBeenCalledWith(1);
  });
});
