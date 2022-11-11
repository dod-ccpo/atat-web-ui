import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {ClassificationRequirementsStore} from "@/store/classificationRequirements";
import { getModule } from 'vuex-module-decorators';

const localVue = createLocalVue();
localVue.use(Vuex);

const EnvironmentInstance = [{
  /* eslint-disable camelcase */
  storage_amount: "",
  storage_type: "",
  instance_name: "",
  classification_level: "test 2",
  number_of_vcpus: "",
  data_egress_monthly_amount: "",
  performance_tier: "",
  pricing_model_expiration: "",
  csp_region: "",
  memory_unit: "",
  storage_unit: "",
  pricing_model: "",
  instance_location: "",
  memory_amount: "",
  operating_system_licensing: "",
  data_egress_monthly_unit: ""
}]

const Classifications = [{
  impact_level: 'IL2',
  classification: 'test 2'
}]

const savedClassifications = [{
  impact_level: 'IL2',
  classification: 'test 2'
},
{
  impact_level: 'IL4',
  classification: 'test 4'
}]
const storedEnvironmentInstance = [
  {
  /* eslint-disable camelcase */
    storage_amount: "",
    storage_type: "",
    instance_name: "",
    classification_level: {
      value: "test 2",
      link: "",
    },
    number_of_vcpus: "",
    data_egress_monthly_amount: "",
    performance_tier: "",
    pricing_model_expiration: "",
    csp_region: "",
    memory_unit: "",
    storage_unit: "",
    pricing_model: "",
    instance_location: "",
    memory_amount: "",
    operating_system_licensing: "",
    data_egress_monthly_unit: "",
    sys_id:'test 2'
  },
  {
    /* eslint-disable camelcase */
    storage_amount: "",
    storage_type: "",
    instance_name: "",
    classification_level: "",
    number_of_vcpus: "",
    data_egress_monthly_amount: "",
    performance_tier: "",
    pricing_model_expiration: "",
    csp_region: "",
    memory_unit: "",
    storage_unit: "",
    pricing_model: "",
    instance_location: "",
    memory_amount: "",
    operating_system_licensing: "",
    data_egress_monthly_unit: "",
    sys_id:'test 1'
  },
  {
    /* eslint-disable camelcase */
    storage_amount: "",
    storage_type: "",
    instance_name: "",
    classification_level: "",
    number_of_vcpus: "",
    data_egress_monthly_amount: "",
    performance_tier: "",
    pricing_model_expiration: "",
    csp_region: "",
    memory_unit: "",
    storage_unit: "",
    pricing_model: "",
    instance_location: "",
    memory_amount: "",
    operating_system_licensing: "",
    data_egress_monthly_unit: "",
    sys_id:''
  },
];
const envClassification = [
  {
    impact_level: 'IL2',
    classification: 'test 2',
    sys_id:'test 2'
  },
  {
    impact_level: 'IL4',
    classification: 'test 4',
    sys_id:'test 3'
  }
]


describe("Classification Requirements Store", ()=> {
  let ClassificationStore: ClassificationRequirementsStore;

  beforeEach(()=>{
    const createStore = (storeOptions: any = {}):
    Store<{ ClassificationStore: any}> => new Vuex.Store({ ...storeOptions });
    ClassificationStore = getModule(ClassificationRequirementsStore, createStore());
  })
  test('Test ensureInitialized ', () => {
    ClassificationStore.ensureInitialized()
    expect(ClassificationStore.initialized).toBe(false)
  })

  test('Test setEnvironmentInstances sets the environmentInstances', () => {
    ClassificationStore.setEnvironmentInstance(EnvironmentInstance)
    expect(ClassificationStore.environmentInstances).toBe(EnvironmentInstance)
  })

  test('Test setClassifications sets the classificationLevels ', () => {
    ClassificationStore.setClassifications(Classifications)
    expect(ClassificationStore.classificationLevels).toBe(Classifications)
  })

  test('Test setSelectedClassificationLevels sets the selectedClassificationLevels ', () => {
    ClassificationStore.setSelectedClassificationLevels(Classifications)
    expect(ClassificationStore.selectedClassificationLevels).toBe(Classifications)
  })

  test('Test setCurrentENVClassificationLevels sets the currentEnvClassificationLevels ', () => {
    ClassificationStore.setCurrentENVClassificationLevels(Classifications)
    expect(ClassificationStore.currentEnvClassificationLevels).toBe(Classifications)
  })


  test('Test getSelectedClassificationLevels returns SelectedClassification', async () => {
    const selectedClassifications = await ClassificationStore.getSelectedClassificationLevels()
    expect(selectedClassifications).toBe(Classifications)
  })

  // test('Test getCurrentENVClassificationLevels returns currentEnvClassificationLevels', 
  // async () => {
  //   const selectedENVClassifications 
  //     = await ClassificationStore.getCurrentENVClassificationLevels()
  //   expect(selectedENVClassifications).toBe(Classifications)
  // })

  test('Test getAllClassificationLevels returns classificationLevels', async () =>
  {
    const classifications = await ClassificationStore.getAllClassificationLevels()
    expect(classifications).toStrictEqual(Classifications)
  })

  // test('Test saveSelectedClassificationInstances returns classificationLevels', async () =>
  // {
  //   await ClassificationStore.setCurrentENVClassificationLevels(envClassification)
  //   await ClassificationStore.setEnvironmentInstance(storedEnvironmentInstance)
  //   await ClassificationStore.saveSelectedClassificationInstances(savedClassifications)
  //   expect(ClassificationStore.currentEnvClassificationLevels).toBe(savedClassifications)
  // })


  // test('Test saveSelectedClassificationInstances if branch', async () =>
  // {
  //   await ClassificationStore.setCurrentENVClassificationLevels(envClassification)
  //   await ClassificationStore.setEnvironmentInstance(storedEnvironmentInstance)

  //   await ClassificationStore.saveSelectedClassificationInstances(envClassification)
  //   expect(ClassificationStore.currentEnvClassificationLevels).toBeDefined()
  // })
})
