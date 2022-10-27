/* eslint-disable camelcase */

import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { OrganizationDataStore } from "@/store/organizationData/index";
import { getModule } from 'vuex-module-decorators';
import { AgencyDTO, SystemChoiceDTO } from '@/api/models';
import api from "@/api"
const localVue = createLocalVue();
localVue.use(Vuex);

describe("Organization Store", () => {
  let organizationStore: OrganizationDataStore;

  beforeEach(() => {
    const createStore = (storeOptions: any = {}): Store<{ organization: any }> => 
      new Vuex.Store({ ...storeOptions });
    organizationStore = getModule(OrganizationDataStore, createStore());

    jest.spyOn(api.agencyTable, 'all').mockImplementation(async () => {
      return [
        {
          label: "Defense Information Systems Agency (DISA)",
          title: "DEFENSE INFORMATION SYSTEMS AGENCY (DISA)",
          acronym: "DISA",
          css_id: 99990
        },
        {
          label: "American Forces Information Service (AFIS)",
          title: "AMERICAN FORCES INFORMATION SERVICE",
          acronym: "AFIS",
          css_id: 99991,
        }
      ] as AgencyDTO[]
    })

  })
  jest.spyOn(api.systemChoices, 'getChoices').mockImplementation(async () => {
    return [
      { 
        name: "x_g_dis_atat_organization", 
        label: "Combined Action Group (DDCG)", 
        value: "COMBINED_ACTION_GROUP" 
      },
      { 
        name: "x_g_dis_atat_organization", 
        label: "Chief of Staff (DDC)", 
        value: "CHIEF_OF_STAFF" 
      },
    ] as SystemChoiceDTO[]
  })

  afterEach(()=>{
    jest.clearAllMocks();
  })

  it("Test OrganizationStore initialization", async () => {
    await organizationStore.initialize();
    expect(organizationStore.initialized).toBe(true)
    expect(organizationStore.agency_data.length).toBe(2)
    expect(organizationStore.disa_org_data.length).toBe(2)
  })

  it("Test setting OrganizationStore data", async () => {
    // add agency_data and disa_org_data
    // also simulates if a session is retrieved
    const setOrganizastionData = JSON.stringify({
      agency_data: [
        ...organizationStore.agency_data,
        {
          label: "Federal Bureau Of Investigation (FBI/ITD)",
          title: "FEDERAL BUREAU OF INVESTIGATION",
          acronym: "FBI/ITD",
          css_id: 99993,
        }
      ],
      disa_org_data: [
        ...organizationStore.disa_org_data,
        {
          name: "x_g_dis_atat_organization", 
          label: "Assistant to the Director (DD)", 
          value: "ASSISTANT_TO_THE_DIRECTOR" 
        }
      ],
    })
    organizationStore.setStoreData(setOrganizastionData)
    expect(organizationStore.agency_data.length).toBe(3)
    expect(organizationStore.disa_org_data.length).toBe(3)
  })

})


