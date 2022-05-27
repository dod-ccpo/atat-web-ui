<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12 pa-0">
          <div class="copy-max-width">
            <div 
              v-for="(instance, index) in _instances" 
              :key="instance.classificationLevels.shortLabel"
            >
              <p v-if="avlInstancesLength > 1" id="RequirementHeading">
                <span>{{index + 1}}.</span>
                Tell us about the 
                <strong>{{instance.classificationLevels.shortLabel}}</strong> instance
              </p>

              <ATATTextArea
                id="AnticipatedNeedUsage"
                label="Describe the anticipated need and usage of this requirement"
                class="width-100"
                :rows="5"
                :value.sync="instance.anticipatedNeedUsage"
                maxChars="500"
              />
              <ATATRadioGroup
                class="copy-max-width mb-10"
                id="EntireDuration"
                legend="Is this requirement for the entire duration of your task order?"
                :items="requirementOptions"
                :value.sync="instance.entireDuration"
              />
              <div v-if="instance.entireDuration === 'NO'">
                <p id="CloudSupportLabel" class="_checkbox-group-label">
                  Which base and/or option periods do you need this requirement?
                </p>
                <ATATCheckboxGroup
                  id="CloudSupportCheckboxes"
                  aria-describedby="CloudSupportLabel"
                  :value.sync="instance.selectedPeriods"
                  :items="availablePeriodCheckboxItems"
                  :card="false"
                  class="copy-max-width"
                />
              </div>

              <hr />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import { 
  Checkbox, 
  RadioButton, 
  DOWClassificationInstance 
} from "../../../../types/Global";


@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextArea,
  }
})

export default class RequirementsForm extends Vue {
  // props
  @PropSync("instances") private _instances!: DOWClassificationInstance[];
  @Prop() private avlInstancesLength!: number;

  private requirementOptions: RadioButton[] = [
    {
      id: "Yes",
      label: `Yes`,
      value: "YES",
    },
    {
      id: "No",
      label: `No`,
      value: "NO",
    },
  ];

  private availablePeriodCheckboxItems: Checkbox[] = [
    {
      id: "BasePeriod",
      label: "Base period",
      value: "BasePeriod",
    },
    {
      id: "OptionPeriod1",
      label: "Option Period 1",
      value: "OptionPeriod1",
    },
    {
      id: "OptionPeriod2",
      label: "Option Period 2",
      value: "OptionPeriod2",
    },
    {
      id: "OptionPeriod3",
      label: "Option Period 3",
      value: "OptionPeriod3",
    },
    {
      id: "OptionPeriod4",
      label: "Option Period 4",
      value: "OptionPeriod4",
    },
  ];

}
</script>

