<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12 pa-0">
          <div class="copy-max-width">
            <div 
              v-for="(instance, index) in _instances" 
              :key="instance.labelShort"
            >
              <span v-if="avlInstancesLength > 1">
                <hr />
                <h2
                  :id="'RequirementHeading_' + (index + 1)"
                  class="mb-5"
                >
                  {{ index + 1 }}. Tell us about the 
                  {{ instance.labelShort }} instance
                </h2>
              </span>

              <ATATTextArea
                :id="'AnticipatedNeedUsage_' + (index + 1)"
                label="Describe the anticipated need and usage of this requirement"
                class="width-100 mb-10"
                :rows="5"
                :value.sync="instance.anticipatedNeedUsage"
                maxChars="500"
                :rules="[
                  $validators.required('Please provide a description for this requirement.'),
                  $validators.maxLength('500', 'Description is to be 500 characters or less.')
                ]"
              />
              <ATATRadioGroup
                class="copy-max-width mb-10"
                :id="'EntireDuration_' + (index + 1)"
                legend="Is this requirement for the entire duration of your task order?"
                :items="requirementOptions"
                :value.sync="instance.entireDuration"
                :rules="[
                  $validators.required('Please select an option to specify your requirements.')
                ]"
              />
              <div v-if="instance.entireDuration === 'NO'">
                <p :id="'PeriodsLabel_' + (index + 1)" class="_checkbox-group-label">
                  Which base and/or option periods do you need this requirement?
                </p>
                <ATATCheckboxGroup
                  :id="'PeriodsCheckboxes_' + (index + 1)"
                  :aria-describedby="'PeriodsLabel_' + (index + 1)"
                  :value.sync="instance.selectedPeriods"
                  :items="availablePeriodCheckboxItems"
                  :card="false"
                  :disabled="isDisabled"
                  :rules="[
                    $validators.required('Please select at least one base or option period' +
                      ' to specify your requirement’s duration level.')
                  ]"
                  class="copy-max-width"
                />
                <ATATAlert
                  :id="'PeriodRequirementsAlert_' + (index + 1)"
                  v-show="isDisabled === true"
                  type="warning"
                  class="copy-max-width mb-10"
                >
                  <template v-slot:content>
                    <p class="mb-0" :id="'PeriodIntro_' + (index + 1)">
                      Your period of performance details are missing. To select specific base or
                      option periods for this requirement,
                      <router-link
                        :id="'ContractDetailsLink_' + (index + 1)"
                        :to="{name: routeNames.PeriodOfPerformance}"
                      >revisit the Contract Details section
                      </router-link>
                    </p>
                  </template>
                </ATATAlert>
              </div>

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

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import { 
  Checkbox, 
  DOWClassificationInstance,
  RadioButton, 
  stringObj
} from "../../../../types/Global";

import { routeNames } from "../../../router/stepper"
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import { toTitleCase } from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextArea,
    ATATAlert
  }
})

export default class RequirementsForm extends Vue {
  // props
  @PropSync("instances") private _instances!: DOWClassificationInstance[];
  @Prop() private avlInstancesLength!: number;

  private selectedOptions: string[] = [];
  private routeNames = routeNames;
  private isDisabled = true;
  private requirementOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes",
      value: "YES",
    },
    {
      id: "No",
      label: "No",
      value: "NO",
    },
  ];

  private availablePeriodCheckboxItems: Checkbox[] = [];

  private createCheckboxItems(periods: PeriodDTO[]) {
    // ensure sort order is correct
    periods.sort((a, b) => a.option_order > b.option_order ? 1 : -1);
    
    const arr: Checkbox[] = [];
    periods.forEach((period, idx) => {
      const label = idx === 0 ? "Base period" : `Option period ${idx}`;
      const id = idx === 0 ? "BASE" : `OPTION${idx}`;
      const option: Checkbox = {
        id,
        label,
        value: period.sys_id || "",
      }
      arr.push(option)
    })
    return arr
  };

  public async loadOnEnter(): Promise<void> {
    const periods = await Periods.loadPeriods();
    if (periods && periods.length > 0) {
      this.isDisabled = false;
      this.availablePeriodCheckboxItems = this.createCheckboxItems(periods);
      this.selectedOptions.push(this.availablePeriodCheckboxItems[0].value);
    } else {
      this.availablePeriodCheckboxItems = [
        {
          id: "BaseDisabled",
          label: "Base period",
          value: "",
        }
      ]
    }
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  };

}
</script>

