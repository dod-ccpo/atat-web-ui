<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Are you requesting to incrementally fund this requirement?
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            To request incremental funding, your requirement must be severable in nature. This means
            that it can be divided and apportioned into two or more parts that are not necessarily
            dependent upon each other. If you select Yes below, we will help you generate a
            projected schedule for your incremental funding next.
          </p>
          <ATATRadioGroup
            class="copy-max-width mb-5 max-width-640"
            id="IncrementallyFundOptions"
            :card="true"
            :items="incrementallyFundOptions"
            :value.sync="selectedFundOption"
            :rules="[$validators.required('Please select an option')]"
          />
          <ATATExpandableLink aria-id="IFPFAQ1">
            <template v-slot:header>
              How do I know if my requirement is severable?
            </template>
            <template v-slot:content>
              <p class="mb-4">
                Severable services are continuing and recurring in nature (e.g., systems development
                support provided on a level-of-effort basis). "Severable" means tasks can be
                separated into components that independently meet a separate and on-going need of
                the government.
              </p>
              <p>
                U.S. Government Accountability Office (GAO) considers services to be non-severable
                when they constitute an entire job or single undertaking with a defined end-product
                that cannot feasibly be subdivided for separate performance in each fiscal year.
                GAO's Principles of Federal Appropriations Law presents a contract to conduct a
                study and prepare a final report as an example of non-severable services and
                concludes that non-severable services must be funded entirely out of the
                appropriation current at the time of award, notwithstanding that performance may
                extend into future fiscal years. Following that logic, GAO has further determined
                that contracts for non-severable services cannot be incrementally funded.
              </p>
            </template>
          </ATATExpandableLink>
          <ATATExpandableLink aria-id="IFPFAQ2">
            <template v-slot:header>
              How does this affect my acquisition package?
            </template>
            <template v-slot:content>
              <p class="pb-2">
                If you want to incrementally fund this requirement, your final acquisition package
                must include a <strong>Certification of Severability and Incremental Funding
                Plan</strong>.
              </p>
              <p class="pb-2">
                The purpose of this document is to provide Defense Information Technology
                Contracting Organization (DITCO) with:
              </p>
              <ol>
                <li class="pb-2">
                  written certification that the requirement is severable in nature;
                </li>
                <li class="pb-2">
                  a projected schedule for fully funding any contract line items that are not
                  optional in nature, regardless of contract type;
                </li>
                <li class="pb-2">
                  a projected schedule for fully funding firm-fixed-price contract line items in
                  order to populate DFARS clause 252.232-7007, Limitation of Government’s
                  Obligation; and
                </li>
                <li class="pb-2">
                  provide assurance to DITCO that funds have been budgeted and will be available to
                  fully fund contract line items that are not optional in nature.
                </li>
              </ol>
            </template>
          </ATATExpandableLink>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import { RadioButton } from "../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";

@Component({
  components: {
    ATATRadioGroup,
    ATATExpandableLink,
  }
})
export default class SeverabilityAndIncrementalFunding extends Vue {
  private selectedFundOption = ''
  private incrementallyFundOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes. I need to provide an incremental funding plan.",
      value: "YES",
    },
    {
      id: "No",
      label: "No. This requirement will be funded entirely up-front.",
      value: "NO",
    },
  ];
}
</script>

