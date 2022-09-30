import {PortfolioSummaryDTO} from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";

const ATAT_PORTFOLIO_SUMMARY_KEY = "ATAT_PORTFOLIO_SUMMARY_KEY";

const initialPortfolioSummary: PortfolioSummaryDTO = {
  title: '',
  description: '',
  status: '',
  csp: '',
  serviceAgency: '',
  createdBy: '',
  provisioned: '',
  members: [],
  updated: '',
  branch: '',
  lastModified: '',
  currentPoP: '',
  totalObligated: '',
  fundsSpent: '',
  fundsSpentPercent: '',
}

@Module({
  name: "PortfolioSummaryStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class PortfolioSummaryStore extends VuexModule {
  initialized = false;
  portfolioSummaryList: PortfolioSummaryDTO[] | null = null;

  @Action
  public async getAllPortfolioSummaryList(): Promise<PortfolioSummaryDTO[] | null> {
    return this.portfolioSummaryList;
  }

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.portfolioSummaryList)
  ];

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for portfolio summary data store");
    }
  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setPortfolioSummaryList(value: PortfolioSummaryDTO[]): void {
    this.portfolioSummaryList = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_PORTFOLIO_SUMMARY_KEY
    );
  }

  @Action({rawError: true})
  async initialize(): Promise<void> {
    const sessionRestored = retrieveSession(ATAT_PORTFOLIO_SUMMARY_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    }
  }

  @Action({rawError: true})
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  @Action({rawError: true})
  public async loadPortfolioSummaryList(loggedInUserId: string): Promise<PortfolioSummaryDTO[]> {
    await this.ensureInitialized();
    try {
      const query =
        `portfolio_managersLIKEe0c4c728875ed510ec3b777acebb356`; // TODO use loggedInUserId
      const portfolioSummaryListRequestConfig: AxiosRequestConfig = {
        params: {
          // eslint-disable-next-line camelcase
          // sysparm_fields: fields, // ??? does not passing this return all fields?
          // eslint-disable-next-line camelcase
          sysparm_query: query,
        },
      };
      const portfolioSummaryList =
        await api.portfolioTable.getQuery(portfolioSummaryListRequestConfig);
      return portfolioSummaryList ? portfolioSummaryList : [];
    } catch (error) {
      throw new Error(`error occurred loading portfolio summary list :${error}`);
    }
  }
}

const PortfolioSummary = getModule(PortfolioSummaryStore);
export default PortfolioSummary;

