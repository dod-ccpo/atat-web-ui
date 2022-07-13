<template>
  <div class="pa-5">
    <ATATPageHead headline="JWCC Dashboard" />
    <div id="app-content" class="d-flex flex-column">
      <div class="mb-auto" style="margin-top: 100px; padding-bottom: 200px;">
        Content...
      </div>
      <ATATFooter/>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATFooter from "../components/ATATFooter.vue";
import ATATPageHead from "../components/ATATPageHead.vue";

@Component({
  components: {
    ATATFooter,
    ATATPageHead
  }
})

export default class JWCCDashboard extends Vue {}

</script>
