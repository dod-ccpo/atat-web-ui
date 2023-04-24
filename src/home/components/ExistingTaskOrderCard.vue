<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-5">
      Already have an existing JWCC task order?
    </h2>
    <p class="mb-8">
      We’ll gather details about your task order to start provisioning your cloud resources.
    </p>

    <TaskOrderSearch
      :TONumber.sync="TONumber"
      @startProvisionWorkflow="startProvisionWorkflow"
    />
  
  </v-card>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import TaskOrderSearch from "@/portfolios/components/TaskOrderSearch.vue";

@Component({
  components: {
    TaskOrderSearch,
  }
})

export default class ExistingTaskOrderCard extends Vue {
  public TONumber = "";
  public async startProvisionWorkflow(): Promise<void> {
    this.$emit("startProvisionWorkflow");
  }
}

</script>
