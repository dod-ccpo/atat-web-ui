<template>
  <v-card>
    <div class="d-flex align-center">
      <div>
        {{index}}
      </div>
      <div>
        <v-text-field
          id="HeaderTextField"
          dense
          placeholder="Compute"
          class=" _headerTextField my-1 "
          hide-details
          autocomplete="off"
          v-model="_title"
          @blur="saveTitle()"
        >
        </v-text-field>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
@Component({
})
export default class CardRequirement extends Vue {

}
</script>

