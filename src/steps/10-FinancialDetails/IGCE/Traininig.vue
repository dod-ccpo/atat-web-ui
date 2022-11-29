<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Future Training Page
          </h1>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({})
export default class IGCETraining extends Mixins(SaveOnLeave) {

  protected async loadOnEnter(): Promise<boolean> {
    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }

}
</script>