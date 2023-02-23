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
          You must define requirements within at least one of the
          <strong>
            <ATATSVGIcon 
              name="star" 
              :width="15" 
              :height="15" 
              color="base"
              class="d-inline-flex mr-1"
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
import { DOWCardData } from "types/Global";

@Component({
  components: {
    ATATSVGIcon,
    DOWCard,
  }
})

export default class DOWLandingPage extends Vue {

  public requirementSections: DOWCardData[] = [
    {
      title: "Architectural Design Solution",
      label: "Request a customized cloud solution for your known problem or use-case.",
      icon: "architecture-circle",
      learnMore: "",
      route: routeNames.ArchitecturalDesign,
      defineRequirements: true,
      section: "ArchitecturalDesign",
    },
    {
      title: "Anything as a Service (XaaS)",
      label: "Select offerings from 11 categories to build your own requirements.",
      icon: "xaas-circle",
      learnMore: "Learn more about XaaS",
      route: routeNames.RequirementCategories,
      defineRequirements: true,
      section: "XaaS",
    },
    {
      title: "Cloud Support Package",
      label: "Select services from six categories.",
      icon: "support-circle",
      learnMore: "Learn more about support services",
      route: routeNames.RequirementCategories,
      defineRequirements: false,
      section: "CloudSupportPackage"
    }
  ];

  public async mounted(): Promise<void> {
    if (CurrentEnvironment.currentEnvironment) {
      
      debugger;

      const currentEnvironmentExists
        = CurrentEnvironment.currentEnvironment.current_environment_exists === "YES";
      if (currentEnvironmentExists) {
        const currentEnvCardData: DOWCardData = {
          title: "Your Current Functions",
          label: `Choose to either replicate or optimize your current environment using 
            JWCC offerings.`,
          icon: "current-functions-circle",
          learnMore: "",
          route: routeNames.ReplicateAndOptimize,
          defineRequirements: true,
          section: "ReplicateOptimize",
        };
        this.requirementSections.unshift(currentEnvCardData)
      }
    }
  }
}

</script>
