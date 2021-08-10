<template>
  <div class="cloud-service-provider">
    <div class="d-flex flex-column">
      <div>
        <h3 class="h3 mb-2 font-weight-bold text--base-darkest">
          Cloud Service Provider
        </h3>
        <p class="body-lg description">
          Select the Cloud Service Provider where you want to deploy this
          Portfolio. If you have a multi-cloud application with environments
          deployed to different CSPs, you will need to create a Portfolio for
          each CSP.
        </p>
      </div>
      <atat-button-card :items="items" @change="(v) => $emit('change', v)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ButtonCardItem } from "../../../../types/Wizard";

export default Vue.extend({
  data: () => {
    return {
      items: new Array<ButtonCardItem>(
        {
          label: "CSP 1",
          value: "CSP logo or optional text  1.",
          content: "<div class='text--base-darkest body-lg pl-7'>CSP logo or optional text  1.</div>",
        },
        {
          label: "CSP 2",
          value: "CSP logo or optional text 2",
          content: "<div class='text--base-darkest body-lg pl-7'>CSP logo or optional text  2.</div>",
        },
        {
          label: "CSP 3",
          value: "CSP logo or optional text 3",
          content: "<div class='text--base-darkest body-lg pl-7'>CSP logo or optional text  3.</div>",
        }
      ),
    };
  },
});
</script>

<style lang="scss" scoped>
.description {
  max-width: 632px;
}
</style>
