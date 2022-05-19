<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Next, we’ll gather your requirements for {{ categoryName }}
          </h1>
          <div class="copy-max-width">
            <div v-if="selectedClassificationLevelsOnLoad.length === 1">
              <p id="SingleClassificationIntro">
                In the previous section, you specified 
                <strong>{{ selectedClassificationLevelsOnLoad[0].name }}</strong> for the 
                classification level of all cloud resources and services. If you 
                need this within a different level, 
                <a role="button" id="UpdateClassification">
                  update your Classification Requirements
                </a>.
              </p>
            </div>
            <div v-else>
              <!-- classification checkboxes -->
            </div>

            <div id="">
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

import { getIdText } from "@/helpers";

@Component({})

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
    this.categoryName = "Data Management";

    // get this from store data when implemented 
    this.selectedClassificationLevels = [
      {
        name: "Unclassified / Impact Level 2 (IL2)",
        value: "IL2",
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


}

</script>
