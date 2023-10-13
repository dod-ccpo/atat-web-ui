<template>
  <v-form ref="form">
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins} from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";

export default class UnitTestingMockComponent extends Mixins(SaveOnLeave) {
  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
}
</script>