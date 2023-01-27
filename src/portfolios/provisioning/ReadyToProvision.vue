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
          information to Microsoft Azure to create your portfolio. <strong>The 
          provisioning process cannot be undone.</strong>    
        </p>

        <div class="d-flex width-100">
          <div class="flex-grow-1 mr-10">
            <div class="border1 border-rounded border-base-lighter pa-8">
              <h2 class="h3">Provisioning details</h2>

              <div class="d-flex">
                <ATATSVGIcon 
                  name="monetizationOn"
                  width="20"
                  height="20"
                  color="base-light"
                />
                <div>
                  money money money
                </div>

                
              </div>

            </div>
          </div>


          <ATATSVGIcon :name="getCSPLogo()" width="460px" height="406px" />
        </div>

      </v-col>
    </v-row>
  </v-container>
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
