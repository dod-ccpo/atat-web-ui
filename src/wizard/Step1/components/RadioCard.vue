<template>
  <v-card
    class="
      radio-card
      px-2
      py-2
      d-flex
      flex-column
      rounded-larger
      bg-base-lighter
    "
    elevation="0"
    outlined
    max-width="278px"
    min-height="128px"
    
  >
    <v-radio :value="value">
      <template v-slot:label>
        <div class="body-lg font-weight-bold text--base-darkest text-uppercase">
          {{ label }}
        </div>
      </template>
    </v-radio>
    <v-card-text>
      <v-row>
        <div class="body-lg text--base-darkest pl-7 pr-2">{{ value }}</div>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: () => "",
      required: true,
    },

    value: {
      type: String,
      default: () => "",
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.rounded-larger {
  border-radius: 4px;
}

// creates a white background and black border for unselected state of radio button
::v-deep .v-radio .v-icon {
  color: black;
  border-color: black;
  border-radius: 50%;
  background-color: white;
}
</style>
