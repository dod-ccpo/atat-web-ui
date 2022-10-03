<template>
  <div class="pa-5">
    <ATATRadioGroup 
      id="PortfolioRole"
      name="PortfolioRole"
      legend="Role"
      :items="portfolioRoles"
      :value.sync="selectedPortfolioRole"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";

@Component({
  components: {
    ATATRadioGroup,
  }
})

export default class FilterSlideout extends Vue {
  public selectedPortfolioRole = "all";
  public portfolioRoles: RadioButton[] = [
    {
      label: "All of my portfolios",
      value: "all",
      id: "All",
    },
    {
      label: "Managed by me",
      value: "managed",
      id: "Managed"
    },
  ]

}

</script>
