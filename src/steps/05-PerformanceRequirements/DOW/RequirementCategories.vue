<template>
  <div class="mb-7">
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Let’s work on your {{ offeringTypeHeading }}
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              {{ introText }}
              <a
                role="button"
                tabindex="0"
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel"
              >
                Learn more about {{ learnMoreWhat }}.
              </a>
            </p>
          </div>
          <div class="container-max-width">
            <DOWAlert
              v-show="showAlert"
              :isClassificationDataMissing="isClassificationDataMissing"
              :isPeriodsDataMissing="isPeriodsDataMissing"
            />

            <ATATAlert
              v-if="showWarning"
              id="ArchitecturalDesignAlert"
              type="warning"
              class="mb-10 mt-2"
              :showIcon="true"
            >
              <template v-slot:content>
                <p class="mr-5 mb-0 font-weight-400 font-size 16">
                  Based on what you previously told us, we recommend selecting at least one
                  category below. If you don’t need specific cloud resources or tools,
                  select “None of these apply to my acquisition” and revisit
                  
                  <span v-if="showCurrentFunctionsLink">
                    <router-link
                      id="CompleteCurrentEnv"
                      :to="{ name: routeNames.ReplicateAndOptimize }"
                    >Your Current Functions</router-link>
                    or
                  </span>
                  
                  <router-link
                    id="CompleteArchitectural"
                    :to="{ name: routeNames.ArchitecturalDesign }"
                  >Architectural Design Solution</router-link>

                  to define performance requirements for your Description of Work.
                </p>
              </template>
            </ATATAlert>
          </div>
          <v-form ref="form" class="copy-max-width">
            <ATATCheckboxGroup
              v-if="currentDOWSection === 'XaaS'"
              id="XaaSCheckboxes"
              :card="false"
              :items="xaasCheckboxItems"
              :noneValue="this.xaaSNoneValue"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
              :value.sync="selectedXaasOptions"
              aria-describedby="XaaSLabel"
              class="copy-max-width"
              groupLabel="What type of XaaS resources, tools, and services do you need?"
              groupLabelId="XaaSLabel"
            />
            <hr/>
            <ATATCheckboxGroup
              v-if="currentDOWSection === 'CloudSupport'"
              id="CloudSupportCheckboxes"
              :card="false"
              :items="cloudSupportCheckboxItems"
              :noneValue="this.cloudNoneValue"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
              :value.sync="selectedCloudOptions"
              aria-describedby="CloudSupportLabel"
              class="copy-max-width"
              groupLabel="What type of services do you need in a cloud support package?"
              groupLabelId="CloudSupportLabel"
            />
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import SaveOnLeave from "@/mixins/saveOnLeave";
import { Component, Mixins } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import XaasLearnMore from "./XaasLearnMore.vue";
import CloudSupportLearnMore from "./CloudSupportLearnMore.vue";

import SlideoutPanel from "@/store/slideoutPanel/index";

import { Checkbox, SlideoutPanelContent } from "../../../../types/Global";
import { SystemChoiceDTO } from "@/api/models";
import { routeNames } from "../../../router/stepper";

import DescriptionOfWork from "@/store/descriptionOfWork";
import { getIdText } from "@/helpers";
import Periods from "@/store/periods";
import classificationRequirements from "@/store/classificationRequirements";
import DOWAlert from "@/steps/05-PerformanceRequirements/DOW/DOWAlert.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATRadioGroup,
    DOWAlert,
    CloudSupportLearnMore,
    XaasLearnMore,
  }
})

export default class RequirementCategories extends Mixins(SaveOnLeave) {
  public selectedXaasOptions: string[] = [];
  public selectedCloudOptions: string[] = [];
  private cloudSupportCheckboxItems: Checkbox[] = [];
  public xaaSNoneValue = DescriptionOfWork.xaaSNoneValue;
  public cloudNoneValue = DescriptionOfWork.cloudNoneValue;
  private xaasCheckboxItems: Checkbox[] = [];
  private serviceOfferingGroups: SystemChoiceDTO[] = [];
  private isPeriodsDataMissing = false
  private isClassificationDataMissing = false
  private showAlert = false
  private routeNames = routeNames
  private goToSummary = false;

  public currentDOWSection = "";
  public needsReplicate = false;
  public needsOptimize = false;
  public needsReplicateOrOptimize = false;
  public needsArchitecturalDesign = false;
  public learnMoreWhat = "";

  public get offeringTypeHeading(): string {
    return this.currentDOWSection === "XaaS"
      ? "Anything as a Service (XaaS) requirements"
      : "cloud support package";
  }

  public introText = "";

  public get hasCurrentEnv(): boolean {
    return CurrentEnvironment.currentEnvironment.current_environment_exists === "YES"
  }

  public get replicateAndOptimizeIsNo():boolean {
    return CurrentEnvironment.currentEnvironment
      .current_environment_replicated_optimized === "NO"
  }

  public get architecturalDesignIsNo():boolean {
    return DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services === "NO"
  }

  public get showCurrentFunctionsLink(): boolean {
    return this.hasCurrentEnv && this.replicateAndOptimizeIsNo;
  }

