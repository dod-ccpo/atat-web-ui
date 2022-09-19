
<template>
  <div>
    <div>
      <CSPCard
        :cloudServiceProvider="portfolioCSP"
      />
    </div>
    <div>
      <div class="d-flex justify-space-between mt-11">
        <h2>CSP administrator log</h2>
        <v-btn
          depressed
          color="primary"
        >
          <ATATSVGIcon
            class="mr-2"
            width="17"
            height="14"
            name="manageAccount"
            color="white"
          />
          Add a CSP Administrator
        </v-btn>
      </div>

      <div>
        <v-data-table>

        </v-data-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import CSPCard from "@/portfolio/components/CSPCard.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
@Component({
  components: {
    ATATSVGIcon,
    CSPCard,
  }
})
export default class CSPPortalAccess extends Vue {
  @Prop({ default: "" }) private portfolioCSP!: string;



}
</script>

