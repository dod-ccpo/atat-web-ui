
<template>
  <div>
    <ATATFileUpload id="FundingPlan"/>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATFileUpload from "../../components/ATATFileUpload.vue";

@Component({
  components: {
    ATATFileUpload
  },
})
export default class FundingPlan extends Vue {
}
</script>

