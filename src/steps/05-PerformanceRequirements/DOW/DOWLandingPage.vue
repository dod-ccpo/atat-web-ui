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
        <div v-if="displayWarning" class="mb-4">
          <ATATAlert
              id="DOWLandingPageWarningAlert"
              type="error"
              :showIcon="true">
            <template v-slot:content>
              <p class="mr-5 mb-0">
                JWCC is not a support services contract, so you must define at
                least one objective-based or cloud-specific requirement. Revisit
                any of the starred performance areas to update your selection.
                Once a requirement is added, all starred areas will be complete.
                If you need assistance,
                <a href="https://community.hacc.mil/s/contact" target="_blank">
                  contact Customer Support.
                </a>
              </p>
            </template>
          </ATATAlert>
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
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { routeNames } from "@/router/stepper";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import DOWCard from "@/steps/05-PerformanceRequirements/DOW/DOWCard.vue"
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import {ClassificationLevelDTO} from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";
import ATATAlert from "@/components/ATATAlert.vue";
import { DOWCardData } from "types/Global";
import DescriptionOfWork from "@/store/descriptionOfWork";
import {buildClassificationLabel} from "@/helpers";

@Component({
  components: {
    ATATAlert,
    ATATSVGIcon,
    DOWCard,
  }
})

export default class DOWLandingPage extends Vue {
  displayWarning = false;

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

  /**
   * Sets the 'label' and 'isComplete' properties of the optimize/replicate section.
   *
   * Label gets built using the classification level options that the user selects. Default label
   * is left as is, if no levels are selected
   *
   * Current functions are complete, if all the below are true;
   * 1. If the user chooses NOT to optimize or replicate
   * 2. If the user chooses to optimize or replicate AND
   *      chooses (NO) or (YES for additional growth and enters anticipated capacity)
   * 3. If the user chooses to optimize or replicate AND
   *      chooses (NO) or (YES for phased approach and enters approach schedule)
   */
  setCurrentFunctionsProperties(): void {
    const currEnv = CurrentEnvironment.currentEnvironment;
    // is complete check
    const reqSectionIndex =this.requirementSections
      .findIndex(reqSection => reqSection.section === "ReplicateOptimize")
    if (reqSectionIndex !== -1) { // rep/opt won't display on landing page if there is no curr env.
      this.requirementSections[reqSectionIndex].isComplete =
          (currEnv.current_environment_replicated_optimized === "NO") ||
          ((currEnv.statement_replicated_optimized !== "") &&
            ((currEnv.additional_growth === 'NO') || (currEnv.additional_growth === 'YES' &&
              (currEnv.anticipated_yearly_additional_capacity !== null ||
                  currEnv.anticipated_yearly_additional_capacity as unknown as string) !== "")) &&
            ((currEnv.has_phased_approach === "NO") ||
              (currEnv.has_phased_approach === 'YES' && currEnv.phased_approach_schedule !== "")))
    }
    // label
    let label = null;
    if (currEnv.current_environment_replicated_optimized === "YES_REPLICATE") {
      label = "Replicate (lift and shift) using JWCC offerings";
    } else if (currEnv.current_environment_replicated_optimized === "YES_OPTIMIZE") {
      label = "Optimize (improve/modernize) using JWCC offerings";
    } else if (currEnv.current_environment_replicated_optimized === "NO") {
      label = "No requirements";
    }
    if (label !== null) { // only set the label if the user had selected one of the options
      this.requirementSections[reqSectionIndex].label = label;
    }
  }

  /**
   * Sets the 'label' and 'isComplete' properties of the architectural section.
   *
   * Label gets built using the classification level options that the user selects. Default label
   * is left as is, if no levels are selected
   *
   * Architectural design solution is complete, if all the below are true;
   * 1. If the user does not need an architectural solution.
   * 2. If the user needs an architectural solution AND
   *      provides a detailed statement.
   * 3. If the user needs an architectural solution AND
   *      identifies at least one classification level that needs a solution.
   */
  async setArchitecturalDesignProperties(): Promise<void> {
    const currEnv = CurrentEnvironment.currentEnvironment;
    const currEnvArchNeeds = await CurrentEnvironment.getCurrentEnvironmentArchitecturalNeeds();
    // is complete check
    const reqSectionIndex =this.requirementSections
      .findIndex(reqSection => reqSection.section === "ArchitecturalDesign")
    this.requirementSections[reqSectionIndex].isComplete =
        (currEnv.needs_architectural_design_services === "NO") ||
        ((currEnvArchNeeds.statement?.trim().length > 0) &&
            (currEnvArchNeeds.data_classification_levels?.length > 0))
    // label
    let label = "";
    if(currEnvArchNeeds.data_classification_levels?.length > 0 ) {
      const classificationLevels = await classificationRequirements
        .getAllClassificationLevels();
      label = "Required for ";
      const selectedLevels = currEnvArchNeeds.data_classification_levels as unknown as string[];
      selectedLevels.forEach((selectedLabel, index) => {
        const selectedClasslevelObj = classificationLevels
          .find(classificationLevel =>
            classificationLevel.sys_id === selectedLabel) as ClassificationLevelDTO;
        label = label + buildClassificationLabel(selectedClasslevelObj, "short")
        if ((selectedLevels.length > 1) && (index === selectedLevels.length - 2)) {
          label = label + " and ";
        } else if (index < selectedLevels.length - 1) {
          label = label + ", ";
        }
      })
      label = label + (selectedLevels.length > 1 ? " environments" : " environment");
    } else if (currEnv.needs_architectural_design_services === "NO") {
      label = "No requirements";
    }
    if (label !== "") {
      this.requirementSections[reqSectionIndex].label = label;
    }
  }

  /**
   * Checks all three sections and if the user explicitly selects no requirements across all the
   * required sections. This check does not apply if the user does not start or completes one or
   * more of the required sections.
   */
  checkDisplayWarning(): void {
    const currEnv = CurrentEnvironment.currentEnvironment;
    let allRequiredSectionsComplete = true;
    ["ReplicateOptimize", "ArchitecturalDesign", "XaaS"].forEach(requiredSection => {
      const reqSectionIndex = this.requirementSections
        .findIndex(reqSection => reqSection.section === requiredSection);
      if (reqSectionIndex !== -1) {
        if(allRequiredSectionsComplete && !this.requirementSections[reqSectionIndex].isComplete ) {
          allRequiredSectionsComplete = false;
        }
      }
    })
    const replicateOptimizeIndex = this.requirementSections
      .findIndex(reqSection => reqSection.section === "ReplicateOptimize");
    if(allRequiredSectionsComplete &&
        (replicateOptimizeIndex === -1 ||
            currEnv.current_environment_replicated_optimized === "NO") &&
        currEnv.needs_architectural_design_services === "NO" &&
        DescriptionOfWork.XaaSNoneSelected) {
      this.displayWarning = true;
      // also need to mark all the sections as in-complete (or display purple color) and set
      // DOWCard button text
      ["ReplicateOptimize", "ArchitecturalDesign", "XaaS"].forEach(requiredSection => {
        const reqSectionIndex = this.requirementSections
          .findIndex(reqSection => reqSection.section === requiredSection);
        if (reqSectionIndex !== -1) {
          this.requirementSections[reqSectionIndex].isComplete = false;
          this.requirementSections[reqSectionIndex].buttonLabel = "Revisit";
        }
      })
    }
  }

  public async mounted(): Promise<void> {
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

    }
    this.setCurrentFunctionsProperties();
    await this.setArchitecturalDesignProperties();
    this.checkDisplayWarning();
  }
}

</script>
