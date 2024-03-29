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
            <div class="border1 _border-rounded border-base-lighter pa-8">
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
                  <div v-for="(obj, i) in cspAdmins" :key="i">
                    <span class="mr-10 d-inline-block mb-2" style="width: 140px;">
                      {{ obj.env }}
                    </span>
                    <span class="nowrap">
                      {{ obj.admins }} administrator<span v-if="obj.admins > 1">s</span>
                    </span>
                  </div>

                </div>                
              </div>
            </div>
          
            <ATATExpandableLink aria-id="DataRetrievedFrom" class="mt-10">
              <template v-slot:header>
                What can I expect after provisioning starts?
              </template>
              <template v-slot:content>
                <p>
                  The provisioning process can take up to {{ processLength }}. 
                  Once complete, {{ provisioningData.csp }} will notify your CSP 
                  administrators with instructions for obtaining access to the cloud console.
                </p>
                <p>
                  You can come back to ATAT anytime for an up-to-date status of 
                  your portfolio and funding details. As the portfolio owner, you 
                  can track cloud usage and manage spending throughout the duration 
                  of your task order.
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
import {Component, Watch,  Vue, toNative } from "vue-facing-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";

import PortfolioStore from "@/store/portfolio";
import { ClassificationLevels, PortfolioProvisioning } from "../../../types/Global";
import _ from "lodash";

interface CSPAdmins {
  env: string;
  admins: number;
  sort: number;
}

@Component({
  components: {
    ATATExpandableLink,
    ATATSVGIcon,
  },
})

class ReadyToProvision extends Vue {
  public provisioningData: PortfolioProvisioning = {};
  public cspLogoName = "";
  public scrtStr = ClassificationLevels.SCRT;
  public unclStr = ClassificationLevels.UNCL;
  public tsStr = ClassificationLevels.TSCRT;
  public processLength = "2 hours";
  public cspAdmins: CSPAdmins[] = [];

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

  public async addCSPAdminToEnv(i: number, env: string, sort: number): Promise<void> {
    if (i > -1) {
      this.cspAdmins[i].admins = this.cspAdmins[i].admins + 1;
    } else {
      this.cspAdmins.push({ env, admins: 1, sort });
    }
  }

  public async configureCSPAdminData(): Promise<void> {
    const hasILs = 
      this.provisioningData.selectedILs && this.provisioningData.selectedILs.length > 0;

    this.provisioningData.admins?.forEach(async admin => {
      if (admin.hasUnclassifiedAccess === "YES") {
        if (hasILs) {
          admin.impactLevels?.forEach(async value => {
            const il = value.split('_')[1].toUpperCase();
            const i = this.cspAdmins.findIndex(obj => obj.env === "Unclassified/" + il);
            const sort = parseInt(il.replace(/\D/g, "")); // get the number from the IL string
            await this.addCSPAdminToEnv(i, "Unclassified/" + il, sort);
          });
        } else {
          const i = this.cspAdmins.findIndex(obj => obj.env === this.unclStr);
          await this.addCSPAdminToEnv(i, this.unclStr, 1);
        }
      }
      if (admin.hasScrtAccess === "YES") {
        const i = this.cspAdmins.findIndex(obj => obj.env === this.scrtStr);
        await this.addCSPAdminToEnv(i, this.scrtStr, 10);
      }      
      if (admin.hasTSAccess === "YES") {
        const i = this.cspAdmins.findIndex(obj => obj.env === this.tsStr);
        await this.addCSPAdminToEnv(i, this.tsStr, 20);
      }
    });
    
    this.cspAdmins.sort((a,b) => a.sort - b.sort);
    
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await PortfolioStore.getPortfolioProvisioningObj();
    if (storeData) {
      this.provisioningData = _.cloneDeep(storeData);      
      const cl = storeData.classificationLevels;
      this.processLength = cl && (cl.includes(this.scrtStr) || cl.includes(this.tsStr))
        ? "72 hours" : "2 hours";

      await this.configureCSPAdminData();
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
export default toNative(ReadyToProvision)
</script>
