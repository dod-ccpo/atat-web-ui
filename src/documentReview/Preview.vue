<template>
  <div>
    <router-link to="/docReviewForm">
      <v-btn class="link-button no-hover mt-3">
        <ATATSVGIcon class="mr-2" name="arrowLeft" width="16" height="16" />
        Return
      </v-btn>
    </router-link>
    Future home of preview form
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { Component } from "vue-property-decorator";
@Component({
  components: {
    ATATSVGIcon,
  },
})
export default class DocumentReviewPreview extends Vue {}
</script>
