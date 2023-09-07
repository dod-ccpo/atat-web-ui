/* eslint-disable camelcase */
import {
  AgencyDTO,
  CloudServiceProviderDTO,
  PortfolioSummaryDTO,
  PortfolioSummaryMetadataAndDataDTO,
  PortfolioSummarySearchDTO
} from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";
import { Statuses } from "../acquisitionPackage";
import CurrentUserStore from "../user";
import {convertColumnReferencesToValues} from "@/api/helpers";
import { Environment } from "types/Global";
import { currencyStringToNumber } from "@/helpers";

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
  public async initialize(): Promise<void> {
    if(!this.initialized) {
      const sessionRestored = retrieveSession(ATAT_PORTFOLIO_SUMMARY_KEY);
      if (sessionRestored) {
        this.setStoreData(sessionRestored);
      } else {
        this.setInitialized(true);
        storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_SUMMARY_KEY);
      }
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
    if (searchDTO.fundingStatuses && searchDTO.fundingStatuses.length > 0) {
      query = query + "^portfolio_funding_statusIN" + searchDTO.fundingStatuses;
    }
    if (searchDTO.searchString) {
      query = query + "^nameLIKE" + searchDTO.searchString;
    }
    // ATAT TODO * below block is commented out because "csp" column is moved to "environment" 
    // table and cannot be part of the search for portfolio with offsets and limits for pagination.
    /*if (searchDTO.csps?.length > 0) {
      query = query + "^csp.nameIN" + searchDTO.csps;
    }*/
    return query;
  }

  /**
   * Compiles a search query string for the mandatory search parameters of 'portfolio' table. For
   * each search parameter, no need to check if the value exists since the value is mandatory.
   */
  @Action({rawError: true})
  public async getMandatorySearchParameterQuery(
    data: { searchDTO?: PortfolioSummarySearchDTO, isHomeView?: boolean }
  ): Promise<string> {
    const searchDTO = data.searchDTO;
    const isHomeView = data.isHomeView ?? false;
    const currentUser = CurrentUserStore.getCurrentUserData;
    const isHaCCAdmin = CurrentUserStore.currentUserIsHaCCAdmin;
    const userSysId = currentUser.sys_id;
    let query = "";
    if (!isHaCCAdmin) {
      if (searchDTO && searchDTO.role === "ALL") {
        query = query +
        // eslint-disable-next-line max-len
          `^portfolio_owner=${userSysId}^ORportfolio_managersLIKE${userSysId}^ORportfolio_viewersLIKE${userSysId}`;
      } else { // "MANAGED"
        query = query +
          `^portfolio_owner=${userSysId}^ORportfolio_managersLIKE${userSysId}`;
      }
    }

    if (isHomeView) query = query + "^portfolio_status!=ARCHIVED"
    
    if (searchDTO && searchDTO.sort) query += "^ORDERBY" + searchDTO.sort;
    return query;
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
    let allAlertsList = await api.alertsTable.getQuery(
      {
        params:
          { // bring all fields
            sysparm_query: "portfolio.sys_idIN" + portfolioSummaryList
              .map(portfolio => portfolio.sys_id)
          }
      }
    )
    allAlertsList = allAlertsList
      .map(alertObj => convertColumnReferencesToValues(alertObj));
    portfolioSummaryList.forEach(portfolio => {
      portfolio.alerts = allAlertsList
        .filter((alert) => {
          return alert.portfolio === portfolio.sys_id});
    })
    return portfolioSummaryList;
  }

  /**
   * Constructs a single API call that gets all the environments across all the portfolios. Parses
   * the response and sets the 'environments' to the respective portfolio.
   */
  @Action({rawError: true})
  private async setEnvironmentsForPortfolios(portfolioSummaryList: PortfolioSummaryDTO[]) {
    // get all environments for all user portfolios
    const allEnvironmentsList = await api.environmentTable.getQuery(
      {
        params:
          { // bring all fields
            sysparm_query: "portfolio.sys_idIN" + portfolioSummaryList
              .map(portfolio => portfolio.sys_id)
          }
      }
    )
    const allEnvs: Environment[] = allEnvironmentsList.map(
      environment => convertColumnReferencesToValues(environment)
    );
    
    allEnvs.forEach(env => {
      // ATAT TODO AT-9721
      // remove this forEach entirely
      // change environmentStatus to environment_status throughout codebase
      if (env.provisioned === "true") {
        env.environmentStatus = Statuses.Provisioned.value;
      } else {
        env.environmentStatus = env.provisioning_failure_cause  
          ? Statuses.ProvisioningIssue.value 
          : Statuses.Processing.value;
      }
    });
    
    portfolioSummaryList.forEach(portfolio => {
      portfolio.environments = allEnvs.filter(env => env.portfolio === portfolio.sys_id);
    });
    
    return portfolioSummaryList;
  }

  /**
   * Constructs a single query that gets all the CSP records across all the portfolio environments.
   * Parses the response and sets the 'csp_display' to the respective environment.
   */
  @Action({rawError: true})
  private async setCspDisplay(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const cspSysIds = portfolioSummaryList.map(portfolio =>
      portfolio.environments?.map(environment => environment.csp));
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
      portfolio.environments?.forEach(environment => {
        environment.csp_display =
          (allCspList.find(
            (csp: CloudServiceProviderDTO) => environment.csp === csp.sys_id)?.name) || "";
      })
    });
  }

  /**
   * Constructs a single query that gets all the Agency records across all the portfolios.
   * Parses the response and sets the 'agency_display' to the respective portfolio.
   */
  @Action({rawError: true})
  private async setAgencyDisplay(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const agencySysIds = portfolioSummaryList.map(portfolio => portfolio.agency);
    const allAgencyList = await api.agencyTable.getQuery(
      {
        params:
          {
            sysparm_fields: "sys_id,acronym",
            sysparm_query: "sys_idIN" + agencySysIds
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      portfolio.agency_display =
        (allAgencyList.find(
          (agency: AgencyDTO) => portfolio.agency === agency.sys_id)?.acronym) || "";
    });
  }

  /**
   * Given a list of portfolios, compiles a single API call and returns the portfolio list
   * with task orders populated.
   */
  @Action({rawError: true})
  private async setTaskOrdersForPortfolios(portfolioSummaryList: PortfolioSummaryDTO[]):
    Promise<PortfolioSummaryDTO[]> {
    let allTaskOrderList = await api.taskOrderTable.getQuery(
      {
        params:
          {
            sysparm_fields:
              "sys_id,clins,portfolio,task_order_number,task_order_status," +
              "pop_end_date,pop_start_date",
            sysparm_query: "portfolio.sys_idIN" + portfolioSummaryList
              .map(portfolio => portfolio.sys_id)
          }
      }
    )
    allTaskOrderList = allTaskOrderList
      .map(taskOrder => convertColumnReferencesToValues(taskOrder));
    portfolioSummaryList.forEach(portfolio => {
      portfolio.task_orders = allTaskOrderList
        .filter((taskOrder) => {
          return taskOrder.portfolio === portfolio.sys_id
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
    const allClinList = await api.clinTable.getQuery(
      {
        params:
          {
            sysparm_fields: "sys_id,clin_number,idiq_clin,clin_status,funds_obligated," +
              "funds_total,actual_funds_spent,pop_start_date,pop_end_date",
            sysparm_display_value: true,
            sysparm_query: "sys_idIN" + clins
          }
      }
    )
    portfolioSummaryList.forEach(portfolio => {
      portfolio.task_orders.forEach(taskOrder => {
        taskOrder.clin_records =
          allClinList.filter(clin => (taskOrder.clins.indexOf(<string>clin.sys_id) !== -1))
            .map(clin => {
              const fundsTotal = currencyStringToNumber(clin.funds_total as unknown as string)
              const fundsObligated = currencyStringToNumber(
                clin.funds_obligated as unknown as string
              );
              const actualFundsSpent = currencyStringToNumber(
                clin.actual_funds_spent as unknown as string
              );
              const status = clin.clin_status.toUpperCase().replace(/[\W_]+/g,"_");
              return {
                sys_id: clin.sys_id,
                clin_number: clin.clin_number,
                idiq_clin: clin.idiq_clin,
                pop_end_date: clin.pop_end_date,
                pop_start_date: clin.pop_start_date,
                clin_status: status,
                clin_status_display: clin.clin_status,
                funds_obligated: Number(fundsObligated),
                funds_total: Number(fundsTotal),
                actual_funds_spent: Number(actualFundsSpent)
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
    let allCostList = await api.costsTable.getQuery(
      {
        params:
          {
            sysparm_fields: "sys_id,clin,task_order_number,is_actual,value",
            sysparm_query: "clinIN" + clinNumbers,
            limit: -1,
          }
      }
    )
    allCostList = allCostList.map(cost => convertColumnReferencesToValues(cost));
    portfolioSummaryList.forEach(portfolio => {
      portfolio.task_orders.forEach(taskOrder => {
        taskOrder.clin_records?.forEach(clinRecord => {
          clinRecord.cost_records =
            allCostList.filter(cost => {
              return cost.clin === clinRecord.sys_id
            });
        })
      })
    })
  }

  public hasActivePortfolios = false;
  @Action({rawError: true})
  public async setHasActivePortfolios(portfolioSummaryList: PortfolioSummaryDTO[]) {
    const hasActivePortfolios = portfolioSummaryList.some((portfolio) => {
      return portfolio.portfolio_status === Statuses.Active.label ||
      portfolio.portfolio_status === Statuses.Active.value
    })
    await this.doSetHasActivePortfolios(hasActivePortfolios)
  }

  @Mutation
  public async doSetHasActivePortfolios(hasActivePortfolios: boolean){
    this.hasActivePortfolios = hasActivePortfolios;
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
      let totalObligatedForPortfolio = 0;
      let fundsSpentForPortfolio = 0;
      portfolio.task_orders.forEach(taskOrder => {
        let fundsObligatedTaskOrder = 0;
        let fundsSpentForTaskOrder = 0;
        let totalTaskOrderValue = 0;
        let totalLifecycleAmount = 0;
        taskOrder.clin_records?.forEach(clinRecord => {
          let fundsSpentForClin = 0;
          const validStatusesForTotalObligated = [
            Statuses.Active.value, Statuses.OptionExercised.value, Statuses.OnTrack.value,
            Statuses.AtRisk.value, Statuses.ExpiringPop.value, Statuses.Delinquent.value, 
            Statuses.FundingAtRisk.value, Statuses.Expired.value
          ]
          if (validStatusesForTotalObligated.includes(clinRecord.clin_status)) {
            totalObligatedForPortfolio =
              totalObligatedForPortfolio + Number(clinRecord.funds_obligated);
            // ATAT TODO AT-9722 - check if this should be outside if block
            fundsObligatedTaskOrder = fundsObligatedTaskOrder +
              Number(clinRecord.funds_obligated); 
            totalTaskOrderValue = totalTaskOrderValue + Number(clinRecord.funds_total);
          }
          // totalLifecycleAmount is calculated using all clins of a TO irrespective of status
          totalLifecycleAmount = totalLifecycleAmount + Number(clinRecord.funds_total);
          clinRecord.cost_records?.forEach(costRecord => {
            if (costRecord.is_actual) { // only add up costs with is_actual=true towards total spent
              const costValue = Number(costRecord.value);
              fundsSpentForPortfolio = fundsSpentForPortfolio + costValue;
              fundsSpentForTaskOrder = fundsSpentForTaskOrder + costValue;
            }
          });
        })
        if (taskOrder.sys_id === portfolio.active_task_order) { // uses dates of active task
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
   * ATAT TODO * Q1 FY24 - address when adding filtering back into portfolio list
   *  In a future story performance can be improved by eliminating the calls to all
   *  the referenced tables on each search variable change. Strategy is to load all the
   *  portfolios the user can view OR manage and cache the data. On subsequence searches
   *  just make one call to the portfolio table using the search values and use the
   *  response to filter the results from the cached portfolio list. Since the cached results
   *  already have the referenced data, no further call needs to be made.
   */
  @Action({rawError: true})
  public async searchPortfolioSummaryList(
    data: { 
      searchDTO: PortfolioSummarySearchDTO, 
      isHomeView?: boolean,
      singlePortfolioSearch?: string 
    }
  ): Promise<PortfolioSummaryMetadataAndDataDTO> {
    try {
      const searchDTO = data.searchDTO;
      const isHomeView = data.isHomeView ?? false;
      let optionalSearchQuery = "";
      
      if (!data.singlePortfolioSearch) {
        optionalSearchQuery = await this.getOptionalSearchParameterQuery(searchDTO);
      } else {
        optionalSearchQuery = "sys_id=" + data.singlePortfolioSearch;
      }

      let searchQuery = await this.getMandatorySearchParameterQuery({searchDTO, isHomeView});
      if (optionalSearchQuery.length > 0) {
        searchQuery = optionalSearchQuery + searchQuery;
      }

      const portfolioSummaryCount = CurrentUserStore.getCurrentUserPortfolioCount;

      let portfolioSummaryList: PortfolioSummaryDTO[];
      if (portfolioSummaryCount > 0) {
        portfolioSummaryList = await this.getPortfolioSummaryList({searchQuery, searchDTO});
        portfolioSummaryList = portfolioSummaryList
          .map(portfolioSummary => convertColumnReferencesToValues(portfolioSummary));
        // callouts to other functions to set data from other tables
        await this.setAlertsForPortfolios(portfolioSummaryList);
        await this.setEnvironmentsForPortfolios(portfolioSummaryList);
        await this.setCspDisplay(portfolioSummaryList);
        await this.setAgencyDisplay(portfolioSummaryList);
        await this.setTaskOrdersForPortfolios(portfolioSummaryList);
        await this.setClinsToPortfolioTaskOrders(portfolioSummaryList);
        await this.setCostsToTaskOrderClins(portfolioSummaryList);
        await this.setHasActivePortfolios(portfolioSummaryList);
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

