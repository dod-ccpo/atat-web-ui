<template>
  <div>
    <v-container fluid class="container-max-width mb-15">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3 mt-5">Your portfolio is being provisioned!</h1>
          <div class="copy-max-width">
            <p class="mb-6">
              We’re working with {{ provisioningData.cspLong }} to provision your cloud
              resources. This process can take up to {{ processLength }}. We’ll email you
              when the process is complete, but you can come back here anytime
              for an up-to-date status of your portfolio and funding details.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div v-if="cardData.length" class="provisioned d-flex justify-space-between width-100">
            <v-card 
              v-for="(item, idx) in cardData"
              :key=idx
              :id="'ProvisioningCard' + idx" class="d-flex align-start pa-6 mr-6">
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
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PortfolioStore from "@/store/portfolio";
import _ from "lodash";
import { ClassificationLevels, PortfolioProvisioning } from "../../../types/Global";

@Component({
  components: {
    ATATSVGIcon
  },
})
export default class Provisioned extends Vue {
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
        icon: "CloudUpload",
        iconWidth: "36",
        iconHeight: "24",
        headline: "Provisioning",
        text: "We’re taking care of everything to set up your cloud resources and administrator " +
              "access, so there is nothing else you need to do."
      },  {
        icon: "People",
        iconWidth: "33",
        iconHeight: "21",
        headline: "CSP portal access",
        text: `Once provisioned, ${this.provisioningData.csp} will notify your 
          administrators with instructions for obtaining access to the cloud console.`
      },  {
        icon: "HelpOutline",
        iconWidth: "30",
        iconHeight: "30",
        headline: "Need help?",
        text: `Feel free to <a href='https://community.hacc.mil/s/contact' target='blank'>contact
          us</a> if you have any questions. We are here to help!`
      }
    ];
  }

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
</script>
