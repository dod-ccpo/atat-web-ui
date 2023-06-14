<template>
  <div>
    <div class="d-flex justify-space-around 
      py-10 border1 border-base-lighter width-100 text-center"
    >
      <div class="d-flex align-center" style="margin: 0 auto">
        <v-progress-circular indeterminate color="#544496" size="24" width="3" class="mr-2" />
        <span class="h3">{{ loadingText }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ATATLoader extends Vue {
  @Prop() private loadingText!: string;
}
</script>