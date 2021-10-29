<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="body-lg">
      <v-row>
        <v-col class="copy-max-width">
          <h1>Add a New Task Order</h1>
          <p class="ma-0 mt-4 body-lg text--base-darkest">
            You will find this information in your awarded task order that funds
            your ATAT portfolio. If you have more than one task order, we will
            walk through them one at a time. Select <strong>Next</strong> to
            view funding sources.
          </p>
        </v-col>
      </v-row>

      <section role="region" title="Task Order Details" class="copy-max-width">
        <v-row>
          <v-col>
            <h2>Task Order Details</h2>
            <div class="width-50 mb-10">
              <atat-text-field
                id="task-order-number"
                label="Task Order Number"
                :rules="rules.task_order_number"
                :value.sync="_task_order_number"
                :helpText="helpText"
                :validate-on-load="validateOnLoad"
              />
              <p class="mt-2 mb-7 text--base">
                This number must be between 13 and 17 digits
              </p>
              <atat-file-upload
                ref="pdfFileUpload"
                :multiple="false"
                :pdfFile.sync="_task_order_file"
                label="Upload your approved Task Order"
                message="Only PDF files with a max file size of 20 MB"
                :errorMessageFromParent.sync="fileUploadRequiredErrorMessage"
                :maxFileSize="20"
                :stepNumber="2"
                @removeFile="onRemoveFile"
              />
            </div>

            <p class="h3 mb-2">
              Is this Task Order
              <u>
                signed by an appropriate, duly warranted Contracting Officer
              </u>
              who has the authority to execute the task order on your agency’s
              behalf?
            </p>
            <p>
              By selecting yes, you certify that the contracting officer has
              authorized you to upload the task order in accordance with your
              agency’s policy and procedures.
            </p>
            <v-row v-if="signedTaskOrderErrorMessage !== ''" class="mb-3">
              <div class="ml-3 mb-3 error--text" role="alert">
                <div class="v-messages__message">
                  {{ signedTaskOrderErrorMessage }}
                </div>
              </div>
            </v-row>

            <v-btn
              :class="[
                signedTaskOrderErrorMessage ? 'error-button' : 'primary',
                isYesButtonClicked ? '' : 'v-btn--outlined',
                'ma-2 ml-0',
              ]"
              @click="isTaskOrderSigned(true)"
            >
              Yes
            </v-btn>
            <v-btn
              :class="[
                signedTaskOrderErrorMessage ? 'error-button' : 'primary',
                isNoButtonClicked ? '' : 'v-btn--outlined',
                'ma-2',
              ]"
              @click="isTaskOrderSigned(false)"
            >
              No
            </v-btn>

            <v-alert
              v-if="signedTaskOrder === 'No' && !savedTaskOrderSigned"
              outlined
              rounded
              color="error"
              type="info"
              class="text-left error_lighter black-icon mt-3 border-thick pr-14"
              border="left"
              width="600"
            >
              <div class="black--text h2 ml-2">
                You must have a signed task order to proceed
              </div>
              <div class="black--text body-lg ml-2 mr-2">
                <p>
                  You will not be able to provision cloud resources within ATAT
                  without an awarded Task Order that is signed by a duly
                  warranted Contracting Officer. Please contact your Contracting
                  Officer for questions regarding your Task Order status or to
                  obtain authorization to spend government funds.
                </p>
                <p class="mb-0">
                  You are subject to potential penalties that may include fines,
                  imprisonment, or both, under the U.S. law and regulations for
                  any false statement or misrepresentation in association with
                  this Task Order submission or on any accompanying
                  documentation.
                </p>
              </div>
            </v-alert>
          </v-col>
        </v-row>
      </section>

      <atat-divider />

      <section role="region" title="Contract Line Items">
        <v-row>
          <v-col>
            <h2>Contract Line Items</h2>
            <p class="mb-0">
              A CLIN is a line in your contract that lists the services and
              products to be delivered with a price or ceiling which cannot be
              exceeded. Refer to your task order to locate your Contract Line
              Item Numbers (CLINs).
            </p>
            <clins-card-list
              class="my-9 mt-7"
              ref="clinsCards"
              :clins="_clins"
              @add="$emit('add')"
              @delete="(cardNumber) => $emit('delete', cardNumber)"
            ></clins-card-list>
          </v-col>
        </v-row>
      </section>

    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import { TaskOrderFile } from "types/Wizard";
