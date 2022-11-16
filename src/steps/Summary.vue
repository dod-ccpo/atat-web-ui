<template>
  <div>Summary</div>
</template>

<script lang="ts">
import SaveOnLeave from "@/mixins/saveOnLeave";
import {Component, Mixins} from "vue-property-decorator";
@Component({
})
export default class Summary extends Mixins(SaveOnLeave) {

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
  
}
</script>