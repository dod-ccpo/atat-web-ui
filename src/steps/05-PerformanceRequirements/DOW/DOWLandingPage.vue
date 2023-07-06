<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3"
          v-if="totalSectionsComplete === 0">
          Let’s work on your performance requirements
        </h1>
        <h1 class="page-header mb-3"
          v-if="(totalSections - totalSectionsComplete) !== totalSections">
          Your Performance Requirements Summary
        </h1>
        <ATATAlert
            id="DefiningRequirements"
            calloutBackground="primary-lighter"
            :showIcon="false"
            class="container-max-width my-10 pt-6"
            type="callout"
        >
          <template v-slot:content>
            <ATATExpandableLink 
              :hasUnderline="false"
              :isCopyMaxWidth="false"
              class="container-max-width mb-n2"
              aria-id="ExpandDefiningRequirements">
              
              <template v-slot:header>
                <span class="h2 pt-n1">Defining your requirements with JWCC</span> 
              </template>
              <template
                  v-slot:content
                  v-if="currentEnvironmentExists"
              >
                <p class="container-max-width mt-2 mb-0">
                  JWCC provides flexibility in the way you define your requirements. If you
                  have an existing environment (on-prem, cloud, or hybrid), you may choose to
                  either replicate or optimize your current environment and functions using
                  JWCC services by selecting <strong>“Your Current Functions”</strong> below.
                </p>
                <p class="mt-2 mb-0">
                  You may instead choose to define your requirement by stating it in terms of an
                  objective, use-case, or problem statement for which the CSPs will propose a
                  solution; do this by selecting <strong>“Architectural Design Solution”</strong>
                  below.
                </p>
                <p class="mt-2 mb-0">
                  For those more versed in cloud technology or have known specific
                  requirements, you may define your needs by identifying the specific cloud
                  resources and/or tools that you require by choosing <strong>“Anything as a
                  Service (XaaS)”</strong> below.
                </p>
                <p class="mt-2 mb-0">
                  In addition to the above, you have the ability to add <strong>Cloud Support
                  Packages</strong> to any of the performance areas selected. This is optional and
                  ancillary to your selected performance areas.
                </p>
              </template>
              <template
                  v-slot:content
                  v-else
              >
                <p class="mt-2 mb-0">
                  JWCC provides flexibility in the way you define your requirements. You may
                  choose to define your requirement by stating it in terms of an objective,
                  use-case, or  problem statement for which the CSPs will propose a solution;
                  do this by selecting <strong>“Architectural Design Solution”</strong> below.
                </p>
                <p class="mt-2 mb-0">
                  For those more versed in cloud technology or have known specific requirements,
                  you may define your needs by identifying the specific cloud resources and/or
                  tools that you require by choosing <strong>“Anything as a Service (XaaS) ”
                </strong> below.
                </p>
                <p class="mt-2 mb-0">
                  In addition to the above, you have the ability to add <strong>Cloud Support
                  Packages</strong> to any of the performance areas selected. This is optional and
                  ancillary to your selected performance areas.
                </p>
              </template>
            </ATATExpandableLink>
          </template>
        </ATATAlert>
        <div class="copy-max-width">
          <p class="mb-8"
           v-if="displayWarning || (totalSectionsComplete > 0 &&
              totalSectionsComplete < totalSections)">
            We need some more details for this section. You can add info now, or come back to
            make edits at any time. When you are ready to wrap up this section, we’ll check for
            other contract considerations that may apply to your project.
          </p>
          <p class="mb-8"
             v-if="!displayWarning && (totalSections === totalSectionsComplete)">
            You are all done with this section, but you can come back at any time to edit
            details. When you are ready, we’ll check for other contract considerations that
            may apply to your project.
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
          areas below to include in your Description of Work. It is uncommon to select more than
          one. You may opt out of any areas that don't apply.
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
import { Component, Mixins } from "vue-property-decorator";
import { routeNames } from "@/router/stepper";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import DOWCard from "@/steps/05-PerformanceRequirements/DOW/DOWCard.vue"
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import {ClassificationLevelDTO} from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import { DOWCardData } from "types/Global";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Steps from "@/store/steps";
import SaveOnLeave from "@/mixins/saveOnLeave";
import {buildClassificationLabel} from "@/helpers";

