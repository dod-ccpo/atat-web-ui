<template>
  <div class="_panel-padding">
    <h2 class="mb-5">Accessing your portfolio within a CSP portal</h2>
    <p class="mb-3">
      There are two ways for people to gain access to cloud resources within the CSP portal:
    </p>
    <ol>
      <li class="mb-3">
        A portfolio manager can add administrators within ATAT to grant full access to cloud
        resources.
      </li>
      <li>
        An administrator can add user accounts and assign various levels of permissions directly
        from the cloud console.
      </li>
    </ol>
    <ATATAlert
      id="AccessingCSPAlert"
      type="info"
      class="container-max-width my-5"
    >
      <template v-slot:content>
        <p class="mb-0">
          <span class="font-weight-700">
            NOTE:
          </span>
          ATAT is not a system of record. We keep a log of the administrators granted CSP
          access within the system, but any changes to users accounts made directly in the cloud
          portal are not reflected within your ATAT portfolio details.
        </p>
      </template>
    </ATATAlert>
    <hr class="mt-0 mb-5" />
    <h3 class="mb-5">Understanding the CSP administrator role</h3>
    <p>
      Administrators are granted the highest level of access to cloud resources within the cloud
      provider’s console. This role is designed for people responsible for managing user accounts
      and permissions, configuring workspace settings, and administering applications and
      environments.
    </p>
    <p>
      Once a portfolio manager adds an administrator, ATAT will send the individual’s information
      to the CSP to create a new account or connect an existing account to your portfolio’s
      resources. This process could take a few hours.
    </p>
    <p>
      Once processed, the administrator will receive an email from the CSP with login credentials.
    </p>
    <p>
      Portfolio managers will not be able to cancel this process or revoke access from within ATAT.
      CSP accounts can only be changed or revoked by another administrator directly within the cloud
      console.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert,
  }
})

export default class AccessingCSPLearnMore extends Vue {

}
</script>
