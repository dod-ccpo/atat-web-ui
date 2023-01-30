<template>
  <div>
    <p> 
      Administrators are granted the highest level of access to your resources within 
      the cloud provider’s console. This role is designed for people responsible for 
      managing user accounts and permissions, configuring workspace settings, and 
      administering applications and environments.
    </p>
    <p>
      As a portfolio manager, you have the ability to add administrators within ATAT 
      to ensure that your development team can access their cloud resources. 
    </p>
    <p>
      Upon starting the provisioning process, ATAT will send your administrator’s 
      information to the CSP to create a new user account or connect an existing 
      account to your portfolio’s resources. This process could take up to {{ processLength }}.
    </p>
    <p>
      Once processed, your administrator will receive an email from the CSP with 
      login credentials. 
    </p>
    <p>
      <strong>Portfolio managers will not be able to cancel this process or revoke access 
      from within ATAT.</strong> CSP accounts can only be changed or revoked by another 
      administrator directly within the cloud console. 
    </p>
    <p>
      Please note that ATAT is not a system of record. We keep a log of the 
      administrators granted CSP access within the system, but any changes to
      user accounts made directly in the cloud portal are not reflected within 
      your ATAT portfolio details.
    </p>
    <ATATAlert 
      type="info"
    >
      <template v-slot:content>
        Administrators will only be granted access to the cloud provider’s console. 
        In order to view portfolio details or track funding within ATAT, you can 
        invite people as portfolio members and assign user roles.
      </template>
    </ATATAlert>
 </div>
</template>

<script lang="ts">
import PortfolioStore from "@/store/portfolio";
import { ClassificationLevels, PortfolioProvisioning } from "../../../types/Global";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue"

@Component({
  components: {
    ATATAlert
  }
})

export default class CSPAdminLearnMoreText extends Vue {
  public scrtStr = ClassificationLevels.SCRT;
  public unclStr = ClassificationLevels.UNCL;
  public tsStr = ClassificationLevels.TSCRT;

  public processLength = "2 hours";

  public setProcessLength(cl: string[]): void {
    this.processLength = cl && (cl.includes(this.scrtStr) || cl.includes(this.tsStr))
      ? "72 hours" : "2 hours";
  }

  public get provisioningData(): PortfolioProvisioning {
    return PortfolioStore.portfolioProvisioningObj;
  } 

  @Watch("provisioningData", {deep: true})
  public provisioningDataChanged(newVal: PortfolioProvisioning): void {
    if (newVal.classificationLevels?.length) {
      this.setProcessLength(newVal.classificationLevels);
    }
  }

  public async mounted(): Promise<void> {
    const storeData = await PortfolioStore.getPortfolioProvisioningObj();
    if (storeData.classificationLevels?.length) {
      this.setProcessLength(storeData.classificationLevels);
    } 
  }
}
</script>
