/* eslint-disable camelcase */
import { 
  AcquisitionPackageDTO, 
  PackageSummaryDTO, 
  ReferenceColumn } 
  from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";
import { flatMap } from "lodash";
import { isTemplateElement } from "@babel/types";

// const ATAT_PORTFOLIO_SUMMARY_KEY = "ATAT_PORTFOLIO_SUMMARY_KEY";

@Module({
  name: "PackageSummaryStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class PackageSummaryStore extends VuexModule {
  // initialized = false;
  packageList: PackageSummaryDTO[] = [];



  // @Action
  // public async getAllPackagesSummaryList(): Promise<acqu[] | null> {
  //   return this.portfolioSummaryList;
  // }

  // store session properties
  // protected sessionProperties: string[] = [
  //   nameofProperty(this, (x) => x.portfolioSummaryList)
  // ];

  // @Mutation
  // public setStoreData(sessionData: string): void {
  //   try {
  //     const sessionDataObject = JSON.parse(sessionData);
  //     Object.keys(sessionDataObject).forEach((property) => {
  //       Vue.set(this, property, sessionDataObject[property]);
  //     });
  //   } catch (error) {
  //     throw new Error("error restoring session for portfolio summary data store");
  //   }
  // }

  // @Mutation
  // public setInitialized(value: boolean): void {
  //   this.initialized = value;
  // }

  // @Mutation
  // public setPortfolioSummaryList(value: PortfolioSummaryDTO[]): void {
  //   this.portfolioSummaryList = value;
  //   storeDataToSession(
  //     this,
  //     this.sessionProperties,
  //     ATAT_PORTFOLIO_SUMMARY_KEY
  //   );
  // }

  // @Action({rawError: true})
  // async initialize(): Promise<void> {
  //   const sessionRestored = retrieveSession(ATAT_PORTFOLIO_SUMMARY_KEY);
  //   if (sessionRestored) {
  //     this.setStoreData(sessionRestored);
  //     this.setInitialized(true);
  //   }
  // }

  // @Action({rawError: true})
  // async ensureInitialized(): Promise<void> {
  //   await this.initialize();
  // }

  

  /**
   * Returns the packageList with the relevant data structure for the 
   * package list
   * TODO: this call can be avoided if server exposes "x-Total-Count" from the backend
   */
  @Action({rawError: true})
  public async getPackageData(): Promise<PackageSummaryDTO[]> {
    // await this.ensureInitialized();
    await this.getAcqPackageData();
    await this.getPackageTitle();
  
    return this.packageList;
  }

  @Action({rawError: true})
  public async getAcqPackageData(): Promise<void>{
    const packageSummaryListRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_fields: 'project_overview,sys_created_by,sys_updated_on,mission_owners,' +
                          'secondary_reviewers,package_status, contract_award',
        sysparm_query: 'package_status!=DRAFT^ORmission_ownersISNOTEMPTY'
      }
    };
    const packages = 
      await api.acquisitionPackageTable.getQuery(packageSummaryListRequestConfig);
    packages.forEach((p: AcquisitionPackageDTO)=>{
      this.packageList.push({
        project_overview: (p.project_overview as unknown as ReferenceColumn).value,
        title: "",
        secondary_reviewers: p.secondary_reviewers,
        package_status: p.status,
        sys_updated_on: p.sys_updated_on,
        sys_created_by: p.sys_created_by,
        mission_owners: p.mission_owners,
        contract_award: (p.contract_award as ReferenceColumn).value
      })
    })
  }

  @Action({rawError: true})
  public async getPackageTitle(): Promise<void> {
    const packageSysIdQuery = 'sys_id=' +
      this.packageList.filter((item)=>item.project_overview!==undefined)
        .flatMap((item)=>item.project_overview).join('^ORsys_id=')
    console.log(packageSysIdQuery);

    const projectOverviewRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_fields: 'title,sys_id',
        sysparm_query:  packageSysIdQuery
      }
    };
    const packages = 
      await api.projectOverviewTable.getQuery(projectOverviewRequestConfig);
    console.log(packages);
    this.packageList.forEach((pkge)=>{
      const projOverview = packages.filter(
        (p)=>p.sys_id === pkge.project_overview)[0];
      pkge.title = projOverview ? projOverview.title : "New Project";
    })


  }
}

const PackageSummary = getModule(PackageSummaryStore);
export default PackageSummary;

