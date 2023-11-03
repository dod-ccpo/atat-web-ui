/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import ContactInfo from "@/steps/01-AcquisitionPackageDetails/ContactInfo.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage
  from "@/store/acquisitionPackage";
import { AgencyDTO, ContactDTO, CountryDTO, MilitaryRankDTO, StateDTO, SystemChoiceDTO 
} from "@/api/models";
import api from "@/api"
import ContactData from "@/store/contactData"

describe("Testing ContactInfo Component", () => {

  const mockContactDTO: ContactDTO = {
    first_name: "",
    last_name: "",
    middle_name: "",
    role: "",
    rank_components: "",
    suffix: "",
    salutation: "",
    phone: "",
    phone_extension: "", // not used on Primary Contact contact entry form
    email: "",
    type: "Primary Contact",
    dodaac: "",
    can_access_package: "true",
    grade_civ: "",
    title: "",
    manually_entered: "", // not used on Primary Contact contact entry form
    acquisition_package: ""
  }; 

  const mockLoadedContactDTO: ContactDTO = {
    grade_civ: "",
    role: "MILITARY",
    dodaac: "",
    suffix: "",
    title: "",
    type: "Primary Contact",
    can_access_package: "",
    phone_extension: "",
    first_name: "Jewel",
    email: "",
    last_name: "Heart",
    middle_name: "",
    manually_entered: "false",
    phone: "+15719998888",
    salutation: "",
    rank_components: "sys_id-here", // part of value from rank_components below
    acquisition_package: ""

    // appears that the rank_components changes from an object to a string 
    // not sure if this is intended since in SNOW if empty it is a string, but if populated it
    // is an object and was causing some issues while running unit tests since it is undefined
    // with no value property
    
    // NOTE: additional values seen when getting the contact
    // rank_components: ({
    //   link: "https://dev-number.service-now.com/api/now/table/x_g_dis_atat_military_rank/"  
    //   + "sys_id-here",
    //   value: "sys_id-here"
    // }) as unknown as string,
    // formal_name: "ADM Jewel Heart",
    // sys_id: "8c822141979611106fa8b4b3f153af7f",
    // sys_updated_on: "2022-10-05 22:29:03",
    // sys_updated_by: "test-ctr",
    // phone_and_extension: "",
    // sys_created_on: "2022-09-30 21:59:46",
    // sys_created_by: "test-ctr",
    // sys_mod_count: "2",
    // sys_tags: "",
    // salesforce_id: "",
  }; 

  const wrapper: VueWrapper = shallowMount(ContactInfo, {
    props: {},
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  beforeEach(() => {
    vi.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      () => Promise.resolve(mockContactDTO)
    );

    vi.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      () => Promise.resolve()
    );

    vi.spyOn(AcquisitionPackage, 'getContact').mockImplementation(
      () => Promise.resolve(mockLoadedContactDTO)
    );
        
    vi.spyOn(AcquisitionPackage, 'loadContactInfo').mockImplementation(
      () => Promise.resolve(mockLoadedContactDTO)
    );

    vi.spyOn(AcquisitionPackage, 'saveContactInfo').mockImplementation(
      () => Promise.resolve()
    );

    vi.spyOn(ContactData, 'LoadMilitaryBranches').mockImplementation(async () => {
      return [
        { name: "x_g_dis_atat_military_rank", label: "Air Force", value: "AIR_FORCE" },
        { name: "x_g_dis_atat_military_rank", label: "Army", value: "ARMY" },
        { name: "x_g_dis_atat_military_rank", label: "Navy", value: "NAVY" },
      ] as SystemChoiceDTO[]
    });

    vi.spyOn(ContactData, 'GetMilitaryRank').mockReturnValue(
      new Promise(resolve => resolve({
        name: "Admiral",
        grade: "O-10",
        branch: "NAVY"
      } as MilitaryRankDTO))
    );

    vi.spyOn(api.systemChoices, 'getChoices').mockImplementation(async () => {
      return [
        { name: "x_g_dis_atat_military_rank", label: "Air Force", value: "AIR_FORCE" },
        { name: "x_g_dis_atat_military_rank", label: "Army", value: "ARMY" },
        { name: "x_g_dis_atat_military_rank", label: "Navy", value: "NAVY" },
      ] as SystemChoiceDTO[]
    });

    vi.spyOn(api.militaryRankTable, 'all').mockImplementation(async () => {
      return [
        { name: "Brigadier General (BG)", grade: "O-7", branch: "ARMY"},
        { name: "Admiral (ADM)", grade: "O-10", branch: "NAVY"},
        { name: "Captain (Capt)", grade: "O-3", branch: "AIR_FORCE"},
      ] as MilitaryRankDTO[]
    });

    vi.spyOn(api.countriesTable, 'all').mockImplementation(async () => {
      return [
        { name: "Andorra", iso3166_2: "AD" },
        { name: "Bangladesh", iso3166_2: "BD" },
        { name: "Cyprus", iso3166_2: "CY" },
      ] as CountryDTO[]
    });

    vi.spyOn(api.statesTable, 'all').mockImplementation(async () => {
      return [
        { name: "Alabama", key: "AL"},
        { name: "California", key: "CA"},
      ] as StateDTO[]
    });

    vi.spyOn(api.agencyTable, 'all').mockImplementation(async () => {
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
  });



  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("loadOnEnter() - returns storeData successfully", async () => {
    await wrapper.setData({
      savedData: mockLoadedContactDTO,
    })
    await vm.loadOnEnter()
    expect(await vm.$data.branchData).toHaveLength(3)
  })

  it("branchChange() - update selected branch", async () =>  {
  
    const rank: MilitaryRankDTO = { name: "this", grade: "that", branch: "other" };     
    vi.spyOn(ContactData, 'GetMilitaryRank').mockReturnValue(
      new Promise(resolve => resolve(rank))
    );

    await vm.loadOnEnter(); 
    expect(await vm.$data.selectedRank["name"]).toBe("this")
  })

  it("branchChange() - update selected branch with empty object", async () =>  {
  
    const rank: MilitaryRankDTO = { name: "", grade: "", branch: "" };     
    vi.spyOn(ContactData, 'GetMilitaryRank').mockReturnValue(
      new Promise(resolve => resolve(rank))
    );

    await vm.loadOnEnter(); 
    expect(await vm.$data.selectedRank["name"]).toBe("")
  })

  it("hasChanged() - change input contactInfo data", async () =>  {
    await wrapper.setData({
      currentData: {
        role: "CIVILIAN"
      },
    })
    const hasChanged = await vm.hasChanged()
    expect(hasChanged).toBeTruthy()
  })

  it("saveOnLeave() - save contact data ", async () => {
    const saveOnLeave = await vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy()
  })

  it("saveOnLeave() - should catch and log error", async () => {
    console.log = vi.fn();
    vi.spyOn(AcquisitionPackage, 'saveContactInfo').mockImplementation(() => {
      throw new Error("mock error");
    });
    const saveOnLeave = await vm.saveOnLeave();
    expect(console.log).toHaveBeenCalledWith(Error("mock error"));
  })

  it("contactTypeChange() -  update contact type", async () => {
    await wrapper.setData({
      loaded: true,
      selectedRole: "CIVILIAN"
    })
    const currentData = await vm.currentData
    await vm.contactTypeChange()
    expect(currentData.role).toBe("CIVILIAN")
  })
})

