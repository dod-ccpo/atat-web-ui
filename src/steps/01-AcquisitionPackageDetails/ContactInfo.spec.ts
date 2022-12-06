/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ContactInfo from "@/steps/01-AcquisitionPackageDetails/ContactInfo.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage
  from "@/store/acquisitionPackage";
import { AgencyDTO, ContactDTO, CountryDTO, MilitaryRankDTO, StateDTO, SystemChoiceDTO 
} from "@/api/models";
import api from "@/api"
import ContactData from "@/store/contactData"
Vue.use(Vuetify);

describe("Testing ContactInfo Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

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


  beforeEach(() => {
    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      () => Promise.resolve(mockContactDTO)
    );
      
    jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      () => Promise.resolve()
    );
        
    jest.spyOn(AcquisitionPackage, 'loadContactInfo').mockImplementation(
      () => Promise.resolve(mockLoadedContactDTO)
    );
    jest.spyOn(AcquisitionPackage, 'saveContactInfo').mockImplementation(
      () => Promise.resolve()
    );

    jest.spyOn(ContactData, 'LoadMilitaryBranches').mockImplementation(async () => {
      return [
        { name: "x_g_dis_atat_military_rank", label: "Air Force", value: "AIR_FORCE" },
        { name: "x_g_dis_atat_military_rank", label: "Army", value: "ARMY" },
        { name: "x_g_dis_atat_military_rank", label: "Navy", value: "NAVY" },
      ] as SystemChoiceDTO[]
    })
    jest.spyOn(ContactData, 'GetMilitaryRank').mockReturnValue(
      new Promise(resolve => resolve({
        name: "Admiral",
        grade: "O-10",
        branch: "NAVY"
      } as MilitaryRankDTO))
    );
    jest.spyOn(api.systemChoices, 'getChoices').mockImplementation(async () => {
      return [
        { name: "x_g_dis_atat_military_rank", label: "Air Force", value: "AIR_FORCE" },
        { name: "x_g_dis_atat_military_rank", label: "Army", value: "ARMY" },
        { name: "x_g_dis_atat_military_rank", label: "Navy", value: "NAVY" },
      ] as SystemChoiceDTO[]
    })
    jest.spyOn(api.militaryRankTable, 'all').mockImplementation(async () => {
      return [
        { name: "Brigadier General (BG)", grade: "O-7", branch: "ARMY"},
        { name: "Admiral (ADM)", grade: "O-10", branch: "NAVY"},
        { name: "Captain (Capt)", grade: "O-3", branch: "AIR_FORCE"},
      ] as MilitaryRankDTO[]
    })
    jest.spyOn(api.countriesTable, 'all').mockImplementation(async () => {
      return [
        { name: "Andorra", iso3166_2: "AD" },
        { name: "Bangladesh", iso3166_2: "BD" },
        { name: "Cyprus", iso3166_2: "CY" },
      ] as CountryDTO[]
    })
    jest.spyOn(api.statesTable, 'all').mockImplementation(async () => {
      return [
        { name: "Alabama", key: "AL"},
        { name: "California", key: "CA"},
      ] as StateDTO[]
    })
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


    vuetify = new Vuetify();
    wrapper = mount(ContactInfo, {
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
    await wrapper.vm.loadOnEnter()
    expect(await wrapper.vm.$data.selectedBranch.value).toBe("NAVY")
  })

  it("branchChange() - update selected branch", async () =>  {
    jest.spyOn(ContactData, 'GetMilitaryRank').mockReturnValue(
      new Promise(resolve => resolve({
        name: "Captain",
        grade: "O-3",
        branch: "AIR_FORCE"
      } as MilitaryRankDTO))
    );
    await wrapper.vm.loadOnEnter(); 
    expect(await wrapper.vm.$data.selectedBranch.value).toBe("AIR_FORCE")
  })
  it("hasChanged() - change input contactInfo data", async () =>  {
    await wrapper.setData({
      currentData: {
        role: "CIVILIAN"
      },
    })
    const hasChanged = await wrapper.vm.hasChanged()
    expect(hasChanged).toBeTruthy()
  })
  it("saveOnLeave() - save contact data ", async () => {
    const saveOnLeave = await wrapper.vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy()
  })
  it("contactTypeChange() -  update contact type", async () => {
    await wrapper.setData({
      loaded: true,
      selectedRole: "CIVILIAN"
    })
    const currentData = await wrapper.vm.currentData
    await wrapper.vm.contactTypeChange()
    expect(currentData.role).toBe("CIVILIAN")
  })
})

