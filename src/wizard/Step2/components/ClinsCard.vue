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
                  :rules="rules.clinNumberRule"
                  :value.sync="clin.clin_number"
                />
                <atat-select label="Corresponding IDIQ CLIN"></atat-select>
                <v-row>
                  <v-col>
                    <div class="h4 font-weight-bold my-3">CLIN Funding</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <atat-text-field
                      class="mb-3"
                      id="total-clin-value"
                      label="Total CLIN Value"
                      :rules="rules.totalCLINRule"
                      :helpText="clinHelpText"
                      :value.sync="clin.total_clin_value"
                    />
                    <atat-text-field
                      id="obligated-funds"
                      label="Obligated Funds"
                      :rules="rules.obligatedFundsRule"
                      :helpText="obligatedFundsHelpText"
                      :value.sync="clin.obligated_funds"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div class="h4 font-weight-bold my-6">
                      Period of Performance (PoP)
                    </div>
                    <div class="d-flex align-center ma-0">
                      <atat-date-picker
                        :date.sync="clin.pop_start_date"
                        label="Start Date"
                      />
                      <atat-date-picker
                        :date.sync="clin.pop_end_date"
                        class="ma-0"
                        label="End Date"
                      />
                    </div>
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
import { Component, PropSync } from "vue-property-decorator";
import { CLIN } from "../../../../types/Wizard";
@Component({
  components: {},
})
export default class ClinsCard extends Vue {
  // @PropSync("clins") _clin!: CLIN;

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }
  public clin: CLIN = {
    clin_number: "",
    idiq_clin: "",
    total_clin_value: 0,
    obligated_funds: 0,
    pop_start_date: "",
    pop_end_date: "",
  };
  private clinHelpText =
    "This is the full amount of money requested\n" +
    "in a task order. It does not have to be spent\n" +
    "duing the CLIN’s period of performance.";
  private obligatedFundsHelpText =
    "Obligated funds are the legal amount allocated\n" +
    "for a project or contract that can be spent during\n" +
    "the CLIN’s period of performance.";

  public rules = {};

  public async validateForm(): Promise<boolean> {
    let validated = false;
    this.rules = {
      clinNumberRule: [
        (v: number) => !!v || "Please enter your 4-digit CLIN Number",
        (v: string) => v.length < 4 || "CLIN number cannot exceed 4 characters",
      ],
      correspondingIDIQRule: [
        (v: string) => !!v || "Please select an IDIQ CLIN type",
      ],
      totalCLINRule: [(v: number) => !!v || "Please enter CLIN value"],
      obligatedFundsRule: [
        (v: number) => !!v || "Please enter your obligated Funds",
        (v: number) =>
          v < this.clin.total_clin_value ||
          "Obligated Funds cannot exceed total CLIN Value",
      ],
    };

    await this.$nextTick(() => {
      validated = this.Form.validate();
    });

    return validated;
  }
}
</script>
