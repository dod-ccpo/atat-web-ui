<template>
  <v-app-bar id="PageHeader" app flat class="_atat-page-header">
    <div class="d-flex justify-space-between width-100">
      <div id="PackageNameHeader" class="h3">{{ headline }}</div>
      <div class="d-flex justify-end">
        <v-btn icon class="mr-5 icon-24" id="Person_Button">
          <v-icon class="text-base-dark">person_add_alt_1</v-icon>
        </v-btn>
        <v-btn icon class="icon-24" id="More_Button">
          <v-icon class="text-base-dark">more_horiz</v-icon>
        </v-btn>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ATATPageHead extends Vue {
  @Prop({ default: "Headline" }) private headline!: string;
}
</script>
