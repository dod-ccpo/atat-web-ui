<template>
  <div class="_panel-padding">
    <h2 class="mb-5">Understanding funding requests</h2>
    <p>
      We encourage your agency to use
      <a
        class="_text-link"
        :href="$sanitize(gInvoiceHref)"
        target="_blank"
        rel="noopener"
      >
        <span class="_external-link">
         Government Invoicing (G-Invoicing)
        </span>
      </a>
      to create and manage all Buy/Sell intragovernmental transactions (IGT). This financial
      management system will replace the various manual forms used today like the Fiscal
      Service (FS) Form 7600A/B, Military Interdepartmental Purchase Request (MIPR), etc.
    </p>
    <ATATAlert id="FundingRequestLearnMore" type="info">
      <template v-slot:content>
        <p class="font-size-16 font-weight-700 mb-2">
          All JWCC requirements packages must have a General Terms & Conditions (GT&C) agreement.
        </p>
        <p class="mb-0">
          You will also need to provide either an FS Form 7600B/Order or a Military
          Interdepartmental Purchase Request (MIPR).
        </p>
      </template>
    </ATATAlert>
    <hr class="my-5"/>

    <h3 class="mb-4">Order Requirements and Funding Information (Order)</h3>
    <p>
      The Order section of an interagency agreement within G-Invoicing replaces the FS Form 7600B.
      It identifies the specific Requesting Agency requirements for the expected delivery of
      products and/or services by the Servicing Agency. A fiscal obligation is created when all
      required points of contact sign to authorize the Order.
    </p>
    <p>
      A GT&C agreement may contain one or more Orders.
    </p>
    <hr class="my-5"/>

    <h3 class="mb-4">Military Interdepartmental Purchase Request (MIPR)</h3>
    <p>
      In lieu of a G-Invoicing Order, your agency may use a MIPR to transfer funds from one
      military organization to another to procure services, supplies, or equipment for the
      requiring service. A MIPR is processed on DD Form 448 and may be accepted on a direct
      citation or reimbursable basis and is defined in the
      <a
        class="_text-link"
        :href="$sanitize(federalAcqHref)"
        target="_blank"
        id="FARLink"
        rel="noopener"
      >
        Defense Federal Acquisition Regulation Supplement– Procedures, Guidance, and Instructions
        (DFARS PGI) <span class="_external-link">253.208-1</span>
      </a>.
    </p>
    <p>
      Please note that your agency will need to establish a GT&C agreement in G-Invoicing,
      even if you are using a MIPR.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert
  }
})

class FundingRequestLearnMore extends Vue {
  private gInvoiceHref = `https://fiscal.treasury.gov/g-invoice/`
  private federalAcqHref =
    `https://www.acquisition.gov/dfarspgi/pgi-253.208-required-sources-supplies-and-services.`
}

export default FundingRequestLearnMore
</script>
