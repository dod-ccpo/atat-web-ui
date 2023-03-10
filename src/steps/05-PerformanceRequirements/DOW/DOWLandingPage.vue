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
import { Component } from "vue-property-decorator";
import { routeNames } from "../../../router/stepper";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import DOWCard from "@/steps/05-PerformanceRequirements/DOW/DOWCard.vue"
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import { DOWCardData } from "types/Global";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Steps from "@/store/steps";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATSVGIcon,
    DOWCard,
  }
})

export default class DOWLandingPage extends SaveOnLeave {

  public requirementSections: DOWCardData[] = [
    {
      title: "Architectural Design Solution",
      label: "Request a customized cloud solution for your known problem or use-case.",
      icon: "architecture-circle",
      learnMore: "",
      route: routeNames.ArchitecturalDesign,
      defineRequirements: true,
      section: "ArchitecturalDesign",
      isComplete: false,
    },
    {
      title: "Anything as a Service (XaaS)",
      label: "Select offerings from 11 categories to build your own requirements.",
      icon: "xaas-circle",
      learnMore: "Learn more about XaaS",
      route: "pathResolver",
      defineRequirements: true,
      section: "XaaS",
      isComplete: false,
    },
    {
      title: "Cloud Support Package",
      label: "Select services from six categories.",
      icon: "support-circle",
      learnMore: "Learn more about support services",
      route: "pathResolver",
      defineRequirements: false,
      section: "CloudSupport",
      isComplete: false,
    }
  ];

  public async mounted(): Promise<void> {
    Steps.setAltBackButtonText("Back to Step 4");
    if (CurrentEnvironment.currentEnvironment) {
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
          isComplete: false,
        };
        this.requirementSections.unshift(currentEnvCardData)
      }
    }
    
    if (DescriptionOfWork.hasXaasService || DescriptionOfWork.hasCloudService
      || DescriptionOfWork.XaaSNoneSelected || DescriptionOfWork.cloudNoneSelected
    ) {
      const selectedXaasServices: string[] = [];
      const selectedCloudServices: string[] = [];
      const DOWObject = DescriptionOfWork.DOWObject;
      const offerings = DescriptionOfWork.serviceOfferingGroups;
      const xaasServices = DescriptionOfWork.xaasServices;
      const cloudSupportServices = DescriptionOfWork.cloudSupportServices;

      DOWObject.forEach((selectedOffering) => {
        const offering =  offerings.find(obj =>      
          obj.value === selectedOffering.serviceOfferingGroupId);

        if (offering) {
          if (xaasServices.includes(offering.value)) {
            selectedXaasServices.push(offering.label);
          }
          if (cloudSupportServices.includes(offering.value)) {
            selectedCloudServices.push(offering.label);
          }
        }
      });

      if (selectedXaasServices.length > 0 || DescriptionOfWork.XaaSNoneSelected) {
        const xaasIndex = this.requirementSections.findIndex(obj => obj.section === "XaaS");
        if (xaasIndex > -1) {
          this.requirementSections[xaasIndex].learnMore = "";
          this.requirementSections[xaasIndex].label = DescriptionOfWork.XaaSNoneSelected
            ? "No requirements" : selectedXaasServices.join(", ");
          this.requirementSections[xaasIndex].isComplete 
            = selectedXaasServices.length > 0 || DescriptionOfWork.XaaSNoneSelected;
        }
      }
      if (selectedCloudServices.length > 0 || DescriptionOfWork.cloudNoneSelected) {
        const cloudIndex = this.requirementSections.findIndex(
          obj => obj.section === "CloudSupport"
        );
        if (cloudIndex > -1) {
          this.requirementSections[cloudIndex].learnMore = "";
          this.requirementSections[cloudIndex].label = DescriptionOfWork.cloudNoneSelected
            ? "No requirements" : selectedCloudServices.join(", ");
          this.requirementSections[cloudIndex].isComplete 
            = selectedCloudServices.length > 0 || DescriptionOfWork.cloudNoneSelected;
        }
      }

    };

  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      Steps.clearAltBackButtonText();
    } catch (error) {
      console.log(error);
    }
    return true;
  }  


}

</script>
