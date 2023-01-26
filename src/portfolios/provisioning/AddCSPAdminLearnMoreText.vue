<template>
  <div>
    <p> 
      Administrators are granted the highest level of access to your resources within 
      the cloud provider’s console. This role is designed for people responsible for 
      managing user accounts and permissions, configuring workspace settings, and 
      administering applications and environments.
    </p>
    <p>
      As a portfolio manager, you have the ability to add administrators within ATAT 
      to ensure that your development team can access their cloud resources. 
    </p>
    <p>
      Upon starting the provisioning process, ATAT will send your administrator’s 
      information to the CSP to create a new user account or connect an existing 
      account to your portfolio’s resources. This process could take up to 2 hours.
    </p>
    <p>
      Once processed, your administrator will receive an email from the CSP with 
      login credentials. 
    </p>
    <p>
      <strong>Portfolio managers will not be able to cancel this process or revoke access 
      from within ATAT.</strong> CSP accounts can only be changed or revoked by another 
      administrator directly within the cloud console. 
    </p>
    <p>
      Please note that ATAT is not a system of record. We keep a log of the 
      administrators granted CSP access within the system, but any changes to
      user accounts made directly in the cloud portal are not reflected within 
      your ATAT portfolio details.
    </p>
 </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class CSPAdminLearnMoreText extends Vue {}
</script>

