<template>
  <div>
    <PageHead></PageHead>
    <div id="FormDiv">
      <v-form id="reviewForm">
        <h2>Part I. Requirements Owner Information</h2>
      </v-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import PageHead from "./components/DocReviewHead.vue"
import { Component } from "vue-property-decorator";

@Component({
  components: {
    PageHead
  },
})
export default class DocumentReviewForm extends Vue {}
</script>
