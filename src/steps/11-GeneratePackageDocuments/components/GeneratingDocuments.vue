<template>
  <div>
    <v-row>
      <v-col col-12 :align="'center'">
        <v-img 
          eager 
          max-width="550" 
          max-height="550" 
          src="img/scanAnimation.gif"
        ></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col col-12 :align="'center'">
        <div class="copy-max-width">
          <h1 class="text-center">
            Generating your acquisition package documents<span class="_ellipsis"></span>
          </h1>
          <br />
          <p class="text-center">
            Hold tight while we generate your required documents and package
            your files for download. <br /> This process could take about 5 minutes.
          </p>
        </div>
      </v-col>
    </v-row>
</div>
</template>
<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from '@/decorators/custom';

@Component({})
class GeneratingDocuments extends Vue {
  @PropSync(
    "isGenerating",{default: true}
  ) private _isGenerating!: boolean;

}

export default toNative(GeneratingDocuments)
</script>