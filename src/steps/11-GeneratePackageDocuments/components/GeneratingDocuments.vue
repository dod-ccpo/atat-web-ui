<template>
  <v-row>
    <v-col class="col-12" :align="'center'">
      <v-img 
        eager 
        max-width="550" 
        max-height="550" 
        src="@/assets/images/scanAnimation.gif"
      ></v-img>
    </v-col>
    <v-col class="col-12" :align="'center'">
      <div class="copy-max-width">
        <h1 class="text-center">
          Generating your acquisition package documents<span class="ellipsis"></span>
        </h1>
        <br />
        <p class="text-center">
          Hold tight while we generate your required documents and package
          your files for download. <br /> This process could take about 5 minutes.
        </p>
      </div>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, PropSync } from "vue-property-decorator";
import Vue from "vue";

@Component({})
export default class GeneratingDocuments extends Vue {
  @PropSync(
    "isGenerating",{default: true}
  ) private _isGenerating!: boolean;

}
</script>