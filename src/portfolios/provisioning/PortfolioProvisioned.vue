<template>
  <div>
    <v-container fluid class="container-max-width mb-15">
      <v-row class="mb-10">
        <v-col>
          <h1 class="page-header mb-3 mt-5">Your portfolio is being provisioned!</h1>
          <div class="copy-max-width">
            <p class="mb-0">
              We’re working with {{ provisioningData.cspLong }} to provision your cloud 
              resources. This process can take up to {{ processLength }}, but you can 
              come back here anytime to see your portfolio status.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div v-if="cardData.length" class="provisioned d-flex mr-15 flex-column">
            <v-card 
              v-for="(item, idx) in cardData"
              :key=idx
              :id="'ProvisioningCard' + idx" class="d-flex align-start pa-6 mb-6">
             <div class="mt-1">
             <ATATSVGIcon
                :name="item.icon"
                :width="item.iconWidth"
                :height="item.iconHeight"
                color="primary"
              />
             </div>
             <div class="ml-3">
              <h3>{{ item.headline }}</h3>
              <p v-html="item.text" class="ma-0 mt-2 body-sm">
              </p>
            </div>
            </v-card>
          </div>
        </v-col>
        <v-col class="pa-0 pb-3 pt-3">
          <ATATSVGIcon 
            name="PortfolioProvisionedIcon"
            color="white"
            width="360"
            height="370"
            />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component,  Vue, toNative } from "vue-facing-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PortfolioStore from "@/store/portfolio";
import _ from "lodash";
import { ClassificationLevels, PortfolioProvisioning } from "../../../types/Global";

@Component({
  components: {
    ATATSVGIcon
  },
})
class PortfolioProvisioned extends Vue {
  public scrtStr = ClassificationLevels.SCRT;
  public unclStr = ClassificationLevels.UNCL;
  public tsStr = ClassificationLevels.TSCRT;

  public provisioningData: PortfolioProvisioning =  {
    contractor: "",
  }
  public processLength = "2 hours"

  public cardData: Record<string, string>[] = [];

  public buildCardData(): void {
    this.cardData = [
      {
        headline: "Provisioning new environments",
        text: `{CSP Name} is taking care of everything to set up
        your cloud resources and administrator access. This process
        could take up to {2 or 72} hours. There is nothing further
        you need to do at this time. `
      },  {
        headline: "Transfer billing",
        text: `{CSP Name} is working to update billing information for your
        existing cloud environments to your JWCC task order. A representative
        from {CSP Name} will contact your task order POC directly, if
        additional information is needed.`
      }, {
        headline: "What can you expect next?",
        text: `Once provisioning is complete, {CSP Name} will contact your administrators with
        instructions for accessing the cloud console. </br> </br> {CSP Name} will contact your 
        task order POC once the billing transfer is complete. Throughout the duration of the
        task order, you’ll be able to track cloud usage and manage spending within your ATAT
        portfolio.`
      }, {
        headline: "Need help?",
        text: `For questions about transferring your billing information, contact {CSP Name}
        at {CSP support email address}.</br> </br>
        Feel free to <a href='https://community.hacc.mil/s/contact' target='blank'>contact us</a>
        if you have any questions. We are here to help!`
      }
    ];
  }
  // <a href='https://community.hacc.mil/s/contact' target='blank'>contact us</a>
  public async loadOnEnter(): Promise<void> {
    const storeData = await PortfolioStore.getPortfolioProvisioningObj();
    if (storeData.contractor) {
      this.provisioningData = _.cloneDeep(storeData);
      this.buildCardData();
      const cl = storeData.classificationLevels;
      this.processLength = cl && (cl.includes(this.scrtStr) || cl.includes(this.tsStr))
        ? "72 hours" : "2 hours";
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    await PortfolioStore.setSelectedAcquisitionPackageSysId("");
  }

}
export default toNative(PortfolioProvisioned)
</script>
