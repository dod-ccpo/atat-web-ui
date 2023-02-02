<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s work on your performance requirements
        </h1>
        <div class="copy-max-width">
          <p class="mb-8">
            Through JWCC, you have the ability to set objective-based requirements, and/or 
            you can procure specific cloud resources, tools, and support services. We’ll walk 
            you through each performance area below to gather details for your Description of
            Work. You’ll have an opportunity to opt out of any areas that don’t apply to your
            acquisition.
          </p>
        </div>
        <h3>
          Add requirements for each performance area
        </h3>
        <div class="help-text">
          You must define requirements within at least one of the star-icon-here
          <strong>starred</strong> areas.
        </div>
      </v-col>
    </v-row>
    <DOWCard 
      v-for="(cardData, index) in requirementSections"
      :key="'DowCard' + index"
      :cardData="cardData"
    />
  </v-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import DOWCard from "@/steps/05-PerformanceRequirements/DOW/DOWCard.vue"

import Vue from "vue";

@Component({
  components: {
    ATATSVGIcon,
    DOWCard,
  }
})

export default class DOWLandingPageDraft extends Vue {
  public requirementSections: Record<string, string>[] = [
    {
      title: "Your Current Functions",
      // eslint-disable-next-line max-len
      label: "Choose to either replicate or optimize your current environment using JWCC offerings.",
      icon: "current-functions-circle",
      learnMore: "",
    },
    {
      title: "Architectural Design Solution",
      label: "Request a customized cloud solution for your known problem or use-case.",
      icon: "architecture-circle",
      learnMore: "",
    },
    {
      title: "Anything as a Service (XaaS)",
      // eslint-disable-next-line max-len
      label: "Select offerings from 11 categories to build your own requirements.",
      icon: "xaas-circle",
      learnMore: "Learn more about XaaS",
    },
    {
      title: "Cloud Support Package",
      label: "Select services from six categories.",
      icon: "support-circle",
      learnMore: "Learn more about support services",
    }
  ];
}

</script>
