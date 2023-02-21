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
        <h2>
          Add requirements for each performance area
        </h2>
        <p class="text-base">
          You must define requirements within at least one of the star-icon-here
          <strong>
            <ATATSVGIcon 
              name="star" 
              :width="15" 
              :height="15" 
              color="base"
              class="d-inline-flex"
              />starred
          </strong>
          areas.
        </p>
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
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import DOWCard from "@/steps/05-PerformanceRequirements/DOW/DOWCard.vue"
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import { routeNames } from "../../../router/stepper";

@Component({
  components: {
    ATATSVGIcon,
    DOWCard,
  }
})

export default class DOWLandingPageDraft extends Vue {
  // TODO: don't show Current functions if No current environment exists
  public currentEnvironmentExists = "";

  public requirementSections: Record<string, string | boolean>[] = [
    {
      title: "Your Current Functions",
      // eslint-disable-next-line max-len
      label: "Choose to either replicate or optimize your current environment using JWCC offerings.",
      icon: "current-functions-circle",
      learnMore: "",
      route: routeNames.ReplicateAndOptimize,
      defineRequirements: true,
    },
    {
      title: "Architectural Design Solution",
      label: "Request a customized cloud solution for your known problem or use-case.",
      icon: "architecture-circle",
      learnMore: "",
      route: routeNames.ArchitecturalDesign,
      defineRequirements: true,
    },
    {
      title: "Anything as a Service (XaaS)",
      label: "Select offerings from 11 categories to build your own requirements.",
      icon: "xaas-circle",
      learnMore: "Learn more about XaaS",
      route: routeNames.RequirementCategories,
      defineRequirements: true,
    },
    {
      title: "Cloud Support Package",
      label: "Select services from six categories.",
      icon: "support-circle",
      learnMore: "Learn more about support services",
      route: routeNames.RequirementCategories,
      defineRequirements: false,
    }
  ];

  public async mounted(): Promise<void> {
    if (CurrentEnvironment.currentEnvironment) {
      this.currentEnvironmentExists
        = CurrentEnvironment.currentEnvironment.current_environment_exists ? "YES" : "NO"
    }
  };
}



</script>
