<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-1">
            Ready to provision your new ATAT portfolio?
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="copy-max-width">
            <p>
              Great news! We have everything we need to provision your cloud
              resources within {{ csp }}.
            </p>
            <p class="mb-6">
              <ul>
                <li class="mb-2">
                  Upon initiation of this process, we’ll submit your task order
                  and administrator details to {{ csp }} to create your cloud
                  environment and user accounts.
                  <strong>This process cannot be undone.</strong>
                </li>
                <li class="mb-2">
                  Once complete,CSP Name will notify your CSP administrators with
                  instructions for obtaining access to the cloud console.
                </li>
                <li>
                  You will automatically become a portfolio manager within ATAT
                  and will be able to track cloud usage and manage spending
                  throughout the duration of your task order. You can invite other
                  people from your organization to access the ATAT portfolio, if
                  needed.
                </li>
              </ul>
            </p>
          </div>
        </v-col>
         <v-col>  
          <ATATSVGIcon :name="getCSPLogo()" width="460px" height="406px" />
        </v-col>
      </v-row>
      </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
  },
})
export default class ReadyToProvision extends Vue {
  public csp = "";

  public getCSPLogo(): string {
    let logo = "";
    switch (this.csp.toLowerCase()) {
    case "microsoft azure":
      logo = "ProvisionAzure";
      break;
    case "google gcp":
      logo = "ProvisionGCP";
      break;
    case "oracle":
      logo = "ProvisionOracle";
      break;
    case "amazon aws":
      logo = "ProvisionAWS";
      break;
    }
    return logo;
  }

  public mounted(): void {
    this.csp = "Microsoft Azure";
  }
}
</script>
