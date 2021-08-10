<template>
<v-radio-group row @change="v=> $emit('change', v)">
    <RadioCard class="radio-cards mr-2"
      v-for="(item, index) in items"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </v-radio-group>
</template>

<script lang="ts">
import Vue from "vue";
import RadioCardItem from "./RadioCardItem";
import RadioCard from "./RadioCard.vue";

export default Vue.extend({
  components: {
    RadioCard,
  },

  props: {
    items: {
      type: Array,
      default: () => Array<RadioCardItem>(),
    },
  }
});
</script>

<style lang="scss">
.radio-cards {

    // height: 100%;
}
</style>