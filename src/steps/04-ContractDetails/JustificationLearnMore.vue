<template>
  <div class="_panel-padding">
    <h2 class="mb-5">About time-and-materials (T&M) contract type justifications</h2>
    <p> 
      For T&M contract types, the Contracting Officer must execute a determination and 
      findings (D&F) that contains sufficient facts and rationale to justify that no other 
      contract type is suitable, in accordance with <a 
            href="https://www.acquisition.gov/far/12.207"
            target="_blank"
            class="_text-link"
          >
            <span class="_external-link">FAR 12.207</span>
          </a>.
    </p>
    <p>
      T&M justifications must include:
      <ol class="mt-4 ml-6 _atat-ul">
        <li class="mb-3">
          Why it is not possible to reasonably estimate the extent or duration of the work or to 
          anticipate costs with any reasonable degree of accuracy. This shall reference each major 
          task in the Description of Work.
        </li>
        <li class="mb-3">
          Why a firm-fixed-price (FFP) task order would pose unreasonable risk to the contractor. 
          Discuss steps taken to maximum use of FFP; if none, describe actions planned to maximize 
          use of FFP on future acquisitions.
        </li>
        <li>
          The control measures that will be taken to monitor contractor performance and costs 
          in labor.
        </li>
      </ol>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";

@Component({})

class JustificationLearnMore extends Vue {}
export default toNative(JustificationLearnMore)
</script>
