<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Do you currently have funding for your acquisition package?
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
           
          </p>
        </div>
       
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";


import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({})
export default class CurrentlyHasFunding extends Mixins(SaveOnLeave) {
  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
}
</script>
