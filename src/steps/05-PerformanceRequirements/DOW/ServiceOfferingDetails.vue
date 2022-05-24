<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Next, we’ll gather your requirements for {{ categoryName }}
          </h1>
          <div class="copy-max-width">

            <div 
              v-if="selectedClassificationLevelsOnLoad.length === 1"
              id="SingleClassificationIntro"  
            >
              <p id="SingleClassificationIntro">
                In the previous section, you specified 
                <strong>{{ selectedClassificationLevelsOnLoad[0].name }}</strong> for the 
                classification level of all cloud resources and services. If you 
                need this within a different level, 
                <a 
                  role="button" 
                  id="UpdateClassification"
                  tabindex="0"
                  @click="openModal"
                  @keydown.enter="openModal"
                  @keydown.space="openModal"
                >update your Classification Requirements</a>.
              </p>
            </div>

            <div v-else id="ClassificationCheckboxWrapper">
              <ATATCheckboxGroup
                id="ClassificationCheckboxes"
                aria-describedby="ClassificationGroupLabel"
                :value.sync="selectedClassificationLevels"
                :items="classificationLevels"
                :card="false"
                class="copy-max-width"
                :rules="[
                  $validators.required('Please select at least one option.')
                ]"
                groupLabel="What classification level(s) do you need?"
                groupLabelId="ClassificationGroupLabel"
              />

              <ATATExpandableLink aria-id="AboutClassificationLevels" class="mt-10">
                <template v-slot:header>
                  I need this requirement within a different classification level. What do I do?
                </template>
                <template v-slot:content>
                  <p>
                    The levels listed above are based on the classification requirements 
                    you specified in the previous Contract Details section. If you need 
                    to make changes to these levels, 
                    <a 
                      role="button"
                      id="UpdateClassification"
                      tabindex="0"
                      @click="openModal"
                      @keydown.enter="openModal"
                      @keydown.space="openModal"
                    >update your Classification Requirements</a>.
                  </p>
                </template>
              </ATATExpandableLink>

            </div>

            <div id="OfferingDetailsForms">
              <!-- form component placeholder -->
            </div>

          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"

import { Checkbox } from "../../../../types/Global";

import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATExpandableLink,
  }
})

export default class ServiceOfferingDetails extends Vue {

  public categoryName = "";

  // generate from data from backend when implemented
  public instances = [
    {
      classification: {
        name: "Unclassified / Impact Level 2 (IL2)",
        value: "IL2",
      },
      description: "",
      neededForEntireDuration: null,
      periods: []
    },
    {
      classification: {
        name: "Unclassified / Impact Level 4 (IL4)",
        value: "IL4",
      },
      description: "",
      neededForEntireDuration: null,
      periods: []
    }
  ]

  // create classification level type when get data from backend implemented
  public selectedClassificationLevelsOnLoad = [{}];
  public selectedClassificationLevels = [{}];
  public classificationLevels: Checkbox[] | undefined;

  // get periods from data when implemented
  public periods = [{}];

  private getIdText(string: string) {
    return getIdText(string);
  }

  public mounted(): void {
    // get this from store data when implemented 
    this.categoryName = "Data Management";

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
        id: "IL2",
        label: "Unclassified / Impact Level 2 (IL2)",
        value: "IL2",
      },
      {
        id: "IL4",
        label: "Unclassified / Impact Level 4 (IL4)",
        value: "IL4",
      },
      {
        id: "IL5",
        label: "Unclassified / Impact Level 5 (IL5)",
        value: "IL5",
      },
      {
        id: "IL6",
        label: "Secret / Impact Level 2 (IL6)",
        value: "S",
      },
    ];    

    this.selectedClassificationLevelsOnLoad = this.selectedClassificationLevels;
    
    // get from data from backend when implemented
    this.periods = [
      {
        id: "Base",
        label: "Base period",
        value: "BASE", // sys_id ?
      },
      {
        id: "Opt1",
        label: "Option period 1",
        value: "OPT1", // sys_id ?
      },
      {
        id: "Opt2",
        label: "Option period 2",
        value: "OPT2", // sys_id ?
      },
      {
        id: "Opt3",
        label: "Option period 3",
        value: "OPT3", // sys_id ?
      },
      {
        id: "Opt4",
        label: "Option period 4",
        value: "OPT4", // sys_id ?
      },
    ]
  }

  public openModal(): void {
    // open modal functionality in task 7411
  }

}

</script>
