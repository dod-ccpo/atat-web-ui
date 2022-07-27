<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3">
            Your Compute Requirements
          </h1>
          <p>
            If you need more instances, add them below. You can also edit or delete 
            any info from the instances that you have already entered. When you’re 
            done, click Continue and we will move on to your 
            [selected category] requirements.
            <!-- EJY what if only selecting Compute? -->
          </p>

          <v-data-table
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="5"
            class="elevation-1"
            :hide-default-footer="true"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
              mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn
                color="primary"
                @click="initialize"
              >
                Reset
              </v-btn>
            </template>

          </v-data-table>          
        </v-col>
      </v-row>
    </v-container>


    
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import DescriptionOfWork from "@/store/descriptionOfWork";

import { ComputeData } from "../../../../types/Global";


@Component({})

export default class ComputeRequirements extends Vue {
  public computeInstances: ComputeData[] = [];


  public tableHeaders = [
    {
      text: '#',
      align: 'start',
      value: 'instanceNumber',
    },
    { text: 'Location', value: 'location' },
    { text: 'Quantity', value: 'qty' },
    { text: 'vCPU', value: 'vCPU' },
    { text: 'Memory', value: 'memory' },
    { text: 'Storage', value: 'storage' },
    { text: 'Performance', value: 'performance' },
    { text: 'e x', value: 'actions' },
    // { text: 'Actions', value: 'actions', sortable: false },

  ];
  public tableData = [
    {
      instanceNumber: '1',
      location: "CONUS East, CONUS West",
      qty: 1,
      vCPU: 2,
      memory: 3,
      storage: 4,
      performance: "Medium performance (Standard)",
      actions: ""
    },

  ];



  public async loadOnEnter(): Promise<void> {
    this.computeInstances = await DescriptionOfWork.getComputeInstances();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  };

}

</script>
