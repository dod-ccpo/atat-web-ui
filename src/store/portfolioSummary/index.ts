/* eslint-disable camelcase */
import {CloudServiceProviderDTO, PortfolioSummaryDTO, ReferenceColumn} from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";

const ATAT_PORTFOLIO_SUMMARY_KEY = "ATAT_PORTFOLIO_SUMMARY_KEY";

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
   * Constructs a single query that gets all the CSP records across all the portfolis. Parses
   * the response and sets the 'csp_display' to the respective portfolio.
   */
  @Action({rawError: true})
  private async setCspDisplay(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const cspSysIds = portfolioSummaryList.map(portfolio => portfolio.csp.value);
    const allCspList = await api.cloudServiceProviderTable.getQuery(
      {
        params:
          {
            sysparm_fields: "sys_id,name",
            sysparm_query: "sys_idIN" + cspSysIds
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      portfolio.csp_display = 
        (allCspList.find(
          (csp: CloudServiceProviderDTO) => portfolio.csp.value === csp.sys_id)?.name) || "";
    });
  }

  /**
   * Given a list of portfolios, compiles the api calls and returns the portfolio list
   * with task orders populated.
   */
  @Action({rawError: true})
  private async setTaskOrdersForPortfolios(portfolioSummaryList: PortfolioSummaryDTO[]):
    Promise<PortfolioSummaryDTO[]> {
    const allTaskOrderList = await api.taskOrderTable.getQuery(
      {
        params:
          {
            sysparm_fields:
              "sys_id,clins,portfolio,task_order_number,task_order_status," +
              "pop_end_date,pop_start_date",
            sysparm_query: "portfolio.nameIN" + portfolioSummaryList
              .map(portfolio => portfolio.name)
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      portfolio.task_orders = allTaskOrderList
        .filter((taskOrder) => 
        {
          const portfolioSysId  = (taskOrder.portfolio as ReferenceColumn).value;
          return portfolioSysId === portfolio.sys_id});
          
      if (!portfolio.task_orders) {
        portfolio.task_orders = [];
      }
    })
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
            sysparm_fields: "sys_id,clin_number,clin_status,funds_obligated",
            sysparm_query: "sys_idIN" + clins
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

  /**
   * Constructs a single query that gets all the cost records across all the clins. Parses
   * the response and sets the costs to the respective clin.
   */
  @Action({rawError: true})
  private async setCostsToTaskOrderClins(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const clinNumbers: string[] = [];
    portfolioSummaryList.forEach(portfolio => {
      portfolio.task_orders.forEach(taskOrder => {
        taskOrder.clin_records?.forEach(clinRecord => {
          clinNumbers.push(clinRecord.clin_number);
        })
      })
    });
    const allCostList = await api.costsTable.getQuery(
      {
        params:
          {
            sysparm_fields: "sys_id,clin,task_order_number,is_actual,value",
            sysparm_query: "clinIN" + clinNumbers
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      portfolio.task_orders.forEach(taskOrder => {
        taskOrder.clin_records?.forEach(clinRecord => {
          clinRecord.cost_records =
            allCostList.filter(cost => {
              const clinNumber = cost.clin as unknown as string;
              return clinNumber === clinRecord.clin_number &&
              cost.task_order_number === taskOrder.task_order_number
            }); // FIXME temp code above
          // allCostList.filter(cost => cost.clin?.value === clinRecord.sys_id);//FIXME correct code
        })
      })
    })
  }

  /**
   * Performs the 'Total Obligated' and 'Funds Spent' for all the portfolios in the list
   *
   * NOTE: Instead of computing here if we were to make the aggregate API call, it would take
   * as many calls as the number of portfolios to get, for example, the 'Total Obligated' from
   * the CLINS table. The reason for this is, the aggregate query response does not have any
   * reference to what portfolio the aggregate belongs to and so a call for each portfolio.
   * Computing here will eliminate all these calls.
   */
  @Action({rawError: true})
  private computeAllAggregations(portfolioSummaryList: PortfolioSummaryDTO[]) {
    portfolioSummaryList.forEach(portfolio => {
      portfolio.dod_component = 'ARMY' // FIXME: delete this line after API starts returning
      let totalObligatedForPortfolio = 0;
      let totalFundsSpentForPortfolio = 0;
      portfolio.task_orders.forEach(taskOrder => {
        taskOrder.clin_records?.forEach(clinRecord => {
          if (clinRecord.clin_status === 'ACTIVE' ||
            clinRecord.clin_status === 'OPTION_EXERCISED') { // TODO: double check the statuses
            totalObligatedForPortfolio =
              totalObligatedForPortfolio + Number(clinRecord.funds_obligated);
          }
          clinRecord.cost_records?.forEach(costRecord => {
            totalFundsSpentForPortfolio = totalFundsSpentForPortfolio + Number(costRecord.value);
          })
        })
      })
      portfolio.funds_obligated = totalObligatedForPortfolio;
      portfolio.funds_spent = totalFundsSpentForPortfolio;
    })
  }

  @Action({rawError: true})
  public async loadPortfolioSummaryList(): Promise<PortfolioSummaryDTO[]> {
    await this.ensureInitialized();
    try {
      const query =
        "portfolio_managersLIKEe0c4c728875ed510ec3b777acebb356"; // pragma: allowlist secret
      const portfolioSummaryListRequestConfig: AxiosRequestConfig = {
        params: {
          sysparm_query: query
        }
      };
      const portfolioSummaryList =
        await api.portfolioTable.getQuery(portfolioSummaryListRequestConfig);
      if (portfolioSummaryList && portfolioSummaryList.length > 0) {
        // callouts to other functions to set data from other tables
        await this.setCspDisplay(portfolioSummaryList);
        await this.setTaskOrdersForPortfolios(portfolioSummaryList);
        await this.setClinsToPortfolioTaskOrders(portfolioSummaryList);
        await this.setCostsToTaskOrderClins(portfolioSummaryList);
        // all asynchronous calls are done before this step & data is available for aggregation
        this.computeAllAggregations(portfolioSummaryList);
        this.setPortfolioSummaryList(portfolioSummaryList); // caches the list
        return portfolioSummaryList;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error("error occurred loading portfolio summary list :" + error);
    }
  }
}

const PortfolioSummary = getModule(PortfolioSummaryStore);
export default PortfolioSummary;

