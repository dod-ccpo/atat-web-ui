<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            What type of {{ requirementName }} do you need?
          </h1>
          <div class="copy-max-width">
            <p id="CheckboxGroupLabel">
              Select all that apply to your contracting effort.
            </p>

            <ATATCheckboxGroup
              id="CheckboxGroup"
              aria-describedby="CheckboxGroupLabel"
              :value.sync="selectedOptions"
              :items="checkboxItems"
              :card="false"
              class="copy-max-width"
              :hasOtherValue="true"
              :otherValue="otherValue"
              :otherValueEntered.sync="otherValueEntered"
              :otherValueRequiredMessage="otherValueRequiredMessage"
              :rules="[
                $validators.required(requiredMessage)
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
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import DescriptionOfWork from "@/store/descriptionOfWork";

import { Checkbox, DOWServiceOffering } from "../../../../types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
  }
})

export default class ServiceOfferings extends Mixins(SaveOnLeave) {
  // requirementName will be pulled from data in future ticket
  public requirementName = "";

  public requiredMessage = `Please select at least one type of offering. If you 
    no longer need ${this.requirementName}, select the “I don’t need 
    these cloud resources” button below.`;

  public otherValueRequiredMessage = "Please enter a title for this requirement."
  public otherValue = "OTHER";
  public otherValueEntered = "";
  public otherSelected = "";

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.otherSelected = newVal.indexOf(this.otherValue) > -1 ? "true" : "false";
  }

  public selectedOptions: string[] = [];
  private checkboxItems: Checkbox[] = [];
  public serviceOfferings: DOWServiceOffering[] = [];

  public async loadOnEnter(): Promise<void> {
    this.requirementName = await DescriptionOfWork.getOfferingGroupName();
    this.serviceOfferings = await DescriptionOfWork.getServiceOfferings();
    if (this.serviceOfferings.length) {
      this.serviceOfferings.forEach((offering) => {
        const checkboxItem: Checkbox = {
          id: getIdText(offering.name),
          label: offering.name,
          value: offering.sys_id,
          description: offering.description,
        }
        this.checkboxItems.push(checkboxItem);
      });
    }

    this.requirementName = await DescriptionOfWork.getOfferingGroupName();

    const noOtherOption = ["Advisory and Assistance", "Training"];
    if (noOtherOption.indexOf(this.requirementName) === -1) {
      this.checkboxItems.push({
        id: "Other",
        label: "Other",
        value: "Other",
      });
    }
    
    const selectedOfferings = DescriptionOfWork.selectedServiceOfferings;
    
    const validSelections = selectedOfferings.reduce<string[]>((accumulator, current)=>{  
      const itemIndex = this.checkboxItems.findIndex(item=>item.label === current);
      const selected = itemIndex >=0 ? [...accumulator, 
        this.checkboxItems[itemIndex].value] : accumulator;
      return selected;
    }, []);

    this.selectedOptions.push(...validSelections);
  } 

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      // save to store
      await DescriptionOfWork.setSelectedOfferings(this.selectedOptions);
      // todo future ticket - save to SNOW
    } catch (error) {
      throw new Error('error saving requirement data');
    }

    return true;
  }


}

</script>
