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
      <RadioCards :items="items" @change="v=> $emit('change', v)"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RadioCardItem from "./RadioCardItem";
import RadioCards from "./RadioCards.vue";
export default Vue.extend({
  components: {
    RadioCards,
  },

  data: () => {
    return {
      items: new Array<RadioCardItem>(
        new RadioCardItem(
          "CSP 1",
          "CSP logo or optional text  1."
        ),
        new RadioCardItem(
          "CSP 2",
          "CSP logo or optional text 2"
        ),
        new RadioCardItem(
          "CSP 3",
          "CSP logo or optional text 3"
        )
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