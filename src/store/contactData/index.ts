import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import { MilitaryRankDTO, SystemChoiceDTO } from "@/api/models";
import api from "@/api";
import {TABLENAME as ContactsTable} from "@/api/contacts";
import { TABLENAME as MilitaryRanksTable } from "@/api/militaryRanks";
import { AutoCompleteItem, AutoCompleteItemGroups,  } from "types/Global";

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
  public militaryRanks: MilitaryRankDTO[] = [];
  public militaryAutoCompleteGroups: AutoCompleteItemGroups = {};
  public roleChoices: SystemChoiceDTO[]= [];
  public salutationChoices: SystemChoiceDTO[] = [];




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
     
      await Promise.all([this.getBranchChoices(), 
        this.getCivilianGradeChoices(), 
        this.getContactRoleChoices(),
        this.getContactSalutationChoices()]);
    
      const ranks = await api.militaryRankTable.all();
      this.setRanks(ranks);
      this.setMilitaryAutoCompleteGroups();
      this.setInitialized(true);
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
  public GetMilitaryRank(rankComponentId: string):MilitaryRankDTO | undefined {
    return this.militaryRanks.find(rank=> rank.sys_id === rankComponentId);
  }

}

const ContactData = getModule(ContactDataStore);
export default ContactData;