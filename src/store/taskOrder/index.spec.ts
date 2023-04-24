
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import TaskOrder, { TaskOrderStore } from "../taskOrder/index";
import { TaskOrderDTO } from '@/api/models';
import { getModule } from 'vuex-module-decorators';
import storeHelperFunctions  from "../helpers";
const localVue = createLocalVue();
localVue.use(Vuex);

const mutations = TaskOrderStore.mutations;
const actions = TaskOrderStore.actions;
const getters = TaskOrder.getters;
const state = TaskOrder.state;

const _taskOrder = {
  "clins": "",
  "incrementally_funded": "YES",
  "funds_obligated": "0",
  "sys_mod_count": "0",
  "task_order_number": "",
  "task_order_status": "",
  "portfolio": "",
  "funding_plan": "",
  "pop_end_date": "",
  "pop_start_date": "",
  "funds_total": "0",
  "acquisition_package": ''
}

describe("Task Order Store", () => {
  let taskOrderStore: TaskOrderStore;

  beforeEach(() => {
    const createStore = (storeOptions: any = {}):
    Store<{ taskOrder: TaskOrderDTO }> => new Vuex.Store({ ...storeOptions });
    taskOrderStore = getModule(TaskOrderStore, createStore());
  })
  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  it('Test setInitialized()- sets initialized to the passed in value', async () => {
    //mocks sessionStorage retrieval
    jest.spyOn(storeHelperFunctions, "retrieveSession").mockReturnValue(
      JSON.stringify({
        "clins": "",
      })
    );
    await taskOrderStore.initialize("dummyAcqPackageId");
    expect(taskOrderStore.initialized).toBe(true)
  })

  it('Test setInitialized()- sets initialized to the passed in value', async () => {
   
    taskOrderStore.setTaskOrder(_taskOrder)
    
    //mocks sessionStorage retrieval
    jest.spyOn(storeHelperFunctions, "retrieveSession").mockReturnValue(
      JSON.stringify({
        "sys_id": "sysID",
      })
    );
    const result = await taskOrderStore.isIncrementallyFunded();
    expect(taskOrderStore.taskOrder).toEqual(_taskOrder);
    expect(result).toBe(_taskOrder["incrementally_funded"]);
  })

})


