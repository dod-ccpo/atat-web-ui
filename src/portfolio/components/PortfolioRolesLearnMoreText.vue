<template>
  <div>
    <p class="mb-4">
      There are two levels of permissions for an ATAT portfolio: <strong>Manager</strong>
      and <strong>Viewer.</strong> The user who creates a portfolio is automatically 
      set as a manager. Anyone can be invited to a portfolio, but individuals must 
      be able to authenticate with a CAC to access ATAT.
    </p>
    <ul>
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
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class PortfolioRolesLearnMoreText extends Vue {}
</script>
