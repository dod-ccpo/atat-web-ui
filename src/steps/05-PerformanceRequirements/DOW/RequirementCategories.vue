
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
              groupLabel="What type of XaaS resources, tools and services do you need?"
              groupLabelId="XaaSLabel"
              :noneValue="this.xaaSNoneValue"
            />

            <hr />

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
              groupLabel="What type(s) of cloud support packages do you need?"
              groupLabelId="CloudSupportLabel"
              :noneValue="this.cloudNoneValue"
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
  public xaaSNoneValue = "XaaS_NONE";
  public cloudNoneValue = "Cloud_NONE";

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
      if (!cloudServiceCategories.includes(checkboxItem.value.toLowerCase())) {
        if (checkboxItem.value.toLowerCase() === "general_xaas") {
          checkboxItem.description = `Including third party marketplace and any 
            other XaaS resources not covered in the categories above`;
        }
        this.xaasCheckboxItems.push(checkboxItem);
      } else {
        this.cloudSupportCheckboxItems.push(checkboxItem);
      }

      const selectedOfferingGroups = DescriptionOfWork.selectedServiceOfferingGroups;
      const validSelections = selectedOfferingGroups.reduce<string[]>((accumulator, current)=>{
        const itemIndex = this.xaasCheckboxItems.findIndex(item=>item.value === current);
        return itemIndex >=0 ? [...accumulator, 
          this.xaasCheckboxItems[itemIndex].value] : accumulator;
      },[]);
      this.selectedXaasOptions.push(...validSelections);


    });
    
    const xaasNone: Checkbox = {
      id: "XaaSNoneApply",
      label: "None of these apply to my acquisition.",
      value: this.xaaSNoneValue, 
    }
    this.xaasCheckboxItems.push(xaasNone)

    const cloudSupportNone: Checkbox = {
      id: "CloudSupportNoneApply",
      label: "None of these apply to my acquisition.",
      value: this.cloudNoneValue, 
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
      const selectedOfferingGroups
        = this.selectedXaasOptions.concat(this.cloudSupportSelectedOptions);

      await DescriptionOfWork.setSelectedOfferingGroups(selectedOfferingGroups);
      // todo future ticket - save to SNOW
    } catch (error) {
      throw new Error('error saving requirement data');
    }

    return true;
  }

}
</script>

