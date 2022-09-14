<template>
  <v-card class="_cspCard">
    <div class="d-flex pa-8">
      <div class="pr-6">
        <ATATSVGIcon
          name="azure"
          width="80"
          height="62"
          color="azure-blue"
        />
      </div>
      <div>
        <h3>Accessing your {{cloudServiceProvider}}</h3>
      </div>

    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
@Component({
  components: {
    ATATSVGIcon,
  }
})
export default class CSPCard extends Vue {
  @Prop() private cloudServiceProvider!: string;

  // public getTitle(): string{
  //
  // }




}
</script>
