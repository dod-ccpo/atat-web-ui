<template>
  <div class="_panel-padding">
    <h2 class="mb-5">Understanding Business Associate Agreements (BAA)</h2>
    <h3 class="mb-4">What is a business associate?</h3>
    <p> 
      A business associate is a person or entity that performs certain functions or activities 
      that involve the use or disclosure of Protected Health Information (PHI) on behalf of, or 
      provides services to, a covered entity. A member of the covered entity’s workforce is not 
      a business associate.
    </p>
    <p>
      A business associate also is a subcontractor that creates, receives, maintains, or transmits 
      PHI on behalf of another business associate.
    </p>

    <hr class="my-5" />

    <h3 class="mb-4">Why is a BAA important?</h3>
    <p>
      The HIPAA rules generally require that covered entities enter into contracts with their 
      business associates to ensure that the business associates will appropriately safeguard PHI 
      when it is transmitted or maintained in electronic (e-PHI) or any other form. 
    </p>
    <p>
      The BAA also serves to clarify and limit, as appropriate, the permissible uses and 
      disclosures of PHI by the business associate, based on the relationship between the parties 
      and the activities or services being performed by the business associate. A business 
      associate may use or disclose PHI only as permitted or required by its BAA or as required 
      by law.
    </p>
    <p>
      A business associate is directly liable under HIPAA and subject to civil and, in some 
      cases, criminal penalties for making uses and disclosures of PHI that are not authorized 
      by its contract or required by law. 
    </p>
    <p>
      A business associate also is directly liable and subject to civil penalties for failing to
      safeguard e-PHI, in accordance with the 
      <a 
        href="https://www.hhs.gov/hipaa/for-professionals/security/index.html" 
        target="_blank"
        class="_text-link"
      >
        HIPAA Security <span class="_external-link">Rule.</span>
      </a>
    </p>
    <p>
      For more information, reference:
      <ul class="mt-4">
        <li class="mb-2">
          <a 
            :href="moreInfoHref"
            target="_blank"
            class="_text-link"
          >
          Health Information Privacy, Business Associate Contracts
          </a>
        </li>
        <li class="mb-2">
          <a 
            :href="title45Href" 
            target="_blank"
            class="_text-link"
          >
            Business Associate and PHI, CFR title 45 part 160.103
          </a>
        </li>
        <li>
          BAA, CFR title 45 part 164.308 (b)(4)
        </li>
      </ul>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class BAALearnMore extends Vue {
  /* eslint-disable max-len */
  private moreInfoHref = `https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html`;
  private title45Href= `https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160/subpart-A/section-160.103`;
}
</script>
