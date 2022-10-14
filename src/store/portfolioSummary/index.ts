/* eslint-disable camelcase */
import {
  CloudServiceProviderDTO,
  PortfolioSummaryDTO,
  PortfolioSummaryMetadataAndDataDTO,
  PortfolioSummarySearchDTO,
  ReferenceColumn
} from "@/api/models";
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
    query = query + "^portfolio_status!=ARCHIVED"
    query = query + "^ORDERBY" + searchDTO.sort;
    return query;
  }

  /**
   * Returns the count of all portfolios WITHOUT using the offset and limit parameters BUT
   * using all the other search parameters. This count is expected to be used for pagination.
   *
   * TODO: this call can be avoided if server exposes "x-Total-Count" from the backend
   */
  @Action({rawError: true})
  private async getPortfolioSummaryCount(searchQuery: string): Promise<number> {
    await this.ensureInitialized();
    const portfolioSummaryListRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_fields: 'name',
        sysparm_query: searchQuery
      }
    };
    const portfolioList = await api.portfolioTable.getQuery(portfolioSummaryListRequestConfig);
    return portfolioList.length;
  }

  /**
   * Returns a list of all portfolios that match the search query. The results are limited to
   * offset and limit parameters of the pagination.
   */
  @Action({rawError: true})
  private async getPortfolioSummaryList(filterObject: {
    searchQuery: string,
    searchDTO: PortfolioSummarySearchDTO
  }): Promise<PortfolioSummaryDTO[]> {
    const searchQuery = filterObject.searchQuery;
    const searchDTO = filterObject.searchDTO;
    await this.ensureInitialized();
    const portfolioSummaryListRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: searchQuery,
        sysparm_limit: searchDTO.limit,
        sysparm_offset: searchDTO.offset
      }
    };
    return await api.portfolioTable.getQuery(portfolioSummaryListRequestConfig);
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
          { // bring all fields
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

  @Action({rawError: true})
  private async setFundingStatusForPortfolios(portfolioSummaryList: PortfolioSummaryDTO[]) {
    return portfolioSummaryList.forEach(portfolio => {
      portfolio.funding_status = [];
      if (portfolio.alerts.length === 0) {
        portfolio.funding_status.push("ON_TRACK");// on track portfolios do not have any alerts
      } else {
        const spendingAlert =
          portfolio.alerts.find(alert => alert.alert_type === "SPENDING_ACTUAL");
        if (spendingAlert) {
          const threshold = Number(spendingAlert.threshold_violation_amount
            .replace("%", ""));
          // TODO: check if there can be more SPENDING_ACTUAL alerts outside of these 2 for a
          //  portfolio. If there can be more, the if-else block needs to be updated two if blocks
          if (threshold > 75 && threshold <= 99) {
            portfolio.funding_status.push("AT_RISK");
          } else { // threshold >= 100;
            portfolio.funding_status.push("DELINQUENT");
          }
        }
        const timeRemainingAlert =
          portfolio.alerts.find(alert => alert.alert_type === "TIME_REMAINING");
        if (timeRemainingAlert && Number(timeRemainingAlert.threshold_violation_amount
          .replace(" days", ""))) {
          portfolio.funding_status.push("EXPIRING_SOON")
        }
      }
    })
  }

  /**
   * Filters portfolios based on the alerts of a portfolio and funding statuses selected by the user
   */
  @Action({rawError: true})
  private async filterPortfoliosByFundingStatuses(filterObject: {
    portfolioSummaryList: PortfolioSummaryDTO[],
    searchDTO: PortfolioSummarySearchDTO
  }): Promise<PortfolioSummaryDTO[]> {
    const portfolioSummaryList = filterObject.portfolioSummaryList;
    const searchDTO = filterObject.searchDTO;
    return portfolioSummaryList.filter(portfolio => {
      return portfolio.portfolio_status === "ACTIVE" && // processing folios do not have alerts
        (portfolio.funding_status.filter(portfolioFundingStatus =>
          searchDTO.fundingStatuses.indexOf(portfolioFundingStatus) !== -1).length > 0)
    })
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
   * Constructs a single query that get all the clins records across all the task orders. Parses
   * the response and sets the clins to the respective task order.
   */
  @Action({rawError: true})
  private async setClinsToPortfolioTaskOrders(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const clins = portfolioSummaryList.map(portfolio => portfolio.task_orders
      .map(taskOrder => taskOrder.clins));
    const allClinList = await api.clinDisplayTable.getQuery(
      {
        params:
          {
            sysparm_fields: "sys_id,clin_number,idiq_clin,clin_status,funds_obligated," +
              "funds_total,pop_start_date,pop_end_date",
            sysparm_display_value: "all",
            sysparm_query: "sys_idIN" + clins
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      portfolio.task_orders.forEach(taskOrder => {
        taskOrder.clin_records =
          allClinList.filter(clin => (taskOrder.clins.indexOf(<string>clin.sys_id.value) !== -1))
            .map(clinDisplay => {
              return {
                sys_id: clinDisplay.sys_id.value,
                clin_number: clinDisplay.clin_number.value,
                idiq_clin: clinDisplay.idiq_clin.value,
                idiq_clin_display: clinDisplay.idiq_clin,
                pop_end_date: clinDisplay.pop_end_date.value,
                pop_start_date: clinDisplay.pop_start_date.value,
                clin_status: clinDisplay.clin_status.value,
                clin_status_display: clinDisplay.clin_status,
                funds_obligated: Number(clinDisplay.funds_obligated.value),
                funds_total: Number(clinDisplay.funds_total.value)
              }
            });
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
          clinNumbers.push(clinRecord.sys_id);
        })
      })
    });
    console.log(portfolioSummaryList);
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
              const clinNumber = cost.clin as unknown as ReferenceColumn;
              return clinNumber.value === clinRecord.sys_id
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
        let fundsObligatedTaskOrder = 0;
        let fundsSpentForTaskOrder = 0;
        let totalTaskOrderValue = 0;
        let totalLifecycleAmount = 0;
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
            fundsObligatedTaskOrder = fundsObligatedTaskOrder +
              Number(clinRecord.funds_obligated); // TODO:check if this should be outside if block
            totalTaskOrderValue = totalTaskOrderValue + Number(clinRecord.funds_total);
          }
          // totalLifecycleAmount is calculated using all clins of a TO irrespective of status
          totalLifecycleAmount = totalLifecycleAmount + Number(clinRecord.funds_total);
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
        taskOrder.funds_obligated = fundsObligatedTaskOrder + "";
        taskOrder.total_task_order_value = totalTaskOrderValue;
        taskOrder.total_lifecycle_amount = totalLifecycleAmount;
        taskOrder.funds_spent_task_order = fundsSpentForTaskOrder;
      })
      portfolio.funds_obligated = totalObligatedForPortfolio;
      portfolio.funds_spent = fundsSpentForPortfolio;
    })
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
    Promise<PortfolioSummaryMetadataAndDataDTO> {
    try {
      const optionalSearchQuery = await this.getOptionalSearchParameterQuery(searchDTO);
      let searchQuery = await this.getMandatorySearchParameterQuery(searchDTO)
      if (optionalSearchQuery.length > 0) {
        searchQuery = optionalSearchQuery + searchQuery;
      }
      const portfolioSummaryCount = await this.getPortfolioSummaryCount(searchQuery);
      let portfolioSummaryList: PortfolioSummaryDTO[];
      if (portfolioSummaryCount > 0) {
        portfolioSummaryList = await this.getPortfolioSummaryList({searchQuery, searchDTO});
        // callouts to other functions to set data from other tables
        await this.setAlertsForPortfolios(portfolioSummaryList);
        await this.setFundingStatusForPortfolios(portfolioSummaryList);
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
      } else {
        portfolioSummaryList = [];
      }
      return {
        total_count: portfolioSummaryCount,
        portfolioSummaryList: portfolioSummaryList
      };
    } catch (error) {
      throw new Error("error occurred searching portfolio summary list :" + error);
    }
  }
}

const PortfolioSummary = getModule(PortfolioSummaryStore);
export default PortfolioSummary;

