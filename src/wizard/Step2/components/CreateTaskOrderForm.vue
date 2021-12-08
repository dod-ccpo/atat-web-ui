<template>
  <v-form ref="form" lazy-validation class="body-lg">
    <section role="region" title="Page Overview" class="content-max-width">
      <h1 v-if="!stepHasBeenTouched" tabindex="-1">
        Let’s add a new task order
      </h1>
      <p
        v-if="!stepHasBeenTouched"
        class="ma-0 mt-4 body-lg text--base-darkest"
      >
        You will find this information in your awarded task order that funds
        your ATAT portfolio. If you have more than one task order, we will walk
        through them one at a time. Select <strong>Next</strong> to view all of
        your funding sources.
      </p>
      <!--      edit-->
      <h1 v-if="stepHasBeenTouched" tabindex="-1">
        Let’s update your task order details
      </h1>
      <p v-if="stepHasBeenTouched" class="ma-0 mt-4 body-lg text--base-darkest">
        You will find this information in your awarded task order that funds
        your ATAT portfolio.<span v-if="!isReturnToReview">
          Select <strong>Next</strong> when you are done making changes, or to
          skip to your task order summary. From there, you can add additional
          task orders to your portfolio, if needed.</span
        >
        <span v-else>
          When you are done, select
          <strong>Return to Review and Submit</strong> to finalize your
          portfolio.</span
        >
      </p>
    </section>
    <section role="region" title="Error Panel" class="content-max-width">
      <ATATAlert
        type="error"
        class="my-8"
        :closeButton="false"
        v-if="_erroredFields.length > 0"
      >
        <template v-slot:content>
          Please review the fields below and take any necessary actions.
          <ul>
            <li v-for="(item, index) in _erroredFields" :key="index">
              {{ item.message }}
            </li>
          </ul>
        </template>
      </ATATAlert>
    </section>
    <section
      role="region"
      title="Task Order Details"
      class="content-max-width mt-8"
    >
      <h2 class="mb-8">Task Order Details</h2>
      <div class="input-max-width mb-10">
        <atat-text-field
          id="task-order-number"
          label="Task Order Number"
          :rules="rules.task_order_number"
          :value.sync="_task_order_number"
          :helpText="helpText"
          :validate-on-load="validateOnLoad"
        />
        <p class="mt-2 mb-7 text--base">
          This number must be either 13 or 17 digits.
        </p>
        <atat-file-upload
          id="task-order-document-upload"
          ref="pdfFileUpload"
          :multiple="false"
          :pdfFile.sync="_task_order_file"
          label="Upload Your Approved Task Order"
          message="Only PDF files with a max file size of 10 MB"
          :errorMessageFromParent.sync="fileUploadRequiredErrorMessage"
          :maxFileSize="20"
          :stepNumber="2"
          @removeFile="onRemoveFile"
        />
      </div>

      <p class="h3 mb-2">
        Is this task order
        <u>signed by an appropriate, duly warranted Contracting Officer</u>
        who has the authority to execute the task order on your agency’s behalf?
      </p>
      <p>
        By selecting yes, you certify that the Contracting Officer has
        authorized you to upload the task order in accordance with your agency’s
        policies and procedures.
      </p>

      <div
        id="task-order-signed-div"
        v-if="signedTaskOrderErrorMessage !== ''"
        class="mb-3 alert"
        role="alert"
      >
        <div class="error--text">
          <div class="v-messages__message">
            {{ signedTaskOrderErrorMessage }}
          </div>
        </div>
      </div>

      <v-btn
        :class="[
          signedTaskOrderErrorMessage ? 'error-button' : 'primary',
          isYesButtonClicked ? '' : 'v-btn--outlined',
          'ma-2 ml-0',
        ]"
        @click="isTaskOrderSigned(true)"
        aria-label="Yes, this task order is signed by an appropriate contracting officer"
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
        aria-label="No, this task order is not signed by an appropriate contracting officer"
      >
        No
      </v-btn>
      <ATATAlert
        v-if="signedTaskOrder === 'No' && !savedTaskOrderSigned"
        type="error"
        :closeButton="false"
        width="600"
        class="mt-8 mb-10"
      >
        <template v-slot:content>
          <div class="h2">You must have a signed task order to proceed</div>
          <div>
            <p>
              You will not be able to provision cloud resources within ATAT
              without an awarded Task Order that is signed by a duly warranted
              Contracting Officer. Please contact your Contracting Officer for
              questions regarding your Task Order status or to obtain
              authorization to spend government funds.
            </p>
            <p class="mb-0">
              You are subject to potential penalties that may include fines,
              imprisonment, or both, under the U.S. law and regulations for any
              false statement or misrepresentation in association with this Task
              Order submission or on any accompanying documentation.
            </p>
          </div>
        </template>
      </ATATAlert>
    </section>

    <atat-divider />

    <section role="region" title="Contract Line Items">
      <h2>Contract Line Items</h2>
      <p class="mb-0 content-max-width">
        A Contract Line Item Number (CLIN) is a line in your task order that
        lists the services and products to be delivered with a price or ceiling
        which cannot be exceeded. Refer to your task order to locate your CLINs.
      </p>
      <clins-card-list
        class="my-9 mt-7"
        ref="clinsCards"
        :clins="_clins"
        @add="$emit('add')"
        @delete="(cardNumber) => $emit('delete', cardNumber)"
        :validate-on-load.sync="validateOnLoad"
      ></clins-card-list>
    </section>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import { ErrorPanelMessages, TaskOrderFile } from "types/Wizard";
