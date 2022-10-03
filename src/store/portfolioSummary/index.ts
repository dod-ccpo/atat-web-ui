/* eslint-disable camelcase */
import {PortfolioSummaryDTO} from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";

const ATAT_PORTFOLIO_SUMMARY_KEY = "ATAT_PORTFOLIO_SUMMARY_KEY";

const initialPortfolioSummary: PortfolioSummaryDTO = {
  name: '',
  csp: {
    link: '',
    value: ''
  },
  csp_display: '',
  dod_component: '', // todo: set this to 'ARMY' until the api starts returning this
  task_order_number: '',
  sys_updated_on: '',
  task_order_status: '',
  pop_end_date: '',
  pop_start_date: '',
  funds_obligated: 0,
  portfolio_status: '',
  portfolio_managers: '',
  funds_spent: 0
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

  /**
   * Takes in the portfolio list and makes the necessary API call(s) to set the
   * cloud service provider for each portfolio. At the time of writing this only the
   * 'csp_display' property of each portfolio is set.
   */
  @Action({rawError: true})
  private async setCspDisplay(portfolioSummaryList: PortfolioSummaryDTO[]):
    Promise<PortfolioSummaryDTO[]> {
    const cspRequests = portfolioSummaryList
      .map(portfolio => api.cloudServiceProviderTable.retrieve(portfolio.csp?.value));
    const cspList = await Promise.all(cspRequests);
    portfolioSummaryList = portfolioSummaryList
      .map(portfolio => {
        portfolio.dod_component = 'ARMY' // FIXME: delete this line after API starts returning
        const csp = cspList.find(csp => csp.sys_id === portfolio.csp?.value)
        if (csp?.name != null) {
          portfolio.csp_display = csp?.name;
        }
        return portfolio;
      })
    return portfolioSummaryList;
  }

  @Action({rawError: true})
  public async loadPortfolioSummaryList(loggedInUserId: string): Promise<PortfolioSummaryDTO[]> {
    await this.ensureInitialized();
    try {
      const query =
        `portfolio_managersLIKEe0c4c728875ed510ec3b777acebb356`; // TODO use loggedInUserId
      const portfolioSummaryListRequestConfig: AxiosRequestConfig = {
        params: {
          // sysparm_fields: fields, // ??? does not passing this return all fields?
          sysparm_query: query
        },
      };
      let portfolioSummaryList =
        await api.portfolioTable.getQuery(portfolioSummaryListRequestConfig);
      if (portfolioSummaryList && portfolioSummaryList.length > 0) {
        // call out to set the cloud service provider
        portfolioSummaryList = await this.setCspDisplay(portfolioSummaryList);
        // todo: call outs to other functions to set data from other tables
        this.setPortfolioSummaryList(portfolioSummaryList); // caches the list
        return portfolioSummaryList;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`error occurred loading portfolio summary list :${error}`);
    }
  }
}

const PortfolioSummary = getModule(PortfolioSummaryStore);
export default PortfolioSummary;

