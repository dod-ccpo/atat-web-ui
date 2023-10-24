<template>
  <div>Summary</div>
</template>

<script lang="ts">
import LoadOnEnter from "@/mixins/loadOnEnter";
import {Component, Mixins, toNative, Vue} from "vue-facing-decorator";
@Component({
})
class Summary extends Mixins(LoadOnEnter) {

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