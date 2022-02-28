
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import StepsStore from "@/store/steps"
import { buildStepList } from "../helpers";
import { StepsState } from '../types';


const localVue = createLocalVue();
localVue.use(Vuex);
 const stepperRoutes= [
  {
    path: "/",
    stepNumber: "01",
    name: "PARENT_STEP_ONE",
    completePercentageWeight: 15,
    menuText: "Parent Step One",
    children: [
      {
        menuText: "Child Step One",
        name: "CHILD_STEP_ONE",
        path: "/", // should be same as parent route
        completePercentageWeight: 5,
      },
      {
        menuText: "Child Step Two",
        name: "CHILD_STEP_TWO",
        path: "/two", // should be same as parent route
        completePercentageWeight: 5,
      },
      {
        menuText: "Child Step Three",
        name: "CHILD_STEP_THREE",
        path: "/three", // should be same as parent route
        completePercentageWeight: 5,
      }
    ],
  }, {
    path: "/two",
    stepNumber: "02",
    name: "STEP_TWO",
    completePercentageWeight: 15,
    menuText: "Step Two",
  }];

const storeOptions = {
  modules: {
    steps: StepsStore,
  },
}

const createStore = (storeOptions: any = {}): Store<{
  steps: StepsState
}> => new Vuex.Store({ ...storeOptions });




test('"setCurrentStep" sets "state.currentState" when it exists', () => {

  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(createStore())
  const stepsStore = store.state.steps;
  stepsStore.steps = buildStepList(stepperRoutes);

  const step = stepperRoutes[0];
  const stepOneChildOne = step.children?.length ? step.children[0] : undefined;

  stepsStore.setCurrentStep({stepNumber: step.stepNumber, stepName: step.name});

  expect(stepsStore.currentStep).toBeDefined();
  expect(stepsStore.currentStep?.stepName).toBe(step.name);

  const next = stepsStore.currentStep?.next;

  expect(next).toBeDefined();
  expect(next?.stepName).toBe(stepOneChildOne?.name);
  expect(next?.prev).toBeDefined();
  expect(next?.prev?.stepName).toBe(step.name);
  


})