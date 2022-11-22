<template>
  <v-form ref="form" lazy-validation>
    <div>
      Future Cross Domain page
    </div>
  </v-form>
</template>
<script lang="ts">
import LoadOnEnter from "@/mixins/loadOnEnter";
import SaveOnLeave from "@/mixins/saveOnLeave";

import { Component, Mixins } from "vue-property-decorator";
@Component({
})
export default class CrossDomain extends Mixins(LoadOnEnter, SaveOnLeave) {
  protected async loadOnEnter(): Promise<boolean> {
    return true;
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
}
</script>

