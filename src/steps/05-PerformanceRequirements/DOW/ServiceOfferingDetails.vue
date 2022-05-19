<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Next, we’ll gather your requirements for {{ categoryName }}
          </h1>
          <div class="copy-max-width">
            <div v-if="selectedClassificationsOnLoad.length === 1">
              <p id="SingleClassificationIntro">
                In the previous section, you specified [Unclassified/IL2] for the 
                classification level of all cloud resources and services. If you 
                need this within a different level, 
                <a role="button" id="UpdateClassification">
                  update your Classification Requirements
                </a>.
              </p>
            </div>

            <ATATTextArea
              id="OfferingDescription"
              label="What is the scope of your requirement?"
              class="width-100"
              :rows="7"
              :rules="[
                $validators.required(
                  'Please describe the scope of your requirement'
                ),
                $validators.maxLength(
                  300,
                  'Please limit your description to 300 characters or less'
                ),
              ]"
              helpText="Briefly describe the type of resources and services to be
              acquired, and what is necessary to achieve mission specific
              outcomes for this particular requirement (e.g., move DITCO’s contract
              writing system to a cloud environment)."
              :value.sync="projectScope"
              maxChars="300"
            />


          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "../../components/ATATRadioGroup.vue";
import ATATTextArea from "../../components/ATATTextArea.vue";

import { RadioButton, Checkbox } from "../../../../types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
    ATATTextArea,
  }
})

export default class ServiceOfferingDetails extends Vue {

  public instances = [
    {
      classification: {
        name: "Unclassified / Impact Level 2 (IL2)",
        value: "IL2",
      },
      description: "",
      neededForEntireDuration: null,
      periods: []

    }
  ]

  // create classification level type when get data from backend implemented
  public selectedClassificationLevelsOnLoad = [{}];
  public selectedClassificationLevels = [{}];
  public classificationLevels = [{}];

  // get periods from data when implemented
  public periods = [{}];

  private getIdText(string: string) {
    return getIdText(string);
  }

  public mounted(): void {
    // get this from store data when implemented 
    this.selectedClassificationLevels = [
      {
        name: "Unclassified / Impact Level 2 (IL2)",
        value: "IL2",
      },
      {
        name: "Unclassified / Impact Level 4 (IL4)",
        value: "IL4",
      },
    ];

    // get this from store data when implemented 
    this.classificationLevels = [
      {
        name: "Unclassified / Impact Level 2 (IL2)",
        value: "IL2",
      },
      {
        name: "Unclassified / Impact Level 4 (IL4)",
        value: "IL4",
      },
      {
        name: "Unclassified / Impact Level 5 (IL5)",
        value: "IL5",
      },
      {
        name: "Secret / Impact Level 2 (IL6)",
        value: "IL6",
      },
    ];    

    this.selectedClassificationLevelsOnLoad = this.selectedClassificationLevels;
    
    this.periods = [
      {
        id: "Base",
        label: "Base Period",
        value: "", // sys_id ?

      }
    ]
  }


}

</script>
