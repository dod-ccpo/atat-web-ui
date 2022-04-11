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

  public countries: CountryObj[] = [
    {
      name: "United States",
      countryCode: "+1",
      abbreviation: "us",
      active: false,
      suggested: true
    },
    {
      name: "Defense Switched Network",
      countryCode: "DSN",
      abbreviation: "dsn",
      active: false,
      suggested: true
    },
    {
      name: "Albania",
      countryCode: "+355",
      abbreviation: "al",
      active: false,
    },
    {
      name: "Belgium",
      countryCode: "+32",
      abbreviation: "be",
      active: false,
    },
    {
      name: "Bulgaria",
      countryCode: "+359",
      abbreviation: "bg",
      active: false,
    },
    {
      name: "Canada",
      countryCode: "+1",
      abbreviation: "ca",
      active: false,
    },
    {
      name: "Croatia",
      countryCode: "+385",
      abbreviation: "hr",
      active: false,
    },
    {
      name: "Czech Republic",
      countryCode: "+420",
      abbreviation: "cz",
      active: false,
    },
    {
      name: "Denmark",
      countryCode: "+45",
      abbreviation: "dk",
      active: false,
    },
    {
      name: "Estonia",
      countryCode: "+372",
      abbreviation: "ee",
      active: false,
    },
    {
      name: "France",
      countryCode: "+33",
      abbreviation: "fr",
      active: false,
    },
    {
      name: "Germany",
      countryCode: "+49",
      abbreviation: "de",
      active: false,
    },
    {
      name: "Greece",
      countryCode: "+30",
      abbreviation: "gr",
      active: false,
    },
    {
      name: "Greenland",
      countryCode: "+299",
      abbreviation: "gl",
      active: false,
    },
    {
      name: "Hungary",
      countryCode: "+36",
      abbreviation: "hu",
      active: false,
    },
    {
      name: "Iceland",
      countryCode: "+354",
      abbreviation: "is",
      active: false,
    },
    {
      name: "Italy",
      countryCode: "+39",
      abbreviation: "it",
      active: false,
    },
    {
      name: "Latvia",
      countryCode: "+371",
      abbreviation: "lv",
      active: false,
    },
    {
      name: "Lithuania",
      countryCode: "+370",
      abbreviation: "lt",
      active: false,
    },
    {
      name: "Luxembourg",
      countryCode: "+352",
      abbreviation: "lu",
      active: false,
    },
    {
      name: "Montenegro",
      countryCode: "+382",
      abbreviation: "me",
      active: false,
    },
    {
      name: "Netherlands",
      countryCode: "+31",
      abbreviation: "nl",
      active: false,
    },
    {
      name: "Norway",
      countryCode: "+47",
      abbreviation: "no",
      active: false,
    },
    {
      name: "Poland",
      countryCode: "+48",
      abbreviation: "pl",
      active: false,
    },
    {
      name: "Portugal",
      countryCode: "+351",
      abbreviation: "pt",
      active: false,
    },
    {
      name: "Romania",
      countryCode: "+40",
      abbreviation: "ro",
      active: false,
    },
    {
      name: "Slovakia",
      countryCode: "+421",
      abbreviation: "sk",
      active: false,
    },
    {
      name: "Slovenia",
      countryCode: "+386",
      abbreviation: "si",
      active: false,
    },
    {
      name: "Spain",
      countryCode: "+34",
      abbreviation: "es",
      active: false,
    },
    {
      name: "Turkey",
      countryCode: "+90",
      abbreviation: "tr",
      active: false,
    },
    {
      name: "United Kingdom",
      countryCode: "+44",
      abbreviation: "gb",
      active: false,
    },
  ];

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