
<template>
  <div>
    <CSPCard
      :cloudServiceProvider="portfolioCSP"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import CSPCard from "@/portfolio/components/CSPCard.vue";
import { Portfolio } from "../../types/Global";
@Component({
  components: {
    CSPCard,
  }
})
export default class CSPPortalAccess extends Vue {
  @Prop({ default: "" }) private portfolioCSP!: string;



}
</script>

