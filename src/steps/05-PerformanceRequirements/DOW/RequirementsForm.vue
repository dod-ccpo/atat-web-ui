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
              
              <AnticipatedDurationandUsage
                type="requirement"
                :anticipatedNeedUsage.sync="instance.anticipatedNeedUsage"
                :entireDuration.sync="instance.entireDuration"
                :selectedPeriods.sync="instance.selectedPeriods"
                :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
                :isPeriodsDataMissing="isPeriodsDataMissing"
                index="0"
              />
             
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
import ATATTextField from "@/components/ATATTextField.vue";
import AnticipatedDurationandUsage from "@/components/DOW/AnticipatedDurationandUsage.vue";

import { 
  Checkbox, 
  DOWClassificationInstance,
} from "../../../../types/Global";

import { routeNames } from "../../../router/stepper"
import { createPeriodCheckboxItems } from "@/helpers";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextArea,
    ATATTextField,
    AnticipatedDurationandUsage
  }
})

export default class RequirementsForm extends Vue {
  // props
  @PropSync("instances") private _instances!: DOWClassificationInstance[];
  @Prop() private avlInstancesLength!: number;
  @Prop() public isPeriodsDataMissing!: boolean;

  private selectedOptions: string[] = [];
  private routeNames = routeNames;
  private availablePeriodCheckboxItems: Checkbox[] = [];

  public async loadOnEnter(): Promise<void> {
    this.availablePeriodCheckboxItems = await createPeriodCheckboxItems();
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  };

}
</script>

