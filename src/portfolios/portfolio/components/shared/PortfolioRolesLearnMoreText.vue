<template>
  <div>
    <p class="mb-4">
      There are two levels of permissions for an ATAT portfolio: <strong>Manager</strong>
      and <strong>Viewer.</strong> The user who creates a portfolio is automatically 
      set as a manager.
    </p>
    <ul class="_atat-ul">
      <li class="mb-2">
        <strong>Manager:</strong> In addition to viewing a portfolio’s reporting 
        data within the Funding Tracker, managers can edit all portfolio details. 
        This includes modifying task orders, adding new task orders, adding 
        administrator access to the CSP console, as well as managing team member 
        access to the portfolio within ATAT. 
      </li>
      <li>
        <strong>Viewer:</strong> Viewers can access reporting data within the 
        Funding Tracker and task order details. They cannot edit any information 
        or invite others to the portfolio.
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component,  Vue, toNative } from "vue-facing-decorator";

@Component({})

class PortfolioRolesLearnMoreText extends Vue {}
export default toNative(PortfolioRolesLearnMoreText)
</script>
