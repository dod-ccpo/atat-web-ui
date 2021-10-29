<template>
  <div class="body-lg">
    <v-row>
      <v-col class="content-max-width">
        <h1>Your Task Order Summary</h1>
        <p v-show="cardsData.cards.length > 0" class="mb-8">
          If you have more task orders, <strong>add</strong> them below. You can
          also <strong>edit</strong> or <strong>delete</strong> any of the task
          orders you already entered. When you are done, click
          <strong>Next</strong> and we will walk you through adding your
          applications and environments.
        </p>
      </v-col>
    </v-row>
    <v-row v-if="cardsData.cards.length === 0" class="mb-8 mt-0">
      <v-col class="content-max-width">
        <v-card class="pa-10">
          <v-card-text>
            <p class="body-lg text-center text--base-dark mb-0">
              You currently do not have any task orders saved.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <atat-summary-card
      v-if="cardsData.cards.length > 0"
      :data="cardsData"
      v-on:delete="onDeleteTaskOrder"
      v-on:edit="onEditTaskOrder"
    ></atat-summary-card>

    <v-btn class="primary mb-10" :ripple="false" @click="onAddNewTaskOrder">
      <v-icon aria-hidden="true">control_point</v-icon>
      <div class="ml-2">Add a Task Order</div>
    </v-btn>

    <section title="Task Order FAQs" class="content-max-width">
      <v-btn
        @click="showAdditionalFundingText = !showAdditionalFundingText"
        text
        x-small
        :ripple="false"
        class="pl-0 primary--text mb-5"
        id="Q_AddlFunding"
        aria-controls="A_AddlFunding"
        :aria-expanded="showAdditionalFundingText + ''"
      >
        <span class="link-body-md">
          Can I add additional funding sources after my Portfolio is
          provisioned?
        </span>
        <v-icon>
          {{ showAdditionalFundingText ? "expand_less" : "expand_more" }}
        </v-icon>
      </v-btn>
      <div
        v-show="showAdditionalFundingText"
        id="A_AddlFunding"
        aria-labelledby="Q_AddlFunding"
      >
        <p>
          Yes. As the Portfolio Manager, you will be able add CLINs to existing
          Task Orders or add a new Task Order in the future. This will allow you
          to continue funding the Applications in this Portfolio after the
          period of performance has expired or after obligated funds have been
          exhausted.
        </p>
        <p>
          You will have the opportunity to invite other Portfolio Managers to
          help you manage funding for this Portfolio later.
        </p>
      </div>

      <v-btn
        @click="showPopText = !showPopText"
        text
        x-small
        :ripple="false"
        class="pl-0 primary--text mb-5"
        id="Q_Expires"
        aria-controls="A_Expires"
        :aria-expanded="showPopText + ''"
      >
        <span class="link-body-md">
          What happens to my Portfolio if the period of performance or obligated
          funds expire?
        </span>
        <v-icon>
          {{ showPopText ? "expand_less" : "expand_more" }}
        </v-icon>
      </v-btn>
      <div v-show="showPopText" id="A_Expires" aria-labelledby="Q_Expires">
        <p>
          If your Portfolio’s period of performance expires or if you run out of
          obligated funds, your team members will not be able to access your
          Applications within the CSP console.
        </p>
        <p>
          We will notify you when your funding sources are in danger of
          expiration, so that you have ample time to take action.
        </p>
      </div>

    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ATATSummaryCardItem,
  ATATSummaryCards,
  TaskOrderModel,
} from "../../../../types/Wizard";
import { Component } from "vue-property-decorator";
import { addfunding, editfunding } from "../../../router/wizard";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({})
export default class Step2Summary extends Vue {
  private showPopText = false;
  private showAdditionalFundingText = false;
  private async mounted(): Promise<void> {
    this.transformData();
  }

  private cardType = "Task Orders";
  private cardsData: ATATSummaryCards = {
    cards: [],
  };

  get taskOrders(): TaskOrderModel[] {
    return this.$store.state.taskOrderModels;
  }

  async onDeleteTaskOrder(id: string): Promise<void> {
    await this.$store.dispatch("deleteTaskOrder", id);

    if (this.taskOrders.length === 0) {
      //route the user back to add funding step
      await this.$store.dispatch("addNewTaskOrder");
      this.$router.push({
        name: addfunding.name,
        params: {
          id: "",
        },
      });
    }

    this.transformData();
  }

  async onEditTaskOrder(id: string): Promise<void> {
    this.$store.dispatch("editTaskOrder", id);
    this.$router.push({
      name: editfunding.name,
      params: {
        id: id,
      },
    });
  }

  async onAddNewTaskOrder(id: string): Promise<void> {
    await this.$store.dispatch("addNewTaskOrder");
    this.$router.push({
      name: addfunding.name,
      params: {
        id: id,
      },
    });
  }

  public transformData(): void {
    this.cardsData.cards = [];
    this.taskOrders.forEach((taskOrder) => {
      let totalClinValue = taskOrder.clins.reduce((prev, cur) => {
        return Number(prev) + Number(cur.total_clin_value);
      }, 0);

      let totalObligatedFunds = taskOrder.clins.reduce((prev, cur) => {
        return Number(prev) + Number(cur.obligated_funds);
      }, 0);

      let card: ATATSummaryCardItem = {
        id: taskOrder.id,
        type: "TASK ORDER",
        title: taskOrder.task_order_number,
        showChevronRight: true,
        items: [
          {
            title: "CLINS",
            prefix: "",
            value: taskOrder.clins.length,
          },
          {
            title: "Total Value",
            prefix: "$",
            value: totalClinValue,
          },
          {
            title: "Obligated Funds",
            prefix: "$",
            value: totalObligatedFunds,
          },
        ],
        leftButtonText: "Edit",
        rightButtonText: "Delete",
      };
      this.cardsData.cards.push(card);
    }, this);
  }

  public async beforeRouteLeave(
    to: unknown,
    from: unknown,
    next: (n: void) => void
  ): Promise<void> {
    next();
  }
}
</script>
