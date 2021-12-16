<template>
  <div class="body-lg">
    <div class="content-max-width">
      <h1 tabindex="-1">Your Task Order Summary</h1>
      <p v-if="cardsData.cards.length > 0" class="mb-8">
        If you have more task orders, <strong>add</strong> them below. You can
        also <strong>edit</strong> or <strong>delete</strong> any of the task
        orders you already entered.
        <span v-if="!isReturnToReview"
          >When you are done, click <strong>Next</strong> and we will walk you
          through adding your applications and environments.</span
        ><span v-else
          >When you are done, click
          <strong>Return to Review and Submit</strong> to finalize your
          portfolio.</span
        >
      </p>
      <v-card v-else class="pa-12 mb-8 mt-0">
        <v-card-text class="pa-0">
          <p class="body-lg text-center text--base-dark mb-0">
            You currently do not have any task orders saved.
          </p>
        </v-card-text>
      </v-card>
    </div>

    <section title="Task Order Summary Cards" role="region">
      <atat-summary-card
        v-if="cardsData.cards.length > 0"
        :data="cardsData"
        v-on:delete="onDeleteTaskOrder"
        v-on:edit="onEditTaskOrder"
        return-focus-element-id-ok="AddTaskOrderButton"
      ></atat-summary-card>

      <v-btn
        class="primary mb-10"
        :ripple="false"
        @click="onAddNewTaskOrder"
        role="link"
        id="AddTaskOrderButton"
      >
        <v-icon aria-hidden="true">control_point</v-icon>
        <div class="ml-2">Add a Task Order</div>
      </v-btn>
    </section>

    <section title="Task Order FAQs" class="content-max-width" role="region">
      <expandable-link aria-id="TaskOrderFAQ1">
        <template v-slot:header>
          Can I add additional funding sources after my portfolio is
          provisioned?
        </template>
        <template v-slot:content>
          <p>
            Yes. As the Portfolio Manager, you will be able add CLINs to
            existing task orders or add a new task order in the future. This
            will allow you to continue funding the applications in this
            portfolio after the period of performance has expired or after
            obligated funds have been exhausted.
          </p>
          <p>
            You will have the opportunity to invite other Portfolio Managers to
            help you manage funding for this portfolio later.
          </p>
        </template>
      </expandable-link>
      <expandable-link aria-id="TaskOrderFAQ2">
        <template v-slot:header>
          What happens to my portfolio if the period of performance or obligated
          funds expire?
        </template>
        <template v-slot:content>
          <p>
            If your portfolio's period of performance expires or if you run out
            of obligated funds, your team members will not be able to access
            your applications within the CSP console.
          </p>
          <p>
            We will notify you when your funding sources are in danger of
            expiration, so that you have ample time to take action.
          </p>
        </template>
      </expandable-link>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ATATSummaryCardItem,
  ATATSummaryCards,
  TaskOrderModel,
} from "../../../../../types/Wizard";
import { Component } from "vue-property-decorator";
import { addfunding, editfunding } from "@/router/wizard";
import ExpandableLink from "@/components/ExpandableLink.vue";
import TaskOrderModuleData from "@/mixins/TaskOrderModuleData";
import { mixins } from "vue-class-component";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({
  components: {
    ExpandableLink,
  },
})
export default class Step2Summary extends mixins(TaskOrderModuleData) {
  private async mounted(): Promise<void> {
    this.transformData();
    if (this.isArrivedFromStep5) {
      this.$store.dispatch("wizard/setReturnToReview", true);
      this.isReturnToReview = true;
    }
  }

  private isReturnToReview = false;
  private isArrivedFromStep5 = this.$store.getters["wizard/isArrivedFromStep5"];
  private cardType = "Task Orders";
  private cardsData: ATATSummaryCards = {
    cards: [],
  };

  async onDeleteTaskOrder(id: string): Promise<void> {
    await this.$store.dispatch("wizard/deleteTaskOrder", id);

    if (this.taskOrders.length === 0) {
      //route the user back to add funding step
      await this.$store.dispatch("wizard/addNewTaskOrder");
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
    this.$store.dispatch("wizard/editTaskOrder", id);
    this.$store.dispatch("wizard/setReturnToReview", false);

    this.$router.push({
      name: editfunding.name,
      params: {
        id: id,
      },
    });
  }

  async onAddNewTaskOrder(id: string): Promise<void> {
    await this.$store.dispatch("wizard/addNewTaskOrder");
    this.$store.dispatch("wizard/setReturnToReview", false);
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
            value: this.formatCurrency(totalClinValue),
          },
          {
            title: "Obligated Funds",
            prefix: "$",
            value: this.formatCurrency(totalObligatedFunds),
          },
        ],
        leftButtonText: "Edit",
        rightButtonText: "Delete",
      };
      this.cardsData.cards.push(card);
    }, this);
  }

  public formatCurrency(value: number): string {
    return value
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