@Component({
  components: {
    ATATAlert,
    ATATExpandableLink,
    ATATSVGIcon,
    DOWCard,
  }
})

export default class DOWLandingPage extends Mixins(SaveOnLeave) {
  displayWarning = false;
  totalSections = 3;
  totalSectionsComplete = 0;
  currentEnvironmentExists = this.doesCurrentEnvironmentExist();

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
      recommendedText:"those who need a customized cloud solution to address their unique situation"
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
      recommendedText:"those well-versed in cloud technology or with specific, known requirements"
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
    const dowArchNeeds = await DescriptionOfWork.getDOWArchitecturalNeeds();
    // is complete check
    const reqSectionIndex =this.requirementSections
      .findIndex(reqSection => reqSection.section === "ArchitecturalDesign")
    this.requirementSections[reqSectionIndex].isComplete =
        (dowArchNeeds.needs_architectural_design_services === "NO") ||
        ((dowArchNeeds.statement?.trim().length > 0) &&
            (dowArchNeeds.data_classification_levels?.length > 0))
    // label
    let label = "";
    if(dowArchNeeds.needs_architectural_design_services === "YES" &&
        dowArchNeeds.data_classification_levels?.length > 0 ) {
      const classificationLevels = await classificationRequirements
        .getAllClassificationLevels();
      label = "Required for ";
      const selectedLevels = dowArchNeeds.data_classification_levels as unknown as string[];
      selectedLevels.forEach((selectedLabel, index) => {
        const selectedClasslevelObj = classificationLevels
          .find(classificationLevel =>
            classificationLevel.sys_id === selectedLabel) as ClassificationLevelDTO;
        if (selectedClasslevelObj) {
          label = label + buildClassificationLabel(selectedClasslevelObj, "short")
        }
        if ((selectedLevels.length > 1) && (index === selectedLevels.length - 2)) {
          label = label + " and ";
        } else if (index < selectedLevels.length - 1) {
          label = label + ", ";
        }
      })
      label = label + (selectedLevels.length > 1 ? " environments" : " environment");
    } else if (dowArchNeeds.needs_architectural_design_services === "NO") {
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
    this.totalSectionsComplete = 0;
    let allRequiredSectionsComplete = true;
    ["ReplicateOptimize", "ArchitecturalDesign", "XaaS"].forEach(requiredSection => {
      const reqSectionIndex = this.requirementSections
        .findIndex(reqSection => reqSection.section === requiredSection);
      if (reqSectionIndex !== -1) {
        if (this.requirementSections[reqSectionIndex].isComplete) {
          this.totalSectionsComplete = this.totalSectionsComplete + 1;
        }
        if(allRequiredSectionsComplete && !this.requirementSections[reqSectionIndex].isComplete ) {
          allRequiredSectionsComplete = false;
        }
      }
    })
    const currEnv = CurrentEnvironment.currentEnvironment;
    const dowArchNeeds = DescriptionOfWork.DOWArchitectureNeeds;
    const replicateOptimizeIndex = this.requirementSections
      .findIndex(reqSection => reqSection.section === "ReplicateOptimize");
    if(allRequiredSectionsComplete &&
        (replicateOptimizeIndex === -1 || // "-1" checks if rep/opt section is on landing page
            currEnv.current_environment_replicated_optimized === "NO") &&
        dowArchNeeds.needs_architectural_design_services === "NO" &&
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
      DescriptionOfWork.setIsDOWComplete(false);
    } else {
      DescriptionOfWork.setIsDOWComplete(true);
    }
    if (DescriptionOfWork.hasCloudService || DescriptionOfWork.cloudNoneSelected) {
      this.totalSectionsComplete = this.totalSectionsComplete + 1;
    }
  }

  private doesCurrentEnvironmentExist(): boolean {
    return (CurrentEnvironment.currentEnvironment
      ? CurrentEnvironment.currentEnvironment.current_environment_exists === "YES" : false)
  }

  public async mounted(): Promise<void> {

    Steps.setAltBackButtonText("Back to Step 4");
    if (CurrentEnvironment.currentEnvironment) {
      const currentEnvironmentExists
        = CurrentEnvironment.currentEnvironment.current_environment_exists === "YES";
      if (currentEnvironmentExists) {
        this.totalSections = 4;
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
          recommendedText:"those with an existing environment (on-premise, cloud, or hybrid)"
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
