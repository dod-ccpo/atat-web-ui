
<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s work on your performance requirements
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Through JWCC, you have the ability to procure many offerings for 
              Anything as a Service (XaaS) and Cloud Support Packages. Specify 
              any categories that may apply to your acquisition below, and we’ll 
              walk through each selection to get more details next. 
              <a 
                role="button" 
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel"
                tabindex="0"
              >
                Learn more about categories.
              </a>
            </p>

            <p id="XaaSLabel" class="_checkbox-group-label">
              What type of XaaS resources, tools and services do you need?
            </p>

            <ATATCheckboxGroup
              id="XaaSCheckboxes"
              aria-describedby="XaaSLabel"
              :value.sync="selectedXaasOptions"
              :items="xaasCheckboxItems"
              :card="false"
              class="copy-max-width"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
            />

            <hr />

            <p id="CloudSupportLabel" class="_checkbox-group-label">
              What type(s) of cloud support packages do you need?
            </p>
            <ATATCheckboxGroup
              id="CloudSupportCheckboxes"
              aria-describedby="CloudSupportLabel"
              :value.sync="cloudSupportSelectedOptions"
              :items="cloudSupportCheckboxItems"
              :card="false"
              class="copy-max-width"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
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
import PerfReqLearnMore from "./PerfReqLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

import { Checkbox, SlideoutPanelContent } from "../../../../types/Global";
import { SystemChoiceDTO } from "@/api/models";

import DescriptionOfWork from "@/store/descriptionOfWork";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
    PerfReqLearnMore,
  }
})

export default class RequirementCategories extends Mixins(SaveOnLeave) {
  public selectedXaasOptions: string[] = [];
  private xaasCheckboxItems: Checkbox[] = [];
  private serviceOfferingGroups: SystemChoiceDTO[] = [];

  public cloudSupportSelectedOptions: string[] = [];
  private cloudSupportCheckboxItems: Checkbox[] = [];

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async loadOnEnter(): Promise<void> {
    this.serviceOfferingGroups = await DescriptionOfWork.getServiceOfferingGroups();
    this.serviceOfferingGroups.forEach((serviceOfferingGroup) => {
      const checkboxItem: Checkbox = {
        id: this.getIdText(serviceOfferingGroup.value),
        label: serviceOfferingGroup.label,
        value: serviceOfferingGroup.value
      };

      const cloudServiceCategories = ["advisory", "training"];
      if (!cloudServiceCategories.includes(checkboxItem.value)) {
        this.xaasCheckboxItems.push(checkboxItem);
      } else {
        this.cloudSupportCheckboxItems.push(checkboxItem);
      }
    });
    
    const xaasNone: Checkbox = {
      id: "XaaSNoneApply",
      label: "None of these apply to my acquisition.",
      value: "XaaS_NONE", 
    }
    this.xaasCheckboxItems.push(xaasNone)

    const cloudSupportNone: Checkbox = {
      id: "CloudSupportNoneApply",
      label: "None of these apply to my acquisition.",
      value: "Cloud_NONE", 
    }
    this.cloudSupportCheckboxItems.push(cloudSupportNone)

  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PerfReqLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      // save to store
      const selectedOfferings = this.selectedXaasOptions.concat(this.cloudSupportSelectedOptions);

      await DescriptionOfWork.setSelectedOfferingGroups(selectedOfferings);
      // todo future ticket - save to SNOW
    } catch (error) {
      throw new Error('error saving requirement data');
    }

    return true;
  }

}
</script>