import ClinsCardList from "./ClinsCardList.vue";
import { Clin } from "types/Portfolios";
import ATATDivider from "@/components/ATATDivider.vue";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ClinsCardList,
    "atat-divider": ATATDivider,
    ATATAlert,
  },
})
export default class CreateTaskOrderForm extends Vue {
  public signedTaskOrder = "";
  public signedTaskOrderErrorMessage = "";
  public isYesButtonClicked = false;
  public isNoButtonClicked = false;
  private fileUploadRequiredErrorMessage = "";
  private helpText = `If your Contracting Officer used:
    Form 1449: Enter the “Order Number”
    Form 1155: Enter the “Delivery Order/Call No.”`;
  private savedTaskOrderSigned = false;
  private stepHasBeenTouched = false;
  private isReturnToReview = this.$store.getters["wizard/isReturnToReview"];
  private isArrivedFromStep5 = this.$store.getters["wizard/isArrivedFromStep5"];

  @PropSync("task_order_number") _task_order_number!: number;
  @PropSync("task_order_file") _task_order_file!: TaskOrderFile;
  @PropSync("clins") _clins!: Clin[];
  @Prop({ default: false }) private validateOnLoad!: boolean;
  @PropSync("signed", { default: false }) private _signed!: boolean;
  @PropSync("erroredFields") private _erroredFields:
    | ErrorPanelMessages[]
    | undefined;

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  get rules(): unknown {
    const rulesObj = {
      task_order_number: [
        (v: string) =>
          /^\d+$/.test(v) ||
          "Please enter your Task Order Number (Must Be Numbers)",
        (v: string) =>
          (v.length >= 13 && v.length <= 17) ||
          "Task Order Numbers must be between 13 and 17 digits",
      ],
    };
    return rulesObj;
  }

  public isTaskOrderSigned(signed: boolean): void {
    //clear out any error messages
    this.signedTaskOrderErrorMessage = "";
    this.signedTaskOrder = signed ? "Yes" : "No";
    this.isYesButtonClicked = signed;
    this.isNoButtonClicked = !signed;
    this._signed = signed;
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
    // this.clinCardPanelErrorMessages;
    if (clinsCards && clinsCards.validate) {
      validated.push(await clinsCards.validate());
    }
    await this.$nextTick(() => {
      validated.push(this.Form.validate());
    });
    return validated.every((v) => v === true);
  }

  public ExpandAddedClin(isPageLoad: boolean): void {
    const clinsCards = this.$refs.clinsCards as ClinsCardList;
    clinsCards.ExpandAddedClin(isPageLoad);
  }

  private async mounted(): Promise<void> {
    this.ExpandAddedClin(true);
    if (
      this._signed &&
      this._task_order_file &&
      this._task_order_file.name &&
      this._task_order_file.id
    ) {
      this.savedTaskOrderSigned = true;
      this.isTaskOrderSigned(this._signed);
    }

    this.stepHasBeenTouched = this.$store.getters["wizard/getStepTouched"](2);
  }

  // private updated(): void {
  //   this.displayedErrorPanelMessages();
  // }

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
