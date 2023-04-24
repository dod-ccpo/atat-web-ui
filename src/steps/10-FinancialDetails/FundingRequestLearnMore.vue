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
        <span class="_external-link">Government Invoicing (G-Invoicing)</span>
      </a>
      to create and manage all
      Buy/Sell intragovernmental (IGT) transactions. This financial management system will replace
      the various manual forms used today like the Fiscal Service (FS) Form 7600A/B, Military
      Interdepartmental Purchase Request (MIPR), etc.
    </p>
    <p>
      If your agency has not migrated their financial system to G-Invoicing yet, then you will still
      be able to upload your completed funding document(s).
    </p>
    <hr class="my-5"/>

    <h3 class="mb-4">Fiscal Service Forms 7600A and 7600B</h3>
    <p>
      The Department of Treasury’s FS Forms 7600A/B serve as the standard forms to be used
      government-wide for all reimbursable agreements at the trading partner level.
    </p>
    <p>
      The 7600A is a
      <strong>General Terms and Conditions (GT&amp;C)</strong>
      agreement that establishes the relationship
      between the trading partners and identifies the agreement action, period, and type. No fiscal
      obligations are created through the execution of the GT&amp;C: therefore, no services may be
      performed and/or no goods may be delivered.
    </p>
    <p>
      The 7600B is the
      <strong>Order Requirements and Funding Information (Order)</strong>
      section of an interagency
      agreement. The Order identifies the specific Requesting Agency requirements for the expected
      delivery of products and/or services by the Servicing Agency. A fiscal obligation is created
      when all required points of contact sign to authorize the Order.
    </p>
    <p>
      A GT&amp;C agreement may contain one or more Orders.
    </p>
    <p>
      If your agency uses G-Invoicing, then you will only need to provide your 7600B Order Number, 
      and we will take care of syncing your IGT info with this acquisition.
    </p>
    <p>
      If you choose to upload, you will need to provide both of these FS forms.
    </p>
    <hr class="my-5"/>

    <h3 class="mb-4">Military Interdepartmental Purchase Request (MIPR)</h3>
    <p>
      MIPR is a method for transferring funds from one military organization to another to procure
      services, supplies, or equipment for the requiring service. A MIPR is processed on DD Form 448
      and may be accepted on a direct citation or reimbursable basis and is defined in the
      <a
        class="_text-link"
        :href="$sanitize(federalAcqHref)"
        target="_blank"
        id="FARLink"
        rel="noopener"
      >
        Federal Acquisition Regulation (FAR) <span class="_external-link">253.208</span>
      </a>.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class FundingRequestLearnMore extends Vue {
  private gInvoiceHref = `https://fiscal.treasury.gov/g-invoice/`
  private federalAcqHref =
    `https://www.acquisition.gov/dfarspgi/pgi-253.208-required-sources-supplies-and-services.`
}
</script>
