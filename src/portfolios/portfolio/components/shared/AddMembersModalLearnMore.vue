<template>
  <div>
    <PortfolioRolesLearnMoreText />
    <ATATAlert 
      id="ModalRolesLearnMore"
      type="info"
      class="mt-5 mb-10"
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

import { Component, Vue, toNative } from "vue-facing-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import PortfolioRolesLearnMoreText from "./PortfolioRolesLearnMoreText.vue"

@Component({
  components: {
    ATATAlert,
    PortfolioRolesLearnMoreText,
  }
})

class AddMembersModalLearnMore extends Vue {}
export default toNative(AddMembersModalLearnMore)
</script>
