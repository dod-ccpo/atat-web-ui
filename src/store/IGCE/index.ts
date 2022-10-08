/* eslint-disable camelcase */
import {
  AcquisitionPackageDTO, 
  ClassificationInstanceDTO, 
  ClassificationLevelDTO, 
  IGCEDataDTO, 
  PortfolioSummaryDTO, 
  ReferenceColumn,
  ServiceOfferingDTO
} from "@/api/models";
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import {AxiosRequestConfig} from "axios";
import { ServiceOfferingApi } from "@/api/serviceOffering";
import { sortedIndexOf } from "lodash";

const ATAT_PORTFOLIO_SUMMARY_KEY = "ATAT_PORTFOLIO_SUMMARY_KEY";

@Module({
  name: "IGCEStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class IGCEStore extends VuexModule {
  // initialized = false;
  // portfolioSummaryList: PortfolioSummaryDTO[] | null = null;
  IGCEData: IGCEDataDTO[] = []
  classReqSysIds: string[] = [];
  offeringsSysIds: string[] = [];
  classificationLevels: string[] = [];
  // /**
  //  * Constructs a single query that gets all the CSP records across all the portfolis. Parses
  //  * the response and sets the 'csp_display' to the respective portfolio.
  //  */
 
 

  @Action({rawError: true})
  public async loadIGCEData(): Promise<void> {
    // await this.ensureInitialized();
    try {
      const query =
        "selected_service_offeringsLIKE1b989eec8799d110bc86b889cebb353b"; 
        // pragma: allowlist secret
      const acqPackageConfig: AxiosRequestConfig = {
        params: {
          sysparm_query: query
        }
      };
      const acqPackage =
        await api.acquisitionPackageTable.getQuery(acqPackageConfig);
      if (acqPackage && acqPackage.length > 0) {
        await this.getSelectedServiceOfferings(
          acqPackage[0].selected_service_offerings
        )
        debugger;
        this.IGCEData.forEach((data)=>{
          this.classReqSysIds.push(data.classification_instance_id);
          this.offeringsSysIds.push(data.service_offering_id);
        })

        await this.getSelectedServiceOfferingDetails();
        await this.getClassificationRequirementsDetails();
        await this.getClassificationsLevelsDetails();
        console.log(this.IGCEData);
        // console.log(acqPackage)
        // await this.getClassificationReqs()
      }
      
    //   if (portfolioSummaryList && portfolioSummaryList.length > 0) {
    //     // callouts to other functions to set data from other tables
    //     await this.setCspDisplay(portfolioSummaryList);
    //     // await this.setTaskOrdersForPortfolios(portfolioSummaryList);
    //     // await this.setClinsToPortfolioTaskOrders(portfolioSummaryList);
    //     // await this.setCostsToTaskOrderClins(portfolioSummaryList);
    //     // all asynchronous calls are done before this step & data is available for aggregation
    //     this.computeAllAggregations(portfolioSummaryList);
    //     this.setPortfolioSummaryList(portfolioSummaryList); // caches the list
    //     return portfolioSummaryList;
    //   } else {
    //     return [];
    //}
    } catch (error) {
      throw new Error("error occurred loading acqPackage  :" + error);
    }
  }

  @Action({rawError: true})
  private async getSelectedServiceOfferings(selServiceOfferings: string) {
    // const sysparm_query = "sys_id=" + 
    //   selServiceOfferings.replace(",", "^ORsys_id=");
    const sysparm_query = "sys_id=5f73a523879add10ec3b777acebb35ac" +
                          "^ORsys_id=6f736167875e5d10bc86b889cebb3526" +
                          "^ORsys_id=c3636523879add10ec3b777acebb35ba" +
                          "^ORsys_id=0f632523879add10ec3b777acebb35ad";
    const allSSOList = await api.selectedServiceOfferingTable.getQuery(
      {
        params:
          {
            sysparm_fields: "service_offering, classification_instances",
            sysparm_query: sysparm_query
          }
      }
    )
    allSSOList.map((sso)=>{
      this.IGCEData.push(
        {
          classification_instance_id: sso.classification_instances,
          service_offering_id: (sso.service_offering as unknown as ReferenceColumn).value,
          classification_instances: [],
          classification_levels: [],
          classification_level_id: "",
          service_offering: []
        }
      )
    })
  }


  @Action({rawError: true})
  private async getSelectedServiceOfferingDetails() {
    // const offeringsSysIds = this.IGCEData.map((data)=> data.service_offering);
    const sysparm_query = "sys_id=" + 
      this.offeringsSysIds.join(",").replace(",", "^ORsys_id=");
    const offeringDetails = await api.serviceOfferingTable.getQuery(
      {
        params:
          {
            sysparm_fields: "name, sequence, service_offering_group, description,sys_id",
            sysparm_query: sysparm_query
          }
      }
    ) as ServiceOfferingDTO[];
    this.IGCEData.forEach((data)=>{
      data.service_offering = offeringDetails.filter(
        (offering)=>offering.sys_id === data.service_offering_id)
    })
  }

  @Action({rawError: true})
  private async getClassificationRequirementsDetails() {
    console.log(this.classReqSysIds);
    const sysparm_query = "sys_id=" + 
      this.classReqSysIds.join(",").replaceAll(",", "^ORsys_id=");
    console.log(sysparm_query);
    const classificationInstanceDetails = await api.classificationInstanceTable.getQuery(
      {
        params:
          {
            sysparm_fields: 
              "usage_description,sys_id, need_for_entire_task_order_duration, " +
              "classification_level, selected_periods, monthly_price",
            sysparm_query: sysparm_query
          }
      }
    ) as ClassificationInstanceDTO[];
    console.log(classificationInstanceDetails);
    this.IGCEData.forEach((data)=>{
      const classInstance =  classificationInstanceDetails.filter(
        (classLevel: ClassificationInstanceDTO)=>{
          return classLevel.sys_id === data.classification_instance_id
        }
      )[0];
      data.classification_instances?.push(classInstance);
      debugger;
      data.classification_level_id =
       (classInstance.classification_level as unknown as ReferenceColumn).value;
      this.classificationLevels.push(data.classification_level_id)
    })
  }

  @Action({rawError: true})
  private async getClassificationsLevelsDetails() {
    const sysparm_query = "sys_id=" + 
      this.classificationLevels.join(",").replace(",", "^ORsys_id=");
    const classificationLevelsDetails = await api.classificationLevelTable.getQuery(
      {
        params:
          {
            sysparm_fields: 
              "display, impact_level, classification, sys_id",
            sysparm_query: sysparm_query
          }
      }
    ) as ClassificationLevelDTO[];
    console.log(classificationLevelsDetails);
    this.IGCEData.forEach((data)=>{
      const classLevel =  classificationLevelsDetails.filter(
        (classLevel: ClassificationLevelDTO)=>{
          return classLevel.sys_id === data.classification_level_id
        }
      )[0];
      data.classification_levels.push(classLevel);
    })
  }

}

const IGCE = getModule(IGCEStore);
export default IGCE;

