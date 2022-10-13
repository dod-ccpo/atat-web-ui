/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import Organization from "@/steps/01-AcquisitionPackageDetails/Organization.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { AgencyDTO, OrganizationDTO, StateDTO } from "@/api/models";
import api from "@/api";
import { SelectData } from "types/Global";
import * as helpers from "@/helpers";
Vue.use(Vuetify);

// selects
const agencyRecords: AgencyDTO[] = [
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
]
const disaOrgsList: SelectData[] = [
  { text: "Assistant to the Director (DD)", value: "ASSISTANT_TO_THE_DIRECTOR" },
  { text: "Chief of Staff (DDC)", value: "CHIEF_OF_STAFF" },
]
const statesList: SelectData[] = [
  { text: "Alabama", value: "AL"},
  { text: "California", value: "CA"},
]

const countryList: SelectData[] = [
  { text: "Algeria", value: "DZ"},
  { text: "Antigua and Barbuda", value: "AG"},
]

describe("Testing Organization Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  const mockOrganizationDTO: OrganizationDTO = {
    disa_organization: disaOrgsList[0].value,
    organization_name: "",
    dodaac: "",
    agency: agencyRecords[0].title,
    address_type: "",
    street_address_1: "",
    street_address_2: "",
    city: "",
    zip_code: "",
    state: "",
    country: "US",
  }; 

  const mockOrganizationDTOCurrent = {
    disa_organization: "",
    organization_name: "",
    dodaac: "",
    agency: "",
    address_type: "",
    street_address_1: "",
    street_address_2: "",
    city: "Unknown",
    zip_code: "",
    state: "CA",
    country: "US",
  }; 


  beforeEach(() => {
    
    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      () => Promise.resolve(mockOrganizationDTO)
    );

    jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      () => Promise.resolve()
    );
    

    jest.spyOn(helpers, 'convertAgencyRecordToSelect').mockImplementation((): SelectData[] => {
      return [
        {
          text: agencyRecords[0].label,
          value: agencyRecords[0].title,
        },
        {
          text: agencyRecords[1].label,
          value: agencyRecords[1].title,
        }
      ]
    })
    jest.spyOn(helpers, 'convertSystemChoiceToSelect').mockImplementation((): SelectData[] => {
      return disaOrgsList
    })
    jest.spyOn(api.statesTable, 'all').mockImplementation(async (): Promise<StateDTO[]> => {
      return [
        { name: "Alabama", key: "AL"},
        { name: "California", key: "CA"},
      ]
    })

    vuetify = new Vuetify();
    wrapper = mount(Organization, {
      localVue,
      vuetify,
    });

  });

  afterEach(()=>{
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  
  it("loadOnEnter() - returns storeData successfully", async () => {
    await wrapper.vm.loadOnEnter();  
    expect(await wrapper.vm.$data.savedData['disa_organization']).toBe(disaOrgsList[0].value);
  });
  
  it("selectedAgency - set agency to ensure currentData.selectedAgency updates", async () => {
    await wrapper.setData({
      selectedAgency: {
        text: agencyRecords[0].label,
        value: agencyRecords[0].title,
      }
    })

    const currentAgency = await wrapper.vm.currentData
    expect(currentAgency.agency).toBe(agencyRecords[0].title);
  });

  it("hasChanged() -  change organization store data", async () => {
    await wrapper.setData({
      selectedAgency: {
        text: agencyRecords[1].label,
        value: agencyRecords[1].title,
      },
      selectedDisaOrg: { 
        text: disaOrgsList[1].text,
        value: disaOrgsList[1].value,
      },
      selectedState: {
        text: "Alabama",
        value: "AL"
      }
    })
    const savedData = await wrapper.vm.savedData
    const currentData = await wrapper.vm.currentData
    await wrapper.vm.hasChanged()
    expect(currentData.agency).not.toBe(savedData.agency)
    expect(currentData.disa_organization).not.toBe(savedData.disa_organization)
  })
  it("saveOnLeave() -  save organization data", async () => {
    await wrapper.setData({
      currentData: {
        ...mockOrganizationDTOCurrent,
        address_type: "US",
      } 
    })
    const saveOnLeave = await wrapper.vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy()
  })
  it.each(["US", "MILITARY", "FOREIGN"])
  ("selected address data", async (addressType) => {
    await wrapper.setData({
      countryListData: countryList,
      selectedAddressType: addressType,
      selectedState: statesList[0],
      selectedMilitaryPO: wrapper.vm.$data.militaryPostOfficeOptions[1],
      selectedStateCode: statesList[0],
      selectedCountry: {
        text: countryList[0].text,
        value: countryList[0].value,
      },
      stateOrProvidence: "AP",
    })
    await wrapper.vm.setSelectedData()
    const saveOnLeave = await wrapper.vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy()
  })
  it("inputClass() - setting $vuetify.breakpoint.mdAndDown false to retrieve class", async ()=>{
    wrapper.vm.$vuetify.breakpoint.mdAndDown = false;
    const inputClass = await wrapper.vm.inputClass;
    expect(inputClass).toBe("my-2");
  })
  it("inputClass() - setting $vuetify.breakpoint.mdAndDown true to retrieve class", async ()=>{
    wrapper.vm.$vuetify.breakpoint.mdAndDown = true;
    const inputClass = await wrapper.vm.inputClass;
    expect(inputClass).toBe("_input-max-width my-2");
  })
})
