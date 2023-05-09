<template>
  <div class="_panel-padding">
    <h2 class="mb-5">What is G-Invoicing?</h2>
    <p>
      Government Invoicing (G-Invoicing) is a Fiscal Service application used by Federal Program
      Agencies (FPAs) to manage their intragovernmental reimbursable, Buy/Sell transactions.
    </p>
    <p>
      G‑Invoicing helps agencies and their trading partners:
    </p>
    <ul>
      <li class="mb-2">
        Negotiate and accept General Terms and Conditions (GT&amp;Cs) agreements
      </li>
      <li class="mb-2">
        Broker orders
      </li>
      <li class="mb-2">
        Exchange performance information
      </li>
      <li class="mb-6">
        Validate settlement requests
      </li>
    </ul>
    <p>
      The financial management system aligns processes between trading partners through each step of
      the Buy/Sell lifecycle and uses a common set of terms. This will replace the various manual
      forms used today like the Fiscal Services (FS) Form 7600A/B, Military Interdepartmental 
      Purchase Request (MIPR), etc.
    </p>
    <p>
      For more information, visit:
    </p>
    <ul>
      <li>
        <a
          :href="$sanitize(fiscalServiceHref)"
          target="_blank"
          id="BFSLink"
          rel="noopener"
        >
         Bureau of Fiscal Service, G-Invoicing
        </a>
      </li>
      <li>
        <a
          :href="$sanitize(gInvoiceLoginHref)"
          target="_blank"
          id="GInvoicingLoginLink"
          rel="noopener"
        >
          G-Invoicing Login
        </a>
      </li>
    </ul>
    <hr class="my-5"/>
    <h3 class="mb-4">How does G-Invoicing affect my acquisition?</h3>
    <p>
      In order to finalize your acquisition package, you will need to have a GT&amp;Cs agreement
      established between your requesting agency and DISA, the servicing agency. This agreement must
      be completed in the G-Invoicing system.
    </p>
    <p>
      Once a GT&amp;Cs is established, you will also need to create an Order for your requirement.
      You can do this directly within G-Invoicing and we will import your details. Or, we can
      collect your order requirements and funding info and generate a new Order within G-Invoicing
      for you.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class GInvoiceLearnMore extends Vue {
  private fiscalServiceHref = "https://www.fiscal.treasury.gov/g-invoice/index.html";
  private gInvoiceLoginHref =
    "https://www.igt.fiscal.treasury.gov";
}
</script>
