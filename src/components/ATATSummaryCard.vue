<template>
  <div class="d-flex align-start">
    <v-card
      width="40rem"
      class="v-card ma-9 ml-0 body"
      v-for="(card, index) in data.cards"
      :key="index"
    >
      <v-card-title class="d-flex justify-space-between align-start pa-6 pb-5">
        <div>
          <div class="type body" v-if="card.type">
            {{ card.type }}
          </div>
          <!-- todo configure this link for the title  -->
          <div class="d-flex align-start">
            <v-btn
              href="www.google.com"
              :id="'header_link_' + index"
              :ripple="false"
              small
              class="h3 link-button no-focus-shift pa-0"
            >
              <div class="font-weight-bold">
                <div>{{ card.title }}</div>
              </div>
            </v-btn>
            <v-btn
              small
              :ripple="false"
              class="
                no-focus-shift
                pa-0
                no-text-decoration no-border
                link-button
                mx-n2
              "
              ><v-icon v-if="card.showChevronRight" x-large>
                chevron_right
              </v-icon>
            </v-btn>
          </div>
        </div>
        <div>
          <v-icon color="success"> check_circle </v-icon>
        </div>
      </v-card-title>
      <v-card-subtitle class="body" v-if="card.description">
        {{ card.description }}
      </v-card-subtitle>

      <v-card-text class="mx-0 px-6">
        <div
          class="body-lg d-flex justify-space-between black--text grouped-items"
          v-for="(item, idx) in card.items"
          :key="idx"
        >
          <div class="ml-4">{{ item.title }}</div>
          <div v-if="item.value">
            <div>{{ item.prefix }}&nbsp;{{ item.value }}</div>
          </div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-space-between pa-0">
        <v-btn
          class="
            link-button
            no-focus-shift
            link-body-md
            text-uppercase
            my-4
            mx-6
            pa-0
          "
          small
          :id="card.leftButtonText + '_' + index"
          :ripple="false"
          >{{ card.leftButtonText }}</v-btn
        >
        <v-btn
          class="
            link-button
            no-focus-shift
            link-body-md
            text-uppercase
            my-4
            mx-6
            pa-0
          "
          small
          @click="deleteClicked(card.title)"
          :ripple="false"
          :id="card.rightButtonText + '_' + (index + 1)"
          >{{ card.rightButtonText }}</v-btn
        >
      </v-card-actions>
    </v-card>
    <atat-modal-delete
      :showDialog.sync="showDialog"
      :title="dialogTitle"
      :message="dialogMessage"
      cancelText="Cancel"
      okText="Delete Task Order"
      width="450px"
    />
  </div>
</template>

<script lang="ts">
import { ATATSummaryCards } from "types/Wizard";
import { Component, Prop, Emit } from "vue-property-decorator";
import { VCard } from "vuetify/lib";

@Component({})
export default class ATATSummaryCard extends VCard {
  @Prop({ default: {}, required: false })
  private data!: ATATSummaryCards;

  @Emit()
  private clickedAction(actions: string[]): string[] {
    return actions;
  }

  private showDialog = false;
  private dialogTitle = "";
  private dialogMessage = "";

  private deleteClicked(taskOrder: string): void {
    this.dialogTitle = "Delete Task Order " + taskOrder + "?";
    this.dialogMessage =
      "This Task Order will be permanently removed from your ATAT Portfolio. Any funding details you added will not be saved.";

    this.showDialog = true;
  }
}
</script>
