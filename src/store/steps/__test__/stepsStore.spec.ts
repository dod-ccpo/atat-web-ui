
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import  {StepsStore} from "@/store/steps"
import { StepRouteResolver, StepsState } from '../types';
import { getModule } from 'vuex-module-decorators';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testRouteResolver = (current: string): string => {
  return "CHILD_STEP_FOUR";
    
}

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
        routeResolver: testRouteResolver,
      },
      {
        menuText: "Child Step Four",
        name: "CHILD_STEP_FOUR",
        path: "/four", // should be same as parent route
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






describe('Steps Store', ()=> {

  let stepsStore: StepsStore;

  beforeEach(()=> {

    const createStore = (storeOptions: any = {}): 
    Store<{ steps: StepsState}> => new Vuex.Store({ ...storeOptions });
    stepsStore = getModule(StepsStore, createStore());
    stepsStore.setSteps(stepperRoutes);
  });

  test('"setCurrentStep" sets "state.currentState" when it exists', () => {

    const step = stepperRoutes[0];
    const stepOneChildOne = step.children?.length ? step.children[0] : undefined;
  
    stepsStore.setCurrentStep(step.name);
  
    expect(stepsStore.currentStep).toBeDefined();
    expect(stepsStore.currentStep?.stepName).toBe(step.name);
  
    const next = stepsStore.currentStep?.next;
  
    expect(next).toBeDefined();
    expect(next).toBe(stepOneChildOne?.name);
  
    stepsStore.setCurrentStep(stepOneChildOne?.name || '');
    const prev = stepsStore.currentStep?.prev;
    expect(prev).toBeDefined();
    expect(prev).toBe(step.name);
  })

  test('step return resolver', async ()=> {

    const startingStep = "CHILD_STEP_TWO";

    stepsStore.setCurrentStep(startingStep);
    expect(stepsStore.currentStep).toBeDefined();
    expect(stepsStore.currentStep?.stepName).toBe(startingStep);

    const nextStepName = await stepsStore.getNext();
    expect(nextStepName).toBeDefined();
    const resolverName = (nextStepName as StepRouteResolver).name;
    expect(resolverName).toBe(testRouteResolver.name);
      
  });
  
})
