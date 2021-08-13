<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="my-9">
      <v-row>
        <v-col cols="7">
          <h3 class="h3 mb-2">Contract Line Items</h3>
          <p>
            A CLIN is a line in your contract that lists the services and
            products to be delivered with a price or ceiling which cannot be
            exceeded. Refer to your Task Order to locate your Contract Line Item
            Numbers (CLINs).
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="9">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="body-lg font-weight-bold">
                PlaceHolder
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <atat-text-field
                  class="mb-3"
                  id="clin-number"
                  label="CLIN Number"
                />
                <atat-select label="Corresponding IDIQ CLIN"></atat-select>
                <v-row>
                  <v-col>
                    <div class="h4 font-weight-bold my-3">CLIN Funding</div>
                  </v-col>
                </v-row>
                <atat-text-field
                  class="mb-3"
                  id="total-clin-value"
                  label="Total CLIN Value"
                  helpText="clinHelpText"
                />
                <atat-text-field id="obligated-funds" label="Obligated Funds" />
                <v-row>
                  <v-col>
                    <div class="h4 font-weight-bold mt-6">
                      Period of Performance (PoP)
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-content></v-expansion-panel
            >
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  components: {},
})
export default class ClinsCard extends Vue {
  private clinHelpText =
    "This is the full amount of money requested\n" +
    "in a task order. It does not have to be spent\n" +
    "duing the CLIN’s period of performance.";
  private obligatedFundsHelpText =
    "Obligated funds are the legal amount allocated\n" +
    "for a project or contract that can be spent during\n" +
    "the CLIN’s period of performance.";
}
</script>
