/* eslint-disable camelcase */
import {CloudServiceProviderDTO, PortfolioSummaryDTO, PortfolioSummarySearchDTO,
  ReferenceColumn} from "@/api/models";
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
   * Given a list of portfolios, compiles a single API call and returns the portfolio list
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
        .filter((taskOrder) => {
          const portfolioSysId = (taskOrder.portfolio as ReferenceColumn).value;
          return portfolioSysId === portfolio.sys_id
        });
    })
    return portfolioSummaryList;
  }

  /**
   * Constructs a single API call that gets all the alerts across all the portfolios. Parses
   * the response and sets the 'alerts' to the respective portfolio.
   */
  @Action({rawError: true})
  private async setAlertsForPortfolios(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const allAlertsList = await api.alertsTable.getQuery(
      {
        params:
          { // bring all field
            sysparm_query: "portfolio.nameIN" + portfolioSummaryList
              .map(portfolio => portfolio.name)
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      portfolio.alerts = allAlertsList
        .filter((alert) => {
          return (alert.portfolio as ReferenceColumn).value === portfolio.sys_id
        });
    })
    return portfolioSummaryList;
  }

  /**
   * Filters portfolios based on the alerts of a portfolio and funding statuses selected by the user
   */
  @Action({rawError: true})
  private async filterPortfoliosByFundingStatuses(filterObject: {
    portfolioSummaryList: PortfolioSummaryDTO[],
    searchDTO: PortfolioSummarySearchDTO
  }):
    Promise<PortfolioSummaryDTO[]> {
    const portfolioSummaryList = filterObject.portfolioSummaryList;
    const searchDTO = filterObject.searchDTO;
    return portfolioSummaryList.filter(portfolio => {
      if (searchDTO.fundingStatuses.indexOf("ON_TRACK") !== -1 && portfolio.alerts.length === 0) {
        // on track portfolios do not have any alerts
        return true;
      }
      const spendingAlert =
        portfolio.alerts.find(alert => alert.alert_type === "SPENDING_ACTUAL");
      if (spendingAlert) {
        const threshold = Number(spendingAlert.threshold_violation_amount
          .replace("%", ""));
        if (searchDTO.fundingStatuses.indexOf("AT_RISK") !== -1) {
          return threshold > 90 && threshold <= 100; // TODO: double check number 90 and 100
        }
        if (searchDTO.fundingStatuses.indexOf("DELINQUENT") !== -1) {
          return threshold > 100; // TODO: double check 100
        }
      }
      if (searchDTO.fundingStatuses.indexOf("EXPIRING_SOON") !== -1) {
        const timeRemainingAlert =
          portfolio.alerts.find(alert => alert.alert_type === "TIME_REMAINING");
        if (timeRemainingAlert) {
          const threshold = Number(timeRemainingAlert.threshold_violation_amount
            .replace(" days", ""));
          return threshold <= 30; // TODO: double check the number 30
        }
      }
      return false;
    })
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
            sysparm_fields: "sys_id,clin_number,idiq_clin,clin_status,funds_obligated," +
              "funds_total,pop_start_date,pop_end_date",
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
   * Aggregates the 'Total Obligated' and 'Funds Spent' for all the portfolios in the list.
   * Also rolls up the pop dates using the values of the active task order.
   *
   * NOTE: Instead of computing here if we were to make the aggregate API call, it would take
   * as many calls as the number of portfolios to get, for example, the 'Total Obligated' from
   * the CLINS table. The reason for this is, the aggregate query response does not have any
   * reference to what portfolio the aggregate belongs to and so a call for each portfolio.
   * Computing here will eliminate all these calls.
   */
  @Action({rawError: true})
  private computeAllAggregationsAndPopRollup(portfolioSummaryList: PortfolioSummaryDTO[]) {
    portfolioSummaryList.forEach(portfolio => {
      portfolio.dod_component = 'ARMY' // FIXME: delete this line after API starts returning
      let totalObligatedForPortfolio = 0;
      let fundsSpentForPortfolio = 0;
      portfolio.task_orders.forEach(taskOrder => {
        let fundsSpentForTaskOrder = 0;
        taskOrder.clin_records?.forEach(clinRecord => {
          let fundsSpentForClin = 0;
          if (clinRecord.clin_status === 'ACTIVE' ||
            clinRecord.clin_status === 'OPTION_EXERCISED' ||
            clinRecord.clin_status === 'ON_TRACK' ||
            clinRecord.clin_status === 'AT_RISK' ||
            clinRecord.clin_status === 'EXPIRING_POP' ||
            clinRecord.clin_status === 'DELINQUENT' ||
            clinRecord.clin_status === 'FUNDING_AT_RISK') { // TODO: double check the statuses
            totalObligatedForPortfolio =
              totalObligatedForPortfolio + Number(clinRecord.funds_obligated);
          }
          clinRecord.cost_records?.forEach(costRecord => {
            if (costRecord.is_actual) { // only add up costs with is_actual=true towards total spent
              const costValue = Number(costRecord.value);
              fundsSpentForPortfolio = fundsSpentForPortfolio + costValue;
              fundsSpentForClin = fundsSpentForClin + costValue;
              fundsSpentForTaskOrder = fundsSpentForTaskOrder + costValue;
            }
          });
          clinRecord.funds_spent_clin = fundsSpentForClin;
        })
        if (taskOrder.sys_id === portfolio.active_task_order.value) { // uses dates of active task
          portfolio.pop_start_date = taskOrder.pop_start_date;
          portfolio.pop_end_date = taskOrder.pop_end_date;
        }
        taskOrder.funds_spent_task_order = fundsSpentForTaskOrder;
      })
      portfolio.funds_obligated = totalObligatedForPortfolio;
      portfolio.funds_spent = fundsSpentForPortfolio;
    })
  }

  @Action({rawError: true})
  private async getPortfolioSummaryList(searchQuery: string): Promise<PortfolioSummaryDTO[]> {
    await this.ensureInitialized();
    // const query =
    //   "portfolio_managersLIKEe0c4c728875ed510ec3b777acebb356"; // pragma: allowlist secret
    const portfolioSummaryListRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: searchQuery
      }
    };
    return await api.portfolioTable.getQuery(portfolioSummaryListRequestConfig);
  }

  /**
   * Compiles a search query string for the optional search parameters of 'portfolio' table.
   */
  @Action({rawError: true})
  private async getOptionalSearchParameterQuery(searchDTO: PortfolioSummarySearchDTO):
    Promise<string> {
    let query = "";
    if (searchDTO.portfolioStatus) {
      query = query + "^portfolio_statusIN" + searchDTO.portfolioStatus;
    }
    if (searchDTO.searchString) {
      query = query + "^nameLIKE" + searchDTO.searchString;
    }
    if (searchDTO.csps?.length > 0) {
      query = query + "^csp.nameIN" + searchDTO.csps;
    }
    // TODO: handle 'fundingstatuses' - QUESTION: Is the column for this in portfolio table
    return query;
  }

  /**
   * Compiles a search query string for the mandatory search parameters of 'portfolio' table. For
   * each search parameter, no need to check if the value exists since the value is mandatory.
   */
  @Action({rawError: true})
  private async getMandatorySearchParameterQuery(searchDTO: PortfolioSummarySearchDTO):
    Promise<string> {
    let query = "";
    if (searchDTO.role === "ALL") {
      query = query +
        "^portfolio_managersLIKEe0c4c728875ed510ec3b777acebb356^OR" + // pragma: allowlist secret
        "portfolio_viewersLIKEe0c4c728875ed510ec3b777acebb356"; // pragma: allowlist secret
    } else { // "MANAGED"
      query = query +
        "^portfolio_managersLIKEe0c4c728875ed510ec3b777acebb356"; // pragma: allowlist secret
    }
    query = query + "^ORDERBY" + searchDTO.sort;
    return query;
  }

  /**
   * Makes a callout to get the portfolio search queries and then loads the portfolio list
   * by concatenating the search queries
   *
   * TODO: In a future story performance can be improved by eliminating the calls to all
   *  the referenced tables on each search variable change. Strategy is to load all the
   *  portfolios the user can view OR manage and cache the data. On subsequence searches
   *  just make one call to the portfolio table using the search values and use the
   *  response to filter the results from the cached portfolio list. Since the cached results
   *  already have the referenced data, no further call needs to be made.
   *  Clubbing this story into the existing story will increase the scope and delay the testing
   *  of this story.
   */
  @Action({rawError: true})
  public async searchPortfolioSummaryList(searchDTO: PortfolioSummarySearchDTO):
    Promise<PortfolioSummaryDTO[]> {
    try {
      const optionalSearchQuery = await this.getOptionalSearchParameterQuery(searchDTO);
      let searchQuery = await this.getMandatorySearchParameterQuery(searchDTO)
      if (optionalSearchQuery.length > 0) {
        searchQuery = optionalSearchQuery + searchQuery;
      }
      let portfolioSummaryList = await this.getPortfolioSummaryList(searchQuery);
      if (portfolioSummaryList && portfolioSummaryList.length > 0) {
        // callouts to other functions to set data from other tables
        await this.setAlertsForPortfolios(portfolioSummaryList);
        if (searchDTO.fundingStatuses.length > 0) {
          portfolioSummaryList =
            await this.filterPortfoliosByFundingStatuses({portfolioSummaryList, searchDTO});
        }
        await this.setCspDisplay(portfolioSummaryList);
        await this.setTaskOrdersForPortfolios(portfolioSummaryList);
        await this.setClinsToPortfolioTaskOrders(portfolioSummaryList);
        await this.setCostsToTaskOrderClins(portfolioSummaryList);
        // all asynchronous calls are done before this step & data is available for aggregation
        this.computeAllAggregationsAndPopRollup(portfolioSummaryList);
        this.setPortfolioSummaryList(portfolioSummaryList); // caches the list
        return portfolioSummaryList;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error("error occurred searching portfolio summary list :" + error);
    }
  }
}

const PortfolioSummary = getModule(PortfolioSummaryStore);
export default PortfolioSummary;

