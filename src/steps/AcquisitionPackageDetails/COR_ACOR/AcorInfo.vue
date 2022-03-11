<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <p class="pv-10">Put ACOR header and intro here</p>

        <common :isACOR="true" />

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import Common from "./Common.vue";

@Component({
  components: {
    Common,
  }
})

export default class CorInfo extends Vue {}

</script>
