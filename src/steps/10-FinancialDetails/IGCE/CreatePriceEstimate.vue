<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s work on a price estimate for your cloud requirements
        </h1>
         <div class="copy-max-width">
            <p id="IntroP" class="mb-10">
              In the Performance Requirements section, you told us about all of the cloud 
              services and support that are needed for this project. Next, we’ll dive into 
              calculating the estimated prices to help you generate an Independent 
              Government Cost Estimate (IGCE). 
              <a id="LearnMoreIGCE"
                role="button"
                tabindex="0"
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel">
              <span class="">Learn more about IGCE</span>
              </a>
            </p>
          </div>
        <ATATAlert
          id="CalculatorCallout"
          type="callout"
          :showIcon="false"
          class="pa-8"
          calloutBackground="primary-lighter" 
        >
          <template v-slot:content>
            <h2>Getting started with your price estimate</h2>
            <v-list class="_atat-stepper">
              <v-list-item-group >
                <v-list-item>
                  <span class="_step-circle">1</span>
                  <v-list-item-content>
                    Choose one or more of the Cloud Service Provider (CSP) pricing 
                    calculators below to help you calculate your estimated price 
                    for JWCC cloud services and support. Depending on your selection, 
                    you may need to register for an account to view the pricing calculator.
                    <v-card 
                      v-for="(csp,idx) in csps" 
                      :key="idx" 
                      class="_csp-card _calculator-card"
                     >
                      <div class="_svg-icon-div">
                      <ATATSVGIcon 
                        id="Azure" 
                        :name="csp.iconName"
                        class="svg-icon"
                        :width="csp.width" 
                        :height="csp.height" />
                      </div>
                      <h3 class="_csp-name"> {{ csp.name }}</h3>
                      <div class="_csp-link-div">

                        <a v-for="(link, index) in csp.links"
                          :key="index" 
                          :id="csp.iconName.toUpperCase() + 'CalculatorLink'"
                          class="_csp-link d-block"
                          :href="link.url"
                          target="_blank"
                        >
                          {{ link.text }}
                          <span class="_text-decoration-none ml-1">
                          <ATATSVGIcon
                            :id="csp.iconName.toUpperCase() + 'LaunchIcon'"
                            width="15"
                            height="15"
                            name="launch"
                            color="primary"
                          />
                          </span>
                        </a>
                      </div>
                    </v-card>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <span class="_step-circle">2</span>
                  <v-list-item-content>
                    From one or more of the pricing calculator websites, add
                    products and services to fit your unique requirements, in
                    order to generate an independent estimate, generic to any
                    CSP.
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <span class="_step-circle">3</span>
                  <v-list-item-content class="pb-0">
                    Export a copy of your estimate or save a unique link to
                    revisit it directly through your browser. You will need to
                    refer to this report throughout the remaining “Requirements
                    Cost Estimate” interview questions.
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </template>
        </ATATAlert>

        <ATATAlert 
          id="EstimateAlert"
          type="warning"
          class="mt-10"
        >
          <template v-slot:content>
            JWCC CSP’s Pricing Calculator provides estimates for services only. 
            Final pricing for services, including potential additional discounts, 
            will be provided during the Task Order competition process.
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
import SlideoutPanel from "@/store/slideoutPanel";
import { SlideoutPanelContent } from "types/Global";
import IGCELearnMore from "./components/ICGELearnMore.vue";
@Component({
  components: {
    ATATAlert,
    ATATSVGIcon,
    IGCELearnMore
  },
})
export default class CreatePriceEstimate extends Vue {
  public selectedCSP = "";
  public csps = [
    {
      name: "Amazon Web Services (AWS)",
      iconName: "aws",
      width: "64",
      height: "39",
      links: [
        {
          text: "View calculator",
          url: "https://calculator.aws/#/?token=4ec5ddaefb8454253ef740c67969aae0&volume_discount=0"
        }
      ]
    },
    {
      name: "Google Cloud",
      iconName: "gcp",
      width: "62",
      height: "50",
      links: [
        {
          text: "IL2 calculator",
          url: "https://portal.gov.gss.google/il2/",
        },
        {
          text: "IL4 calculator",
          url: "https://portal.gov.gss.google/il4/calc.html",
        },
        {
          text: "IL6 calculator",
          url: "https://portal.gov.gss.google/il5/calc.html",
        }
      ] 
    },
    {
      name: "Microsoft Azure",
      iconName: "azure",
      width: "60",
      height: "56",
      links: [
        {
          text: "View calculator",
          url: "https://azure.microsoft.com/en-us/pricing/calculator/",
        }
      ]
    },                
    {
      name: "Oracle Cloud",
      iconName: "oracle",
      width: "64",
      height: "41",
      links: [
        {
          text: "View calculator",
          url: "https://cloud.nsg.oracle.com/ce/jwcc/index.html",
        }
      ]
    }
  ]
  public showAlert(csp: string):void {
    alert("Calculator link for " + csp + " to be provided in near future");
    this.selectedCSP = csp;
  }

  public async openSlideoutPanel(e: Event): Promise<void> {
    const opener = e.currentTarget as HTMLElement;
    SlideoutPanel.openSlideoutPanel(opener.id);
  };

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: IGCELearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  };

}
</script>

