/* eslint-disable camelcase */
import {PortfolioSummaryDTO} from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";

const ATAT_PORTFOLIO_SUMMARY_KEY = "ATAT_PORTFOLIO_SUMMARY_KEY";

/*const initialPortfolioSummary: PortfolioSummaryDTO = {
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
  funds_spent: 0,
  task_orders: []
}*/

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
  private async setCspDisplay(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const cspSysIds = portfolioSummaryList.map(portfolio => portfolio.csp.value);
    console.log(cspSysIds);
    const allCspList = await api.cloudServiceProviderTable.getQuery(
      {
        params:
          {
            sysparm_fields: 'sys_id,name',
            sysparm_query: `sys_idIN` + cspSysIds
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      // @ts-ignore
      portfolio.csp_display =
        allCspList.find(csp => portfolio.csp.value === csp.sys_id)?.name;
    });
  }

  /**
   * Given a list of portfolios, compiles the api calls and returns the portfolio list
   * with task orders populated.
   */
  @Action({rawError: true})
  private async setTaskOrdersForPortfolios(portfolioSummaryList: PortfolioSummaryDTO[]):
    Promise<PortfolioSummaryDTO[]> {
    const taskOrderRequests = portfolioSummaryList
      .map(portfolio => api.taskOrderTable.getQuery(
        {
          params:
            {
              sysparm_fields:
                'sys_id,clins,task_order_number,task_order_status,pop_end_date,pop_start_date',
              sysparm_query: `GOTOportfolio.name>=` + portfolio.sys_id
            }
        }
      ));
    const allTaskOrderList = await Promise.all(taskOrderRequests); // task orders for all portfolios
    portfolioSummaryList.forEach((portfolio, index) => {
      portfolio.task_orders = allTaskOrderList[index]; // works because Promise.all preserves order
    });
    return portfolioSummaryList;
  }

  /**
   * Constructs a single query that get all the clins records across all the task orders. Parses
   * the response and sets the clins to the respective task order.
   */
  @Action({rawError: true})
  private async setClinsToPortfolioTaskOrders(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const clins = portfolioSummaryList.map(portfolio => portfolio.task_orders
      .map(taskOrder => taskOrder.clins));
    const allClinList = await api.clinTable.getQuery(
      {
        params:
          {
            sysparm_fields: 'sys_id,clin_number,clin_status,funds_obligated',
            sysparm_query: `sys_idIN` + clins
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      portfolio.task_orders.forEach(taskOrder => {
        taskOrder.clin_records =
          allClinList.filter(clin => (taskOrder.clins.indexOf(<string>clin.sys_id) !== -1));
      })
    })
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
      const portfolioSummaryList =
        await api.portfolioTable.getQuery(portfolioSummaryListRequestConfig);
      if (portfolioSummaryList && portfolioSummaryList.length > 0) {
        // call out to set the cloud service provider
        await this.setCspDisplay(portfolioSummaryList);
        // todo: call outs to other functions to set data from other tables
        await this.setTaskOrdersForPortfolios(portfolioSummaryList);
        await this.setClinsToPortfolioTaskOrders(portfolioSummaryList);
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

