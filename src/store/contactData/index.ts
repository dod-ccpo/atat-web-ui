import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import { CountryDTO, MilitaryRankDTO, StateDTO, SystemChoiceDTO } from "@/api/models";
import api from "@/api";
import {TABLENAME as ContactsTable} from "@/api/contacts";
import { TABLENAME as MilitaryRanksTable } from "@/api/militaryRanks";
import { AutoCompleteItem, AutoCompleteItemGroups, SelectData,  } from "types/Global";
import  {nameofProperty, storeDataToSession, retrieveSession} from "../helpers"
import Vue from "vue";

const ATAT_CONTACT_DATA_KEY = 'ATAT_CONTACT_DATA_KEY';

const sortRanks = (a:MilitaryRankDTO, b:MilitaryRankDTO) => {
  if (a.grade.startsWith("O") && b.grade.startsWith("O")) {
    const aNumber = Number(a.grade.replace("O", ""));
    const bNumber = Number(b.grade.replace("O", ""));
    return aNumber - bNumber;
  } else if (a.grade.startsWith("O") && !b.grade.startsWith("O")) {
    return 1;
  } else if (!a.grade.startsWith("O") && b.grade.startsWith("O")) {
    return -1;
  } else {
    return a.grade > b.grade ? 1 : -1;
  }};



@Module({
  name: "ContactData",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class ContactDataStore extends VuexModule {
  private initialized = false;
  public branchChoices: SystemChoiceDTO[] = [];
  public civilianGradeChoices :SystemChoiceDTO[] = [];
  public countries:CountryDTO[] = [];
  public militaryRanks: MilitaryRankDTO[] = [];
  public militaryAutoCompleteGroups: AutoCompleteItemGroups = {};
  public roleChoices: SystemChoiceDTO[]= [];
  public salutationChoices: SystemChoiceDTO[] = [];
  public states:StateDTO[] = [];

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this,x=> x.branchChoices),
    nameofProperty(this, x=>x.countries),
    nameofProperty(this, x=> x.civilianGradeChoices),
    nameofProperty(this, x=>x.militaryRanks),
    nameofProperty(this, x=>x.roleChoices),
    nameofProperty(this, x=>x.salutationChoices),
    nameofProperty(this, x=>x.states)
  ];

  public get stateChoices(): SelectData[] {

    return this.states.filter(state=>state.key !== 'us').map(state=> {
      return  {

        text: state.name,
        value: state.key.replace('us-', '').toUpperCase()
      }
    });
  }

  public get countryChoices(): SelectData[] {

    return this.countries.map(country=> {
      return  {

        text: country.name,
        value: country.sys_id,
      }
    })
  }

  @Mutation
  public setStoreData(sessionData: string):void{
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });

    } catch (error) {
      throw new Error('error restoring session for contact data store');
    }
    

  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setRanks(value: MilitaryRankDTO[]): void {
    this.militaryRanks = value;
  }

  @Mutation
  public setBranches(value: SystemChoiceDTO[]): void {
    this.branchChoices = value;
  }

  @Mutation
  public setRoles(value: SystemChoiceDTO[]): void {
    this.roleChoices = value;
  }

  @Mutation
  public setCivilianGrades(value: SystemChoiceDTO[]): void {
    this.civilianGradeChoices = value;
  }


  @Mutation
  public setMilitaryAutoCompleteGroups(): void {
    const autoCompleteItemGroups: { [key: string]: AutoCompleteItem[] } = {};
    this.branchChoices.forEach((branch) => {
      const branchRanks = this.militaryRanks
        .filter((rank) => rank.branch == branch.value)
        .sort(sortRanks)
        .map((rank) => {
          return {
            name: rank.name,
            grade: rank.grade,
            sysId: rank.sys_id ||  "",
          };
        });

      autoCompleteItemGroups[branch.value] = branchRanks;
    });
    this.militaryAutoCompleteGroups = autoCompleteItemGroups;
  }
  
  @Mutation
  public setContactSalutations(value: SystemChoiceDTO[]): void{
    this.salutationChoices = value;
  } 


  @Mutation
  public setStates(value: StateDTO[]):void {
    this.states = value;
  }

  @Mutation
  public setCountries(value: CountryDTO[]):void {
    this.countries = value;
  }


  @Action({ rawError: true })
  public async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  @Action({rawError: true})
  private async getBranchChoices():Promise<void>
  {
    const branches = await api.systemChoices.getChoices(
      MilitaryRanksTable,
      "branch"
    );
    this.setBranches(branches);
  }

  @Action({rawError: true})
  private async getCivilianGradeChoices():Promise<void>
  {
    const grades = await api.systemChoices.getChoices(
      ContactsTable,
      "grade_civ"
    );
    this.setCivilianGrades(grades);
  }


  @Action({rawError: true})
  private async getContactRoleChoices():Promise<void>
  {
    const contactRoles = await api.systemChoices.getChoices(
      ContactsTable,
      "role"
    );
    
    this.setRoles(contactRoles);
  }
  

  
  @Action({rawError: true})
  private async getContactSalutationChoices():Promise<void>
  {
    const salutations = await api.systemChoices.getChoices(
      ContactsTable,
      "salutation"
    );
    this.setContactSalutations(salutations);
  }

  
  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    try {

      const sessionRestored= retrieveSession(ATAT_CONTACT_DATA_KEY);

      if(sessionRestored){
        this.setStoreData(sessionRestored);
        this.setMilitaryAutoCompleteGroups();
      }
      else{

        await Promise.all([this.getBranchChoices(), 
          this.getCountries(),
          this.getCivilianGradeChoices(), 
          this.getContactRoleChoices(),
          this.getContactSalutationChoices(),
          this.getStates()]);
    
        const ranks = await api.militaryRankTable.all();
        this.setRanks(ranks);
        this.setMilitaryAutoCompleteGroups();
        this.setInitialized(true);
        storeDataToSession(this, this.sessionProperties, ATAT_CONTACT_DATA_KEY);
      }

    } catch (error) {
      console.log(error);
      console.log("error loading military rank data");
    }
  }

  @Action({ rawError: true })
  public async LoadMilitaryBranches(): Promise<SystemChoiceDTO[]> {
    await this.ensureInitialized();
    return this.branchChoices;
  }

  @Action({rawError: true})
  public async GetMilitaryRank(rankComponentId: string): Promise<MilitaryRankDTO | undefined> {
    return this.militaryRanks.find(rank=> rank.sys_id === rankComponentId);
  }

  @Action({rawError: true})
  public async getStates():Promise<void>{

    const states = await api.statesTable.all();
    this.setStates(states);

  }

  @Action({rawError: true})
  public async getCountries():Promise<void>{

    const countries = await api.countriesTable.all();
    this.setCountries(countries);

  }


  public get countryListData(){

    return (removeCountries: string[] | null): SelectData[]=> {
      if (!removeCountries) {
        return this.countryChoices;
      }
      let filteredCountries =this.countryChoices;
      removeCountries.filter(function (countryCode) {
        filteredCountries = filteredCountries.filter(function (countryObj) {
          return countryObj.value !== countryCode;
        });
      });
      return filteredCountries;
    }
  }

  @Action({rawError: true})
  public async reset(): Promise<void> {
    sessionStorage.removeItem(ATAT_CONTACT_DATA_KEY);
    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
    this.branchChoices = [];
    this.civilianGradeChoices  = [];
    this.countries = [];
    this.militaryRanks = [];
    this.militaryAutoCompleteGroups = {};
    this.roleChoices = [];
    this.salutationChoices = [];
    this.states = [];
  }
}

const ContactData = getModule(ContactDataStore);
export default ContactData;
