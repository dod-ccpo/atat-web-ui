<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="my-9">
      <v-row>
        <v-col cols="10">
          <h2 class="h2">Add a New Task Order</h2>
          <p class="my-3">
            In order to provision cloud resources, you must have an approved
            Task Order that will fund your ATAT Portfolio during a specific and
            fixed period of performance (PoP). You will be able to add
            additional Task Orders to continue funding your Portfolio in the
            future.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <h3 class="h3 mb-5">Task Order Details</h3>
          <atat-text-field
            id="task-order-number"
            label="Task Order Number"
            :rules="rules.task_order_number"
            :value.sync="model.task_order_number"
            helpText="tooltip info here"
          />
          <p class="mt-1">This number must be between 13 and 17 digits</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="9">
          <h5 class="h5 font-weight-bold mt-6">
            Is this Task Order
            <u>signed by an appropriate, duly warranted Contracting Officer </u>
            who has the authority to execute the Task Order on your Agency’s
            behalf?
          </h5>
          <p class="mt-1">
            By selecting yes, you certify that the Contracting Officer has
            authorized you to upload the Task Order in accordance with your
            agency’s policy and procedures.
          </p>

          <v-btn
            class="ma-2"
            color="primary"
            outlined
            @click="signedTaskOrder = true"
          >
            Yes</v-btn
          >
          <v-btn
            class="ma-2"
            color="primary"
            outlined
            @click="signedTaskOrder = false"
          >
            No</v-btn
          >
          <v-alert
            v-if="!signedTaskOrder"
            outlined
            rounded
            color="error"
            type="info"
            class="text-left error_lighter black-icon mt-3"
            border="left"
            width="600"
          >
            <div class="black--text h3 ml-2">
              You must have a signed Task Order to proceed
            </div>
            <div class="black--text body-lg ml-2">
              You will not be able to provision cloud resources within ATAT
              without an awarded Task Order that is signed by a duly warranted
              Contracting Officer. Please contact your Contracting Officer for
              questions regarding your Task Order status or to obtain
              authorization to spend government funds.
              <br />
              <br />
              You are subject to potential penalties that may include fines,
              imprisonment, or both, under the U.S. law and regulations for any
              false statement or misrepresentation in association with this Task
              Order submission or on any accompanying documentation.
            </div>
          </v-alert>
          <div>
            <v-row>
              <v-col cols="4">
                <v-divider class="mt-7"></v-divider>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { CreateTaskOrderFormModel } from "../../../../types/Wizard";
@Component({})
export default class CreateTaskOrderForm extends Vue {
  private signedTaskOrder = true;
  private rules = {};
  private model: CreateTaskOrderFormModel = {
    task_order_number: "",
  };

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }
  // create a function that sets btn class to active after click
  public handleClick(e: MouseEvent): void {
    console.log(e.target);
  }
  public async validateForm(): Promise<boolean> {
    let validated = false;
    this.rules = {
      task_order_number: [
        (v: string) =>
          (v.length > 13 && v.length < 17) ||
          "This number must be between 13 and 17 digits",
      ],
    };
    await this.$nextTick(() => {
      validated = this.Form.validate();
    });

    return validated;
  }
}
</script>
