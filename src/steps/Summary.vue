<template>
  <div>Summary</div>
</template>

<script lang="ts">
import SaveOnLeave from "@/mixins/loadOnEnter";
import Steps from "@/store/steps";
import {Component, Mixins} from "vue-property-decorator";
@Component({
})
export default class Summary extends Mixins(SaveOnLeave) {

  protected async loadOnEnter(): Promise<boolean> {
    return true;
  }

  public mounted(): void {
    Steps.setStepComplete(Steps.currentStep?.stepName as string);
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
  
}
</script>