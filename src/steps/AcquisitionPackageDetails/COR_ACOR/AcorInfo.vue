<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <common :isACOR="isACOR" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import {Component} from "vue-property-decorator";
import Common from "./Common.vue";

@Component({
  components: {
    Common,
  }
})

export default class CorInfo extends Vue {
  private isACOR = true;
}

</script>
