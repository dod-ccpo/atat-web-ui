<template>
  <div>
    <v-container fluid class="container-max-width">

    </v-container>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import vue from 'vue'
import { Component, Mixins, Watch } from "vue-property-decorator";
import { ClassificationLevelDTO } from "@/api/models";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges } from "@/helpers";
import classificationRequirements from "@/store/classificationRequirements";

@Component({
  components: {
  }
})

export default class GatherRequirements extends Mixins(SaveOnLeave) {



  public get currentData(): ClassificationLevelDTO[] {
    return this.saveSelected()
  }


  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        //todo: save changes
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  public async loadOnEnter(): Promise<void> {
    //todo: fill out
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>

