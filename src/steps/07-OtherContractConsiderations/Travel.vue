<template>
  <div>Travel</div>
</template>
<script lang="ts">
import SaveOnLeave from "@/mixins/saveOnLeave";
import {Component, Mixins} from "vue-property-decorator";
@Component({
})
export default class Travel extends Mixins(SaveOnLeave){

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