  public get showWarning(): boolean {
    return (!this.hasCurrentEnv || (this.hasCurrentEnv && this.replicateAndOptimizeIsNo))
      && this.architecturalDesignIsNo
  }

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    };
  };

  public setIntroText(): void {
    if (this.currentDOWSection === "CloudSupport") {
      this.introText = `Specify any support services below that may apply to your
        acquisition, and we’ll walk through each selection to get more details. If
        you don’t need a cloud support package, select “None of these apply to my
        acquisition.”`;
    } else if (!this.needsReplicateOrOptimize && !this.needsArchitecturalDesign) {
      this.introText = `Specify any XaaS categories below that may apply to your
        acquisition, and we’ll walk through each selection to get more details.
        If you don’t want to add specific offerings, select “None of these apply
        to my acquisition,” and you can define objective-based requirements within
        another performance area.`
    } else {
      const needStr = this.needsArchitecturalDesign && !this.needsReplicateOrOptimize
        ? "requesting an architectural design"
        : this.needsReplicate
          ? "replicating your current environment"
          : "optimizing your current environment";
      this.introText = `In addition to ${needStr}, you can select additional offerings
        from 11 different XaaS categories below. We’ll walk through each selection to
        gather more details. If you don’t want to add specific offerings in addition
        to those proposed by the CSPs, select “None of these apply to my acquisition.”`
    }

  }

  public async loadOnEnter(): Promise<void> {
    this.currentDOWSection = DescriptionOfWork.currentDOWSection;
    this.learnMoreWhat = this.currentDOWSection === "XaaS"
      ? "XaaS categories" : "support services";
    this.needsReplicate =
      CurrentEnvironment.currentEnvironment.current_environment_replicated_optimized
        === "YES_REPLICATE";
    this.needsOptimize =
      CurrentEnvironment.currentEnvironment.current_environment_replicated_optimized
        === "YES_OPTIMIZE";
    this.needsReplicateOrOptimize = this.needsReplicate || this.needsOptimize;
    this.needsArchitecturalDesign
      = CurrentEnvironment.currentEnvironment?.needs_architectural_design_services === "YES";
    this.setIntroText();

    const periods = await Periods.loadPeriods();
    const classifications = await classificationRequirements.getSelectedClassificationLevels()
    if (periods && periods.length <= 0) {
      this.showAlert = true
      this.isPeriodsDataMissing = true
    };
    if (classifications && classifications.length <= 0) {
      this.showAlert = true
      this.isClassificationDataMissing = true
    };
    this.serviceOfferingGroups = await DescriptionOfWork.getServiceOfferingGroups();
    this.serviceOfferingGroups.forEach((serviceOfferingGroup) => {
      const checkboxItem: Checkbox = {
        id: this.getIdText(serviceOfferingGroup.value),
        label: serviceOfferingGroup.label,
        value: serviceOfferingGroup.value,
        description: serviceOfferingGroup.hint
      };

      const cloudServiceCategories = [
        "portability_plan",
        "advisory_assistance",
        "help_desk_services",
        "training",
        "documentation_support",
        "general_cloud_support",
        this.cloudNoneValue.toLowerCase()
      ];
      if (!cloudServiceCategories.includes(checkboxItem.value.toLowerCase())) {
        this.xaasCheckboxItems.push(checkboxItem);
      } else {
        this.cloudSupportCheckboxItems.push(checkboxItem);
      };

      this.selectedXaasOptions = DescriptionOfWork.XaaSNoneSelected
        ? [DescriptionOfWork.xaaSNoneValue]
        : DescriptionOfWork.xaasServices.filter(
          cat => DescriptionOfWork.selectedServiceOfferingGroups.includes(cat)
        );

      this.selectedCloudOptions = DescriptionOfWork.cloudNoneSelected
        ? [DescriptionOfWork.cloudNoneValue]
        : DescriptionOfWork.cloudSupportServices.filter(
          cat => DescriptionOfWork.selectedServiceOfferingGroups.includes(cat)
        );
    });

    const xaasNone: Checkbox = {
      id: "XaaSNoneApply",
      label: "None of these apply to my acquisition.",
      value: this.xaaSNoneValue,
    };
    this.xaasCheckboxItems.push(xaasNone)

    const cloudSupportNone: Checkbox = {
      id: "CloudSupportNoneApply",
      label: "None of these apply to my acquisition.",
      value: this.cloudNoneValue,
    };
    this.cloudSupportCheckboxItems.push(cloudSupportNone)

  }

  public async mounted(): Promise<void> {
    const isXaaS = DescriptionOfWork.currentDOWSection === "XaaS";
    const isCloud = DescriptionOfWork.currentDOWSection === "CloudSupport";

    this.goToSummary = (isXaaS && DescriptionOfWork.hasXaasService)
      || (isCloud && DescriptionOfWork.hasCloudService);
    if (this.goToSummary) {
      DescriptionOfWork.setBackToContractDetails(true);
      this.$router.push({
        name: routeNames.DOWSummary,
      }).catch(() => console.log("error navigating to DOW Summary"));
    }    
    await this.loadOnEnter();
    const slideoutComponent = this.currentDOWSection === "XaaS"
      ? XaasLearnMore : CloudSupportLearnMore;
    const slideoutPanelContent: SlideoutPanelContent = {
      component: slideoutComponent,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  };

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    try {
      if (!this.goToSummary) {
        // save to store
        const selectedOfferingGroups
          = this.selectedXaasOptions.concat(this.selectedCloudOptions);

        await DescriptionOfWork.setSelectedOfferingGroups(selectedOfferingGroups);
      }
    } catch (error) {
      throw new Error('error saving requirement data');
    }

    return true;
  };

  private getIdText(string: string) {
    return getIdText(string);
  };

};
</script>
