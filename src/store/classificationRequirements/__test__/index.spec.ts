import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {ClassificationRequirementsStore} from "@/store/classificationRequirements";
import { getModule } from 'vuex-module-decorators';

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

})
