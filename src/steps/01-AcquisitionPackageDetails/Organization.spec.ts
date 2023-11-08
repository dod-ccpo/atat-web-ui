/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import Organization from "@/steps/01-AcquisitionPackageDetails/Organization.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { AgencyDTO, OrganizationDTO, StateDTO } from "@/api/models";
import api from "@/api";
import { SelectData } from "types/Global";
import * as helpers from "@/helpers";

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
  { 
    text: "Defense Information Systems Agency (DISA)", 
    value: "DEFENSE INFORMATION SYSTEMS AGENCY (DISA)" 
  }
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

  const wrapper: VueWrapper = shallowMount(Organization, {
    props: {},
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)


  beforeEach(() => {
    
    vi.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      () => Promise.resolve(mockOrganizationDTO)
    );

    vi.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      () => Promise.resolve()
    );
    
    vi.spyOn(helpers, 'convertAgencyRecordToSelect').mockImplementation((): SelectData[] => {
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

    vi.spyOn(helpers, 'convertSystemChoiceToSelect').mockImplementation((): SelectData[] => {
      return disaOrgsList
    })

    vi.spyOn(api.statesTable, 'all').mockImplementation(async (): Promise<StateDTO[]> => {
      return [
        { name: "Alabama", key: "AL"},
        { name: "California", key: "CA"},
      ]
    })

  });

  it("renders successfully", async () => {
    vi.spyOn(AcquisitionPackage, 'initialize').mockImplementation(
      () => Promise.resolve()
    );
    expect(wrapper.exists()).toBe(true);
  });
  
  it("loadOnEnter() - returns storeData successfully", async () => {
    await vm.loadOnEnter();  
    expect(await vm.$data.savedData['disa_organization']).toBe(disaOrgsList[0].value);
  });

  it("agencyChanged() - should set selected org and clear org name for DISA org", async () => {
    vm.$data.selectedDisaOrg = disaOrgsList[2];
    vm.$data.selectedAgency = disaOrgsList[2];

    await vm.agencyChanged(disaOrgsList[0]);
    expect(await vm.$data.selectedDisaOrg).toMatchObject(disaOrgsList[2]);
    expect(await vm.$data.organizationName).toBe("");
  });

  it("agencyChanged() - should clear selected org and set org name for non-DISA org", async () => {
    vm.$data.selectedDisaOrg = disaOrgsList[1];
    vm.$data.selectedAgency = disaOrgsList[1];
    vm.$data.organizationName = "mockOrg";

    await vm.agencyChanged(disaOrgsList[0]);
    expect(await vm.$data.selectedDisaOrg).toMatchObject({ text: "", value: ""});
    expect(await vm.$data.organizationName).toBe("mockOrg");
  });
  
  it("selectedAgency - set agency to ensure currentData.selectedAgency updates", async () => {
    await wrapper.setData({
      selectedAgency: {
        text: agencyRecords[0].label,
        value: agencyRecords[0].title,
      }
    })

    const currentAgency = await vm.currentData
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
    const savedData = await vm.savedData
    const currentData = await vm.currentData
    await vm.hasChanged()
    expect(currentData.agency).not.toBe(savedData.agency)
    expect(currentData.disa_organization).not.toBe(savedData.disa_organization)
  });

  it("saveOnLeave() -  save organization data", async () => {
    await wrapper.setData({
      currentData: {
        ...mockOrganizationDTOCurrent,
        address_type: "US",
      } 
    })
    const saveOnLeave = await vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy()
  });

  it("saveOnLeave() - should catch and log error", async () => {
    console.log = vi.fn();
    vi.spyOn(AcquisitionPackage, 'saveData').mockImplementation(() => {
      throw new Error("mock error");
    });
    await vm.saveOnLeave();
    expect(console.log).toHaveBeenCalledWith(Error("mock error"));
  });

  it.each(["US", "MILITARY", "FOREIGN"])
  ("selected address data", async (addressType) => {
    await wrapper.setData({
      countryListData: countryList,
      selectedAddressType: addressType,
      selectedState: statesList[0],
      selectedMilitaryPO: vm.$data.militaryPostOfficeOptions[1],
      selectedStateCode: statesList[0],
      selectedCountry: {
        text: countryList[0].text,
        value: countryList[0].value,
      },
      stateOrProvidence: "AP",
    })
    await vm.setSelectedData()
    const saveOnLeave = await vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy()
  });

  it.skip("inputClass() - setting $vuetify.breakpoint.mdAndDown false to retrieve class", 
    async ()=>{
      vm.$vuetify.breakpoint.mdAndDown = false;
      const inputClass = await vm.inputClass;
      expect(inputClass).toBe("my-2");
    });

  it.skip("inputClass() - setting $vuetify.breakpoint.mdAndDown true to retrieve class", async ()=>{
    vm.$vuetify.breakpoint.mdAndDown = true;
    const inputClass = await vm.inputClass;
    expect(inputClass).toBe("_input-max-width my-2");
  });
})
