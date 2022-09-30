<template>
  <div>
    <div class="pt-5">
      <h2 class="pb-3">All task orders</h2>
      <div class="d-flex justify-space-between ">
        <p class="mr-10">View details about the task orders associated with your portfolio below.
          You can request to modify an active task order to exercise an option or to change CLIN
          funding and period of performance details. You can also add a new task order to continue
          funding your cloud resources and support for this portfolio.
        </p>
        <v-btn
         outlined
         class="ml-10 secondary"
        >
          Add a new task order
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
@Component({
})
export default class TaskOrder extends Vue {
}
</script>

