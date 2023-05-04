import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {ClassificationRequirementsStore} from "@/store/classificationRequirements";
import { getModule } from 'vuex-module-decorators';
import { CrossDomainSolution } from 'types/Global';
import api from '@/api';
import { CrossDomainSolutionDTO, IgceEstimateDTO } from '@/api/models';

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
const igceDTO: IgceEstimateDTO = {
  classification_level: "",
  environment_instance: "",
  acquisition_package: {
    link: "https://dapps.mil/",
    value: "acqPkg123"
  },
  description: "U_TO_S (57 GB/month), S_TO_TS (57 GB/month)",
  cross_domain_solution: {
    link: "https://dapps.mil/",
    value: "abc123"
  },
  sys_tags: "",
  title: "Cross Domain Solution (CDS)",
  unit_price: 456789,
  idiq_clin_type: "",
  contract_type: "FFP",
  sys_id: "igceEstimateCDS12345",
  unit: "MONTH"
}

/* eslint-ensable camelcase */

describe("Classification Requirements Store", ()=> {
  let ClassificationStore: ClassificationRequirementsStore;

  beforeEach(()=>{
    jest.clearAllMocks()
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
    
    jest.spyOn(api.igceEstimateTable, 'getQuery')
      .mockImplementation(() => Promise.resolve([igceDTO]))
    
    jest.spyOn(api.igceEstimateTable, 'remove')
      .mockImplementation(() => Promise.resolve())

    jest.spyOn(api.crossDomainSolutionTable, 'update')
      .mockImplementation(() => Promise.resolve({...cdsDTO}))
    await ClassificationStore.removeCdsSolution()
    expect(ClassificationStore.cdsSolution?.cross_domain_solution_required).toBe("NO")
  })

  test('Test getCDSInIGCEEstimateTable returns CDS', async () => {
    jest.spyOn(api.igceEstimateTable, 'getQuery')
      .mockImplementation(() => Promise.resolve([igceDTO]))
    const igceCDS = await ClassificationStore.getCDSInIGCEEstimateTable(cdsDTO.sys_id as string)
    expect(igceCDS).toStrictEqual(igceDTO.sys_id)
  })

  test('Test deleteCDSInIGCEEstimateTable removes CDS from IGCE', async () => {
    const removeIgceRecord = jest.spyOn(api.igceEstimateTable, 'remove')
      .mockImplementation(() => Promise.resolve())
    await ClassificationStore.delectCDSInIGCEEstimateTable(igceDTO.sys_id as string)
    expect(removeIgceRecord).toHaveBeenCalledTimes(1)
  })
})
