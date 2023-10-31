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
      To finalize your acquisition package, a GT&C agreement must be established between you
      (the requesting agency) and your Contracting Office (the servicing agency).
    </p>
    <p>
      To save time, we recommend establishing this agreement directly within G-Invoicing.
      DAPPS will verify your information and include it in your completed package.
    </p>
    <p>
      If you upload a FS Form 7600A, the agreement details may need to be manually entered into
      G-Invoicing during the package review process.
    </p>
    <p>
      Once a GT&C is established and available in G-Invoicing, you can create an Order
      (i.e., FS Form 7600B) for your requirements within the system. Your agency may opt to use a
      stand-alone FS Form 7600B (outside of the G-Invoicing system) or a MIPR.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

@Component({})

class GInvoiceLearnMore extends Vue {
  private fiscalServiceHref = "https://www.fiscal.treasury.gov/g-invoice/index.html";
  private gInvoiceLoginHref =
    "https://www.igt.fiscal.treasury.gov";
}

export default GInvoiceLearnMore
</script>
