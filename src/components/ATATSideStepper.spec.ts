import Vue from "vue";
import Vuetify from "vuetify";

import { createLocalVue, mount,  Wrapper } from "@vue/test-utils";
import ATATSideStepper from "@/components/ATATSideStepper.vue";
import { StepperStep } from "../../types/Global";

import { DefaultProps } from "vue/types/options";
import VueRouter from "vue-router";
Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueRouter);

describe("Testing ATATTextField Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  let steps: StepperStep[] = [
    {
      name: "",
      menuText: "First Step",
      stepNumber: "1",
      completed: false,
      completePercentageWeight: 5,
      route: "/",
      subSteps: [
        {
          name: "Sub_Step_1",
          menuText: "Sub Step 1",
          route: "sub-step-1",
          stepNumber: "1",
          completePercentageWeight: 5,
        },
      ],
    },
    {
      name: "Second_Step",
      menuText: "Second Step",
      stepNumber: "2",
      completed: true,
      completePercentageWeight: 5,
      route: "second-step",
      subSteps: [
        {
          name: "Sub_Step_2",
          menuText: "Sub Step 2",
          route: "sub-step-2",
          stepNumber: "2",
          completed: true,
          completePercentageWeight: 5,
        },
      ],
    },
  ];

  const router = new VueRouter({
    routes: [
      {
        name: "First_Step",
        path: "first-step",
        children: [
          {
            name: "Sub_Step_1",
            path: "sub-step-1",
          },
        ],
      },
      {
        name: "Second_Step",
        path: "second-step",
        children: [
          {
            name: "Sub_Step_2",
            path: "sub-step-2",
          },
        ],
      },
      {
        name: "Third_Step",
        path: "third-step",
      },
    ],
  });

  const refreshWrapper = () => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSideStepper, {
      localVue,
      router,
      vuetify,
      propsData: {
        stepperData: steps,
      },
    });
  };

  beforeEach(() => {
    refreshWrapper();
  });

  describe("Sanity Check", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
      const active = wrapper.find(".active-step");
      expect(active.exists()).toBe(true);
      expect(wrapper.vm.activeStep).toBe("1");
    });
  });

  describe("ATATStepperSteps", () => {
    it("Setting current step should have .active class", async () => {
      wrapper.vm.setCurrentStep("2");
      const active = wrapper.find(".active-step");
      expect(active.exists()).toBe(true);
      expect(wrapper.vm.activeStep).toBe("2");
    });

    it("it should have the correct number of stepper links", async () => {
      expect(wrapper.findAll(".v-list-item").length).toBe(2);
    });
  });

  describe("Calculate Percentage Weight", () => {
    it("It should return an accurate value", async () => {
      wrapper.vm.calculatePercentComplete();
      expect(wrapper.vm.percentComplete).toEqual(0);
    });

    it("It should calculate a completed child percent", () => {
      steps = [
        {
          name: "",
          menuText: "First Step",
          stepNumber: "1",
          completePercentageWeight: 5,
          route: "/",
          subSteps: [
            {
              name: "Sub_Step_1",
              menuText: "Sub Step 1",
              route: "sub-step-1",
              stepNumber: "1",
              completePercentageWeight: 5,
            },
          ],
        },
        {
          name: "Second_Step",
          menuText: "Second Step",
          stepNumber: "2",
          completePercentageWeight: 5,
          route: "second-step",
          subSteps: [
            {
              name: "Sub_Step_2",
              menuText: "Sub Step 2",
              route: "sub-step-2",
              stepNumber: "2",
              completed: true,
              completePercentageWeight: 5,
            },
          ],
        },
      ];

      refreshWrapper();
      wrapper.vm.calculatePercentComplete();
      expect(wrapper.vm.percentComplete).toEqual(0);
    });
  });

  describe("Get Route Name", () => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSideStepper, {
      localVue,
      router,
      vuetify,
      propsData: {
        stepperData: [],
      },
    });

    it("It should return the correct step name", async ()=> {

      const step2 = steps[1];
      const step2Name = step2.name;
      const routeName = wrapper.vm.getRouteName(step2);
      expect(routeName).toEqual(step2Name);

    });


    it("It should return the name of the first child step for a no named parent", async () => {
      const step1ChildRouteName = steps[0].subSteps?.[0].name || "";
      const routeName = wrapper.vm.getRouteName(steps[0]);
      expect(routeName).toEqual(step1ChildRouteName);
    });

   
    it("It should throw an error if the step has no name and no sub steps", async () => {
      const step: StepperStep = {
        name: "",
        route: "test-step",
        subSteps: [],
      };

      try {
        wrapper.vm.getRouteName(step);
      } catch (error) {
        expect(error).toEqual(
          new Error(`step: ${JSON.stringify(step)} doesn't have a name defined`)
        );
      }
    });
  });
});
