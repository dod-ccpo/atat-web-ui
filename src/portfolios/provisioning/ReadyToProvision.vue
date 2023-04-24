<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
          Ready to provision your new ATAT portfolio?
        </h1>
        <p class="page-intro copy-max-width">
          Review your provisioning details below to ensure information is accurate. 
          When you are ready, click “Start provisioning” and we’ll submit this 
          information to  {{ provisioningData.cspLong }} to create your portfolio. 
          <strong>The provisioning process cannot be undone.</strong>    
        </p>

      <div class="d-flex width-100">
          <div class="flex-grow-1" style="margin-right: 80px;">
            <div class="border1 border-rounded border-base-lighter pa-8">
              <h2 class="mb-6">Provisioning details</h2>

              <div class="d-flex mb-6">
                <div style="width: 30px;" class="d-flex justify-center mr-2">
                  <ATATSVGIcon 
                    name="monetizationOn"
                    width="20"
                    height="20"
                    color="base-light"
                  />
                </div>
                <div>
                  <span class="_line-height-1 font-size-12 font-weight-700 text-base-light d-block">
                    TASK ORDER
                  </span>
                  #{{ provisioningData.taskOrderNumber }}
                </div>                
              </div>
              <div class="d-flex mb-6">
                <div style="width: 30px;" class="d-flex justify-center mr-2">
                  <ATATSVGIcon 
                    name="cloud"
                    width="24"
                    height="16"
                    color="base-light"
                  />
                </div>
                <div>
                  <span class="_line-height-1 font-size-12 font-weight-700 text-base-light d-block">
                    CLOUD SERVICE PROVIDER
                  </span>
                  {{ provisioningData.cspLong }}
                </div>                
              </div>
              <div class="d-flex">
                <div style="width: 30px;" class="d-flex justify-center mr-2">
                  <ATATSVGIcon 
                    name="manageAccount"
                    width="20"
                    height="17"
                    color="base-light"
                  />
                </div>
                <div>
                  <span class="_line-height-1 font-size-12 font-weight-700 text-base-light d-block">
                    ENVIRONMENTS AND ADMINISTRATORS
                  </span>
                  <span class="mr-10">
                    {{ classificationLevels }}
                  </span>
                  <span class="nowrap">
                    {{ adminCount }}
                  </span>

                </div>                
              </div>
            </div>
          
            <ATATExpandableLink aria-id="DataRetrievedFrom" class="mt-10">
              <template v-slot:header>
                What can I expect after provisioning starts?
              </template>
              <template v-slot:content>
                <p>
                  The provisioning process can take up to {{ processLength }}. We’ll 
                  email you when the process is complete, but you can come back to ATAT 
                  anytime for an up-to-date status of your portfolio and funding details.
                </p>
                <p>
                  Once complete, {{ provisioningData.csp }} will notify your CSP 
                  administrators with instructions for obtaining access to the cloud console.
                </p>
                <p>
                  You will have access to a new portfolio within ATAT. As the portfolio 
                  manage, you will be able to track cloud usage and manage spending 
                  throughout the duration of your task order. You can also add additional 
                  CSP administrators, if you need to grant more people access to your 
                  cloud console after the initial provisioning process.
                </p>
              </template>
            </ATATExpandableLink>          
          </div>

          <ATATSVGIcon :name="cspLogoName" width="460px" height="406px" />
        </div>      

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Mixins, Watch} from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";

import PortfolioStore from "@/store/portfolio";
import { ClassificationLevels, PortfolioProvisioning } from "../../../types/Global";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATExpandableLink,
    ATATSVGIcon,
  },
})
export default class ReadyToProvision extends Mixins(SaveOnLeave) {
  public provisioningData: PortfolioProvisioning = {};
  public cspLogoName = "";
  public scrtStr = ClassificationLevels.SCRT;
  public unclStr = ClassificationLevels.UNCL;
  public tsStr = ClassificationLevels.TSCRT;
  public processLength = "2 hours";
  public classificationLevels = "";
  public adminCount = "";

  @Watch("provisioningData")
  public provisioningDataChanged(newVal: PortfolioProvisioning): void {
    if (newVal.csp) {
      this.setCSPLogo();
    }
  }

  public setCSPLogo(): void {
    switch (this.provisioningData.csp?.toLowerCase()) {
    case "azure":
      this.cspLogoName = "ProvisionAzure";
      break;
    case "gcp":
      this.cspLogoName = "ProvisionGCP";
      break;
    case "oracle":
      this.cspLogoName = "ProvisionOracle";
      break;
    case "aws":
      this.cspLogoName = "ProvisionAWS";
      break;
    }
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await PortfolioStore.getPortfolioProvisioningObj();
    if (storeData) {
      this.provisioningData = _.cloneDeep(storeData);      
      const cl = storeData.classificationLevels;
      this.processLength = cl && (cl.includes(this.scrtStr) || cl.includes(this.tsStr))
        ? "72 hours" : "2 hours";
      this.classificationLevels = storeData.classificationLevels?.join(", ") as string;
      const len = storeData.admins?.length;
      this.adminCount = len && len > 1 ? len + " administrators" : "1 administrator";
    }
    
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  /**
   * By this step, all the data for provisioning of a portfolio had been collected from the user.
   * This function simply makes a call to the store to start the provisioning process.
   */
  public async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setDisableContinue(false);
    try {
      await PortfolioStore.startProvisioning();
    } catch (error) {
      console.error(error)
    }
    return true;
  }
}
</script>
