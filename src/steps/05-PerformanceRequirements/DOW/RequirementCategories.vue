<template>
  <div class="mb-7">
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s work on your performance requirements
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              {{introText}}
              <a
                role="button"
                tabindex="0"
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel"
              >
                Learn more about categories.
              </a>
            </p>
          </div>
          <div class="container-max-width">
            <DOWAlert
              v-show="showAlert"
              :isClassificationDataMissing="isClassificationDataMissing"
              :isPeriodsDataMissing="isPeriodsDataMissing"
            />
          </div>
          <div class="copy-max-width">
            <legend
              class="font-weight-500 pb-0 mr-2"
            >
              Do you need an architectural design solution to address a known
              problem or use-case?<br/>
              <span
                class="text-base-light font-weight-400"
              >
                This is in addition to any known problems 
                that you told us about for your current environment.
              </span>
            </legend>
            <ATATRadioGroup 
              id="ArchitectureOptions"
              :width="180"
              :items="radioOptions"
              :value.sync="currEnvDTO.needs_architectural_design_services"
              :rules="[$validators.required('Please select an option.')]"
            />
          </div>
          <hr/>
          <div class="copy-max-width">
            <ATATCheckboxGroup
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
              id="CloudSupportCheckboxes"
              :card="false"
              :items="cloudSupportCheckboxItems"
              :noneValue="this.cloudNoneValue"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
              :value.sync="cloudSupportSelectedOptions"
              aria-describedby="CloudSupportLabel"
              class="copy-max-width"
              groupLabel="What type of services do you need in a cloud support package?"
              groupLabelId="CloudSupportLabel"
            />
          </div>
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
import PerfReqLearnMore from "./PerfReqLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

import { Checkbox, RadioButton, SlideoutPanelContent } from "../../../../types/Global";
import { defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";
import { SystemChoiceDTO } from "@/api/models";
import { routeNames } from "../../../router/stepper";
import _ from "lodash";
// import router from "@/router";

import DescriptionOfWork from "@/store/descriptionOfWork";
import { getIdText } from "@/helpers";
import Periods from "@/store/periods";
import classificationRequirements from "@/store/classificationRequirements";
import DOWAlert from "@/steps/05-PerformanceRequirements/DOW/DOWAlert.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";


@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    PerfReqLearnMore,
    DOWAlert
  }
})

export default class RequirementCategories extends Mixins(SaveOnLeave) {
  public selectedXaasOptions: string[] = [];
  public cloudSupportSelectedOptions: string[] = [];
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

  public introText = `Through JWCC, you have the ability to procure many offerings for
    Anything as a Service (XaaS) and Cloud Support Packages. Specify
    any categories that may apply to your acquisition below, and we'll
    walk through each selection to get more details next.`;

  public radioOptions: RadioButton[] = [
    {
      id: "YesArchitecture",
      value: "YES",
      label: "Yes.",
    },
    {
      id: "NoArchitecture",
      value: "NO",
      label: "No.",
    },
  ];

  public currEnvDTO = defaultCurrentEnvironment;

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    };
  };

  public async loadOnEnter(): Promise<void> {
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

      console.log(checkboxItem)

      const cloudServiceCategories = [
        "portability",
        "advisory", 
        "helpdesk",
        "training",
        "documentation",
        "general_support", 
        this.cloudNoneValue.toLowerCase()
      ];
      if (!cloudServiceCategories.includes(checkboxItem.value.toLowerCase())) {
        this.xaasCheckboxItems.push(checkboxItem);
      } else {
        this.cloudSupportCheckboxItems.push(checkboxItem);
      };

      DescriptionOfWork.selectedServiceOfferingGroups.forEach((groupId) => {
        if (cloudServiceCategories.indexOf(groupId.toLowerCase()) === -1) {
          this.selectedXaasOptions.push(groupId)
        } else {
          this.cloudSupportSelectedOptions.push(groupId);
        }
      })
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

    const storeData = await AcquisitionPackage.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = _.cloneDeep(storeData);
    }

    const replicateOrOptimize = 
      this.currEnvDTO.current_environment_replicated_optimized || "";
      
    const replicateOrOptimizeGerund = replicateOrOptimize === "YES_OPTIMIZE"
      ? "optimizing" : replicateOrOptimize === "YES_REPLICATE" ? "replicating" : ""

    if (replicateOrOptimize) {
      this.introText = `In addition to ${replicateOrOptimizeGerund} your current environment, 
        you can procure other JWCC offerings for Anything as a Service (XaaS) 
        and Cloud Support Packages. Specify any categories that may apply to your 
        acquisition below, and we'll walk through each selection to get more details.`;
    }

  }

  public async mounted(): Promise<void> {
    this.goToSummary = DescriptionOfWork.DOWObject.length > 0;
    if (this.goToSummary) {
      DescriptionOfWork.setBackToContractDetails(true);
      this.$router.push({
        name: routeNames.DOWSummary,
      }).catch(() => console.log("error navigating to DOW Summary"));
    }    
    await this.loadOnEnter();
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PerfReqLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);


  };

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (!this.goToSummary) {
        // save to store
        const selectedOfferingGroups
          = this.selectedXaasOptions.concat(this.cloudSupportSelectedOptions);

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
