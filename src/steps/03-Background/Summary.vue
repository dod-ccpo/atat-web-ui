
<template>
  <div>
    Future Background Summary page
  </div>
</template>
<script lang="ts">
import LoadOnEnter from "@/mixins/loadOnEnter";
import {Component, Mixins} from "vue-property-decorator";
@Component({
})
export default class Summary extends Mixins(LoadOnEnter) {

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

