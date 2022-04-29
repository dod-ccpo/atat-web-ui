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
import { TABLENAME as MilitaryRanksTable } from "@/api/militaryRanks";
import { AutoCompleteItem, AutoCompleteItemGroups, CountryObj } from "types/Global";

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
  public militaryRanks: MilitaryRankDTO[] = [];
  public branchChoices: SystemChoiceDTO[] = [];
  public militaryAutoCompleteGroups: AutoCompleteItemGroups = {};


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

  @Action({ rawError: true })
  public async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    try {
      const branches = await api.systemChoices.getChoices(
        MilitaryRanksTable,
        "branch"
      );
      this.setBranches(branches);
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