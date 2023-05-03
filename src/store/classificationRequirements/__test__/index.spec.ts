import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {ClassificationRequirementsStore} from "@/store/classificationRequirements";
import { getModule } from 'vuex-module-decorators';
import { CrossDomainSolution } from 'types/Global';
import api from '@/api';
import { CrossDomainSolutionDTO } from '@/api/models';

const localVue = createLocalVue();
localVue.use(Vuex);

/* eslint-disable camelcase */
const Classifications = [{
  impact_level: 'IL2',
  classification: 'test 2'
}]

const savedClassifications = [{
  impact_level: 'IL2',
  classification: 'test 2',
  sys_id:"level1",
  classification_level: {value: "v1", link: ""},
  acquisition_package: {value: "a1", link: ""}
},
{
  impact_level: 'IL4',
  classification: 'test 4',
  sys_id:"level2",
  classification_level: {value: "v2", link: ""},
  acquisition_package: {value: "a1", link: ""}
}]

const cdsSolution:CrossDomainSolution = {
  crossDomainSolutionRequired: "YES",
  entireDuration: "YES",
  anticipatedNeedUsage: "Sample Statement",
  solutionType:[{
    type: "A_TO_B",
    dataQuantity: 5
  }],
  projectedFileStream:"application/json",
  selectedPeriods: [""],
}
// const cdsSysId = "abc123"
const cdsDTO: CrossDomainSolutionDTO = {
  sys_id: "abc123",
  acquisition_package: "de456",
  anticipated_need_or_usage: "Sample Statement",
  cross_domain_solution_required: "YES",
  need_for_entire_task_order_duration: "YES",
  projected_file_stream_type: "application/json",
  selected_periods: "",
  traffic_per_domain_pair: "'type':'A_TO_B','dataQuantity',5"
}
/* eslint-ensable camelcase */

describe("Classification Requirements Store", ()=> {
  let ClassificationStore: ClassificationRequirementsStore;

  beforeEach(()=>{
    const createStore = (storeOptions: any = {}):
    Store<{ ClassificationStore: any}> => new Vuex.Store({ ...storeOptions });
    ClassificationStore = getModule(ClassificationRequirementsStore, createStore());
  })

  test('Test setClassifications sets the classificationLevels ', () => {
    ClassificationStore.setClassifications(Classifications)
    expect(ClassificationStore.classificationLevels).toBe(Classifications)
  })

  test('Test setSelectedClassificationLevels sets the selectedClassificationLevel ', () => {
    ClassificationStore.setSelectedClassificationLevels(savedClassifications)
    expect(ClassificationStore.selectedClassificationLevels).toBe(savedClassifications)
  })

  test('Test getSelectedClassificationLevels returns SelectedClassification', async () => {
    const selectedClassifications = await ClassificationStore.getSelectedClassificationLevels()
    expect(selectedClassifications).toBe(savedClassifications)
  })

  test('Test getAllClassificationLevels returns classificationLevels', async () =>
  {
    const classifications = await ClassificationStore.getAllClassificationLevels()
    expect(classifications).toStrictEqual(Classifications);
  })

  test('Remove CDS entry from store', async () => {
    
    jest.spyOn(api.crossDomainSolutionTable,'create').mockImplementation(
      () => Promise.resolve({...cdsDTO}))
    await ClassificationStore.setCdsSolution(cdsSolution)
    expect(ClassificationStore.cdsSolution?.cross_domain_solution_required).toBe("YES")
    
    jest.spyOn(api.crossDomainSolutionTable, 'update')
      .mockImplementation(() => Promise.resolve({...cdsDTO}))
    await ClassificationStore.removeCdsSolution()
    expect(ClassificationStore.cdsSolution?.cross_domain_solution_required).toBe("NO")
  })

})