import ClinsCardList from "./ClinsCardList.vue";
import { Clin } from "types/Portfolios";
import ATATDivider from "@/components/ATATDivider.vue";

@Component({
  components: {
    ClinsCardList,
    "atat-divider": ATATDivider,
  },
})
export default class CreateTaskOrderForm extends Vue {
  public signedTaskOrder = "";
  public signedTaskOrderErrorMessage = "";
  public isYesButtonClicked = false;
  public isNoButtonClicked = false;
  private fileUploadRequiredErrorMessage = "";
  private helpText = `If your contracting officer used:
    Form 1149: Enter the “Order Number”
    Form 1155: Enter the “Delivery Order/Call No.”`;
  private savedTaskOrderSigned = false;

  @PropSync("task_order_number") _task_order_number!: number;
  @PropSync("task_order_file") _task_order_file!: TaskOrderFile;
  @PropSync("clins") _clins!: Clin[];
  @Prop({ default: false }) private validateOnLoad!: boolean;
  @Prop({ default: false }) private signed!: boolean;

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  get rules(): unknown {
    return {
      task_order_number: [
        (v: string) =>
          /^\d+$/.test(v) ||
          "Please enter your Task Order Number (Must Be Numbers)",
        (v: string) =>
          (v.length >= 13 && v.length <= 17) ||
          "Task Order Numbers must be between 13 and 17 digits",
      ],
    };
  }

  public isTaskOrderSigned(signed: boolean): void {
    //clear out any error messages
    this.signedTaskOrderErrorMessage = "";
    this.signedTaskOrder = signed ? "Yes" : "No";
    this.isYesButtonClicked = signed;
    this.isNoButtonClicked = !signed;
  }

  public DidUserSignTaskOrder(): boolean {
    return this.isYesButtonClicked;
  }

  public async validateForm(): Promise<boolean> {
    let validated: boolean[] = [];
    this.signedTaskOrderErrorMessage = "";

    if (this._task_order_file && this._task_order_file.name === "") {
      this.fileUploadRequiredErrorMessage =
        "Please upload your task order document";
    }
    validated.push(this._task_order_file && this._task_order_file.name !== "");

    if (this.signedTaskOrder === "") {
      this.signedTaskOrderErrorMessage =
        "Please select Yes or No below to verify your task order";
    }

    validated.push(this.signedTaskOrder !== "");

    const clinsCards = this.$refs.clinsCards as ClinsCardList;

    if (clinsCards && clinsCards.validate) {
      validated.push(await clinsCards.validate());
    }
    await this.$nextTick(() => {
      validated.push(this.Form.validate());
    });

    return validated.every((v) => v === true);
  }

  public ExpandAddedClin(): void {
    const clinsCards = this.$refs.clinsCards as ClinsCardList;
    clinsCards.ExpandAddedClin();
  }

  private mounted(): void {
    if (
      this.signed &&
      this._task_order_file &&
      this._task_order_file.name &&
      this._task_order_file.id
    ) {
      this.savedTaskOrderSigned = true;
      this.isTaskOrderSigned(this.signed);
    }
  }

  private async onRemoveFile(): Promise<void> {
    this.signedTaskOrder = "";
    this._task_order_file.name = "";
    this._task_order_file.id = "";
    this.isYesButtonClicked = false;
    this.isNoButtonClicked = false;
    this.savedTaskOrderSigned = false;
    await this.validateForm();
  }
}
</script>
