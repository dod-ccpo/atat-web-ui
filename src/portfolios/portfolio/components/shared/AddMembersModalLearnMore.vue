<template>
  <div>
    <PortfolioRolesLearnMoreText />
    <ATATAlert 
      id="ModalRolesLearnMore"
      type="info"
      class="mt-5"
    >
      <template v-slot:content>
        <p class="mb-0">
          Portfolio members will only have access to this portfolio within ATAT. 
          If someone needs to access the cloud console, a portfolio manager will need 
          to add a new CSP administrator within the “CSP portal settings” section.
        </p>
      </template>
    </ATATAlert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import PortfolioRolesLearnMoreText from "./PortfolioRolesLearnMoreText.vue"

@Component({
  components: {
    ATATAlert,
    PortfolioRolesLearnMoreText,
  }
})

export default class AddMembersModalLearnMore extends Vue {}
</script>
