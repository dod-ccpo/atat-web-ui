<template>
  <div>
    <h1 class="page-header mb-3">Let’s start by gathering your Compute requirements</h1>
    <p>
      In this section, we’ll collect details about each compute instance that you 
      need. If you need multiple, we’ll walk through them one at a time. You 
      previously specified <strong>XXXXXXXX</strong> as the classification level 
      for all requirements. If you need any instances within a different level, 
      <a 
        role="button" 
        id="UpdateClassification"
        tabindex="0"
        @click="openModal"
        @keydown.enter="openModal"
        @keydown.space="openModal"
      >update your Classification Requirements</a>.

    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

export default class ComputeForm extends Vue {

}

</script>