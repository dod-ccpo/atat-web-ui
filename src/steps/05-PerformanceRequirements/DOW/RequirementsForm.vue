<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12 pa-0">
          <div class="copy-max-width">
            <div v-for="(instance, index) in data" :key="instance.classification.name">
              <p v-if="instanceLength > 1" id="RequirementHeading">
                <span>{{ index + 1 }}.</span>
                Tell us about the <strong>{{ instance.classification.name }}</strong> instance
              </p>

              <ATATTextArea
                id="OperationToBePerformed"
                label="Describe the anticipated need and usage of this requirement"
                class="width-100"
                :rows="5"
                :value.sync="instance.description"
                maxChars="500"
              />
              <ATATRadioGroup
                class="copy-max-width mb-10"
                id="RequirementRadioOptions"
                legend="Is this requirement for the entire duration of your task order?"
                :items="requirementOptions"
                :value.sync="instance.neededForEntireDuration"
              />
              <div v-if="instance.neededForEntireDuration === 'NO'">
                <p id="CloudSupportLabel" class="_checkbox-group-label">
                  Which base and/or option periods do you need this requirement?
                </p>
                <ATATCheckboxGroup
                  id="CloudSupportCheckboxes"
                  aria-describedby="CloudSupportLabel"
                  :value.sync="selectedOptions"
                  :items="checkboxItems"
                  :card="false"
                  :disabled="isDisabled"
                  class="copy-max-width"
                />
                <ATATAlert
                  id="ClassificationRequirementsAlert"
                  v-show="isDisabled === true"
                  type="warning"
                  class="copy-max-width mb-10"
                >
                  <template v-slot:content>
                    <p class="mb-0" id="SingleClassificationIntro">
                      Your period of performance details are missing. To select specific base or
                      option periods for this requirement,
                      <router-link
                        id="Step4Link"
                        :to="{name: routeNames.PeriodOfPerformance}"
                      >revisit the Contract Details section
                      </router-link>
                    </p>
                  </template>
                </ATATAlert>
              </div>

              <hr/>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { routeNames } from "../../../router/stepper"
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import { Checkbox, RadioButton, stringObj } from "../../../../types/Global";
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import ATATAlert from "@/components/ATATAlert.vue";


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
  @Prop({default: () => []}) private data!: stringObj;
  private selectedOptions: string[] = []
  private routeNames = routeNames
  private isDisabled = true
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
  private checkboxItems: Checkbox[] = [
    {
      id: "BasePeriod",
      label: "Base period",
      value: "BasePeriod",
    },
  ];

  private createCheckboxItems(data: PeriodDTO[]) {
    const arr: Checkbox[] = [];
    data.forEach((val) => {
      let options: Checkbox = {
        id: '',
        value: '',
        label: '',
      }
      options.id = val.sys_id || '';
      switch (val.option_order) {
      case '1':
        options.value = val.period_unit_count + ' ' + val.period_unit;
        options.label = 'Base period'
        break;
      case '2':
        options.value = val.period_unit_count + ' ' + val.period_unit;
        options.label = 'Option period 1'
        break;
      case '3':
        options.value = val.period_unit_count + ' ' + val.period_unit;
        options.label = 'Option period 2'
        break;
      case '4':
        options.value = val.period_unit_count + ' ' + val.period_unit;
        options.label = 'Option period 3'
        break;
      case '5':
        options.value = val.period_unit_count + ' ' + val.period_unit;
        options.label = 'Option period 4'
        break;
      default:
        return
      }
      arr.push(options)
    })
    return arr
  }

  private instanceLength = this.data.length

  public async loadOnEnter(): Promise<void> {
    const periods = await Periods.loadPeriods();
    if (periods && periods.length > 0) {
      this.isDisabled = false
      this.checkboxItems = this.createCheckboxItems(periods)
      this.selectedOptions.push(this.checkboxItems[0].value)
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  }

}
</script>

