/* eslint-disable camelcase */
import {
  PortfolioSummaryMetadataAndDataDTO,
  PortfolioSummarySearchDTO,
  PortfolioSummaryObj
} from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "@/store";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import { Statuses } from "../acquisitionPackage";
import CurrentUserStore from "../user";


const ATAT_PORTFOLIO_SUMMARY_KEY = "ATAT_PORTFOLIO_SUMMARY_KEY";

@Module({
  name: "PortfolioSummaryStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class PortfolioSummaryStore extends VuexModule {
  initialized = false;
  portfolioSummaryList: PortfolioSummaryObj[] | null = null;

  @Action
  public async getAllPortfolioSummaryList(
    isHomeView: boolean
  ): Promise<PortfolioSummaryObj[] | null> {
    if(isHomeView){
      const sortedList = this.portfolioSummaryList?.sort((a, b) => {
        const keyA = new Date(a.last_updated)
        const keyB = new Date(b.last_updated);
        // Compare the 2 dates
        return keyA.getTime() - keyB.getTime()
      })
      return sortedList?.slice(0, 5) as PortfolioSummaryObj[]
    }
    return this.portfolioSummaryList?.sort((a,b) =>{ 
      return a.portfolio_name < b.portfolio_name ? -1 : 1 
    }) as PortfolioSummaryObj[];
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
  public setPortfolioSummaryList(value: PortfolioSummaryObj[]): void {
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
  public async getPortfolioSummaryList(
    userSysId: string
  ): Promise<PortfolioSummaryMetadataAndDataDTO> {
  
    await this.ensureInitialized();
  
    return await api.portfolioApi.getPortfolioSummaryList(userSysId)
  }


  public hasActivePortfolios = false;
  @Action({rawError: true})
  public async setHasActivePortfolios(portfolioSummaryList: PortfolioSummaryObj[]) {
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
  public async searchPortfolioSummaryList(): Promise<PortfolioSummaryMetadataAndDataDTO> {
    try {

      const portfolioSummaryCount = CurrentUserStore.getCurrentUserPortfolioCount;
      const currentUserSysId = CurrentUserStore.currentUser.sys_id

      let portfolioSummaryList: PortfolioSummaryMetadataAndDataDTO;
      if (portfolioSummaryCount > 0) {
        portfolioSummaryList = await this.getPortfolioSummaryList(currentUserSysId as string);
        await this.setHasActivePortfolios(portfolioSummaryList.portfolios);
        this.setPortfolioSummaryList(portfolioSummaryList.portfolios); // caches the list
      } else {
        portfolioSummaryList = {} as PortfolioSummaryMetadataAndDataDTO;
      }
      return {
        portfolioCount: portfolioSummaryList.portfolioCount,
        portfolios: portfolioSummaryList.portfolios
      };
    } catch (error) {
      throw new Error("error occurred searching portfolio summary list :" + error);
    }
  }
}

const PortfolioSummary = getModule(PortfolioSummaryStore);
export default PortfolioSummary;

