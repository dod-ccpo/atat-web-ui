<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="my-9 clins-card">
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
                <template v-slot:default="{ open }">
                  <v-container>
                    <v-row>
                      <v-col cols="1" class="h4 text--base-darkest">{{
                        card_number
                      }}</v-col>
                      <v-col cols="11" class="h4 text--base-darkest">{{
                        `CLIN ${_clin_number}`
                      }}</v-col>
                    </v-row>
                    <v-row v-if="!open">
                      <v-col cols="1"></v-col>
                      <v-col cols="11">
                        <v-row class="mb-n8">
                          <v-col
                            class="micro font-weight-bold text--base-darkest"
                          >
                            IDIQ Type
                          </v-col>
                          <v-col
                            class="micro font-weight-bold text--base-darkest"
                          >
                            Total Value
                          </v-col>
                          <v-col
                            class="micro font-weight-bold text--base-darkest"
                          >
                            Obligated Funds
                          </v-col>
                          <v-col
                            class="micro font-weight-bold text--base-darkest"
                          >
                            Period of Performance
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="optional">{{ _idiq_clin }}</v-col>
                          <v-col class="optional">
                            {{ formatCurrency(_total_clin_value) }}
                          </v-col>
                          <v-col class="optional">{{
                            formatCurrency(_obligated_funds)
                          }}</v-col>
                          <v-col class="optional">
                            {{
                              `${formatDate(_pop_start_date)} - ${formatDate(
                                _pop_end_date
                              )}`
                            }}
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-container>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <atat-text-field
                  class="mb-3"
                  id="clin-number"
                  label="CLIN Number"
                  :value.sync="_clin_number"
                  @click.native.stop
                />
                <atat-select
                  class="clin-idiq-select"
                  label="Corresponding IDIQ CLIN"
                  placeholder="- Select -"
                  :items="idiq_clin_items"
                  :selectedValue="_idiq_clin"
                >
                </atat-select>
                <v-row>
                  <v-col>
                    <div class="h4 font-weight-bold my-3">CLIN Funding</div>
                  </v-col>
                </v-row>
                <atat-text-field
                  class="mb-3"
                  id="total-clin-value"
                  label="Total CLIN Value"
                  :helpText="clinHelpText"
                  :value.sync="_total_clin_value"
                />
                <atat-text-field
                  id="obligated-funds"
                  label="Obligated Funds"
                  :helpText="obligatedFundsHelpText"
                  :value.sync="_obligated_funds"
                />
                <v-row>
                  <v-col>
                    <div class="h4 font-weight-bold my-6">
                      Period of Performance (PoP)
                    </div>
                    <atat-date-picker label="Start Date" />
                  </v-col>
                </v-row> </v-expansion-panel-content
            ></v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import moment from "moment";
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

  private idiq_clin_items = [
    "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
    "IDIQ CLIN 0002 Classified IaaS/PaaS",
    "IDIQ CLIN 0003 Unclassified Cloud Support Package",
    "IDIQ CLIN 0004 Classified Support Package",
  ];

  @Prop({ required: true, default: () => -1 }) card_number!: number;
  @PropSync("clin_number", { required: true }) _clin_number!: string;

  @PropSync("idiq_clin") _idiq_clin!: string;
  @PropSync("total_clin_value") _total_clin_value!: number;
  @PropSync("obligated_funds") _obligated_funds!: number;
  @PropSync("pop_start_date") _pop_start_date!: string;
  @PropSync("pop_end_date") _pop_end_date!: string;

  private formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  public formatCurrency(value: number): string {
    return this.formatter.format(value);
  }

  public formatDate(value: string): string {
    return moment(new Date(value)).format("MMMM DD, YYYY");
  }
}
</script>
