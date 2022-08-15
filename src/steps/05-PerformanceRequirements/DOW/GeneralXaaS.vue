<template>
  <v-form ref="generalXaaSForm">
    <h1 class="page-header mb-3" tabindex="-1">
      <span v-if="firstTimeHere">
        Let’s gather your requirements for general IaaS, PaaS and SaaS
      </span>
      <span v-else>
        Let’s gather some details for Requirement #{{ _generalXaaSData.instanceNumber }}
      </span>
    </h1>

  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";

export default class GeneralXaaS extends Vue {
  @PropSync("generalXaaSData") public _generalXaaSData!: unknown;

  public firstTimeHere = true;

}

</script>
