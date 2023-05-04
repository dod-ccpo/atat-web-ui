/* eslint-disable camelcase */
import {
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummaryMetadataAndDataDTO,
  AcquisitionPackageSummarySearchDTO, DisplayColumn
} from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue"
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";
import CurrentUserStore from "@/store/user";

const ATAT_ACQUISITION_PACKAGE_SUMMARY_KEY = "ATAT_ACQUISITION_PACKAGE_SUMMARY_KEY";
export type PackageSort = "DESCsys_updated_on" | "project_overview"
@Module({
  name: "AcquisitionPackageSummaryStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class AcquisitionPackageSummaryStore extends VuexModule {
  initialized = false;
  acquisitionPackageSummaryList: AcquisitionPackageSummaryDTO[] | null = null;
  selectedSort: PackageSort = "project_overview";

  @Action 
  setSelectedSort(value: PackageSort): void {
    this.doSetSelectedSort(value);
  }
  @Mutation
  public doSetSelectedSort(value: PackageSort): void {
    this.selectedSort = value;
  }


  @Action
  public async getAllAcquisitionPackageSummaryList():
    Promise<AcquisitionPackageSummaryDTO[] | null> {
    return this.acquisitionPackageSummaryList;
  }

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.acquisitionPackageSummaryList)
  ];

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for acquisition package summary data store");
    }
  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setAcquisitionPackageSummaryList(value: AcquisitionPackageSummaryDTO[]): void {
    this.acquisitionPackageSummaryList = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_ACQUISITION_PACKAGE_SUMMARY_KEY
    );
  }

  @Action({rawError: true})
  async initialize(): Promise<void> {
    if(!this.initialized) {
      const sessionRestored = retrieveSession(ATAT_ACQUISITION_PACKAGE_SUMMARY_KEY);
      if (sessionRestored) {
        this.setStoreData(sessionRestored);
      } else {
        this.setInitialized(true);
        storeDataToSession(this, this.sessionProperties, ATAT_ACQUISITION_PACKAGE_SUMMARY_KEY);
      }
    }
  }

  @Action({rawError: true})
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  /**
   * Compiles a search query string for the optional search parameters
   * of 'acquisition package' table.
   */
  @Action({rawError: true})
  private async getOptionalSearchParameterQuery(searchDTO: AcquisitionPackageSummarySearchDTO):
    Promise<string> {
    let query = "";
    if (searchDTO.acquisitionPackageStatus) {
      query = query + "^package_statusIN" + searchDTO.acquisitionPackageStatus;
    }
    if (searchDTO.searchString) {
      query = query + "^project_overviewLIKE" + searchDTO.searchString;
    }
    return query;
  }

  /**
   * Compiles a search query string for the mandatory search parameters of 'acquisition package'
   * table. For each search parameter, no need to check if the value exists since the
   * value is mandatory.
   */
  @Action({rawError: true})
  private async getMandatorySearchParameterQuery(searchDTO: AcquisitionPackageSummarySearchDTO):
    Promise<string> {

    const currentUser = await CurrentUserStore.getCurrentUser();
    const userSysId = currentUser.sys_id;

    let query = "^mission_ownersLIKE" + userSysId + "^ORcontributorsLIKE" + userSysId;
    query = query + "^mission_ownersISNOTEMPTY"
    query = query + "^ORDERBY" + searchDTO.sort;
    return query;
  }

  /**
   * Returns the count of all acquisition packages WITHOUT using the offset and limit parameters BUT
   * using all the other search parameters. This count is expected to be used for pagination.
   *
   * TODO: this call can be avoided if server exposes "x-Total-Count" from the backend
   */
  @Action({rawError: true})
  private async getAcquisitionPackageSummaryCount(searchQuery: string): Promise<number> {
    await this.ensureInitialized();
    const acquisitionPackageSummaryListRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_fields: 'package_status',
        sysparm_query: searchQuery
      }
    };
    const acquisitionPackageList = await api.acquisitionPackagesSummaryTable
      .getQuery(acquisitionPackageSummaryListRequestConfig);
    return acquisitionPackageList.length;
  }

  /**
   * Returns a list of all acquisition packages that match the search query.
   * The results are limited to offset and limit parameters of the pagination.
   */
  @Action({rawError: true})
  private async getAcquisitionPackageSummaryList(filterObject: {
    searchQuery: string,
    searchDTO: AcquisitionPackageSummarySearchDTO
  }): Promise<AcquisitionPackageSummaryDTO[]> {
    const searchQuery = filterObject.searchQuery;
    const searchDTO = filterObject.searchDTO;
    await this.ensureInitialized();
    const acquisitionPackageSummaryListRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: searchQuery,
        sysparm_display_value: "all",
        sysparm_fields: "project_overview,mission_owners,secondary_reviewers," +
          "package_status,contract_award,sys_id,sys_created_by,sys_updated_on,contributors," +
            "contracting_shop",
        sysparm_limit: searchDTO.limit,
        sysparm_offset: searchDTO.offset
      }
    };
    const acqPackageSummaryList = await api.acquisitionPackagesSummaryTable
      .getQuery(acquisitionPackageSummaryListRequestConfig);
    return acqPackageSummaryList.map(acqPackageSummary => {
      return {
        sys_id: acqPackageSummary.sys_id?.value,
        sys_created_by: acqPackageSummary.sys_created_by?.value,
        sys_updated_on: acqPackageSummary.sys_updated_on?.value,
        project_overview: acqPackageSummary.project_overview,
        secondary_reviewers: acqPackageSummary.secondary_reviewers,
        package_status: acqPackageSummary.package_status as DisplayColumn,
        mission_owners: acqPackageSummary.mission_owners,
        contract_award: acqPackageSummary.contract_award,
        contributors: acqPackageSummary.contributors,
        contracting_shop: acqPackageSummary.contracting_shop,
      }
    })
  }

  /**
   * Makes a callout to get the acquisition package search queries and then loads the acquisition
   * package list by concatenating the search queries
   */
  @Action({rawError: true})
  public async searchAcquisitionPackageSummaryList(searchDTO: AcquisitionPackageSummarySearchDTO):
    Promise<AcquisitionPackageSummaryMetadataAndDataDTO> {
    try {
      const optionalSearchQuery = await this.getOptionalSearchParameterQuery(searchDTO);
      let searchQuery = await this.getMandatorySearchParameterQuery(searchDTO);
      if (optionalSearchQuery.length > 0) {
        searchQuery = optionalSearchQuery + searchQuery;
      }
      const acquisitionPackageSummaryCount =
        await this.getAcquisitionPackageSummaryCount(searchQuery);
      let acquisitionPackageSummaryList: AcquisitionPackageSummaryDTO[];
      if (acquisitionPackageSummaryCount > 0) {
        acquisitionPackageSummaryList =
          await this.getAcquisitionPackageSummaryList({searchQuery, searchDTO});
      } else {
        acquisitionPackageSummaryList = [];
      }
      this.setAcquisitionPackageSummaryList(acquisitionPackageSummaryList); // caches the list
      await this.setPackagesWaitingForTaskOrder();
      return {
        total_count: acquisitionPackageSummaryCount,
        acquisitionPackageSummaryList: acquisitionPackageSummaryList
      };
    } catch (error) {
      throw new Error("error occurred searching acquisition package summary list :" + error);
    }
  }

  public packagesWaitingForTaskOrder = 0;
  @Action({rawError: true})
  public async setPackagesWaitingForTaskOrder(): Promise<void> {
    const searchDTO:AcquisitionPackageSummarySearchDTO = {
      acquisitionPackageStatus: "WAITING_FOR_TASK_ORDER",
      searchString: "",
      sort: "DESCsys_updated_on",
      offset: 0
    };
    const optionalSearchQuery = await this.getOptionalSearchParameterQuery(searchDTO);
    let searchQuery = await this.getMandatorySearchParameterQuery(searchDTO);
    searchQuery = optionalSearchQuery + searchQuery;
    const count = await this.getAcquisitionPackageSummaryCount(searchQuery);
    this.doSetPackagesWaitingForTaskOrder(count);
  }
  @Mutation
  public doSetPackagesWaitingForTaskOrder(count: number): void {
    this.packagesWaitingForTaskOrder = count;
  }
  public get getPackagesWaitingForTaskOrderCount(): number {
    return this.packagesWaitingForTaskOrder;
  }

  /**
   * Updates the status of an acquisition package and returns a boolean.
   * @param packageStatus - because of store restriction of just one parameter, a new local
   * type specific to this function is created.
   */
  @Action({rawError: true})
  public async updateAcquisitionPackageStatus(
    packageStatus: {
      acquisitionPackageSysId: string,
      newStatus: string
    }): Promise<boolean> {
    try {
      const status = {
        package_status: packageStatus.newStatus
      }
      await api.acquisitionPackagesSummaryTable
        .update(packageStatus.acquisitionPackageSysId, status);
      return true;
    } catch (error) {
      throw new Error(`an error occurred updating acquisition package status ${error}`);
    }
  }
}

const AcquisitionPackageSummary = getModule(AcquisitionPackageSummaryStore);
export default AcquisitionPackageSummary;

