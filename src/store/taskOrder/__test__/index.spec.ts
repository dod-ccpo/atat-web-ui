/* eslint-disable camelcase */
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {TaskOrderStore} from "@/store/taskOrder";
import { getModule } from 'vuex-module-decorators';
const localVue = createLocalVue();
localVue.use(Vuex);

// eslint-disable-next-line max-len

const taskOrder = {
  acquisition_package:"",
  clins: "",
  funding_plan: "",
  funding_request: "",
  funds_obligated: "0",
  funds_total: "0",
  incrementally_funded: "YES",
  pop_end_date: "",
  pop_start_date: "",
  portfolio: "",
  sys_id: "",
  sys_mod_count: "1",
  sys_tags: "",
  task_order_number: "",
  task_order_status: ""}

describe("Task Order Store", ()=> {
  let Store: TaskOrderStore;

  beforeEach(() => {
    const createStore = (storeOptions: any = {}):
        Store<{ ClassificationStore: any }> => new Vuex.Store({...storeOptions});
    Store = getModule(TaskOrderStore, createStore());
  })

  test('Test setInitialized()- sets initialized to the passed in value', () => {
    Store.setInitialized(true)
    expect(Store.initialized).toBe(true)
  })

  test('test isIncrementallyFunded()- should return the store value for incrementally_funded',
    async() =>{
      Store.setTaskOrder(taskOrder)
      const result = await Store.isIncrementallyFunded()
      expect(result).toBe("YES")
    })
})
