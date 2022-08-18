/* eslint-disable camelcase */
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {TaskOrderStore} from "@/store/taskOrder";
import { getModule } from 'vuex-module-decorators';
import { retrieveSession } from "@/store/helpers";
const localVue = createLocalVue();
localVue.use(Vuex);

// eslint-disable-next-line max-len
const sessionData = {"taskOrder":{"clins":"","incrementally_funded":"YES","funds_obligated":"0","sys_mod_count":"1","acquisition_package":{"link":"https://disastorefrontdev.servicenowservices.com/api/now/table/x_g_dis_atat_acquisition_package/6bfcf683871d5910bc86b889cebb35f7","value":"6bfcf683871d5910bc86b889cebb35f7"},"task_order_number":"","sys_updated_on":"2022-08-18 16:40:49","sys_tags":"","task_order_status":"","sys_id":"6bfcfe83871d5910bc86b889cebb3573","funding_request":"","sys_updated_by":"devonte.gabriel-ctr@ccpo.mil","portfolio":"","sys_created_on":"2022-08-18 16:40:12","funding_plan":"","pop_end_date":"","pop_start_date":"","funds_total":"0","sys_created_by":"devonte.gabriel-ctr@ccpo.mil"}}

const taskOrder = {
  acquisition_package:"6bfcf683871d5910bc86b889cebb35f7",
  clins: "",
  funding_plan: "",
  funding_request: "",
  funds_obligated: "0",
  funds_total: "0",
  incrementally_funded: "YES",
  pop_end_date: "",
  pop_start_date: "",
  portfolio: "",
  sys_created_by: "devonte.gabriel-ctr@ccpo.mil",
  sys_created_on: "2022-08-18 16:40:12",
  sys_id: "",
  sys_mod_count: "1",
  sys_tags: "",
  sys_updated_by: "devonte.gabriel-ctr@ccpo.mil",
  sys_updated_on: "2022-08-18 16:40:49",
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
