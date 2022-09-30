<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          Let’s work on a price estimate for your cloud requirements
        </h1>

        <ATATAlert
          type="callout"
          :showIcon="false"
          class="mt-10"
          calloutBackground="primary-lighter"
        >
          <template v-slot:content>
            <h2>Getting started with your price estimate</h2>
            <v-list class="ATATStepper">
              <v-list-item-group>
                <v-list-item>
                  <span class="step-circle">1</span>
                  <v-list-item-content>
                    Choose one or more of the CSP pricing calculators below to
                    help you calculate your estimated price for JWCC cloud
                    services and support.
                    <div class="d-flex ">
                    <v-card v-for="(csp,idx) in csps" :key="idx" 
                        class=
                          "calculator-card d-flex flex-column align-center justify-space-between"
                     >
                      <ATATSVGIcon 
                        id="Azure" 
                        :name="csp.iconName"
                        class="svg-icon"
                        :width="csp.width" 
                        :height="csp.height" />
                      <h3 class="csp-name"> {{ csp.name }}</h3>
                      <div class="csp-link-div d-flex justify-center mt-auto">
                        <a id="csp-link"> View calculator</a>
                        <span class="pl-2 d-flex">
                          <ATATSVGIcon
                            id="LinkIcon"
                            width="15"
                            height="15"
                            name="launch"
                            color="primary"
                          />
                        </span>
                      </div>
                    </v-card>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <span class="step-circle">2</span>
                  <v-list-item-content>
                    From one or more of the pricing calculator websites, add
                    products and services to fit your unique requirements, in
                    order to generate an independent estimate, generic to any
                    CSP.
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <span class="step-circle">3</span>
                  <v-list-item-content>
                    Export a copy of your estimate or save a unique link to
                    revisit it directly through your browser. You will need to
                    refer to this report throughout the remaining "Requirements
                    Cost Estimate" interview questions.
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </template>
        </ATATAlert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { Component } from "vue-property-decorator";
@Component({
  components: {
    ATATAlert,
    ATATSVGIcon,
  },
})
export default class CreatePriceEstimate extends Vue {

  public csps = [
    {
      name: "Amazon Web Services (AWS)",
      iconName: "aws",
      width: "64",
      height: "39" 
    },
    {
      name: "Google Cloud Platform (GCP)",
      iconName: "gcp",
      width: "64",
      height: "57 " 
    },
    {
      name: "Microsoft Azure",
      iconName: "azure",
      width: "64",
      height: "50" 
    },                
    {
      name: "Oracle Cloud",
      iconName: "oracle",
      width: "64",
      height: "41" 
    }
  ]

}
</script>

