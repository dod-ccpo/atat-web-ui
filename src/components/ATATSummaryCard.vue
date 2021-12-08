<template>
  <div class="d-flex align-start">
    <v-card
      v-show="data.cards.length === 0"
      width="100rem"
      class="v-card ma-9 ml-0 body"
    >
      <v-card-text class="pa-4 text-center">
        <span class="body-lg text--base-dark">{{ message }}</span>
      </v-card-text>
    </v-card>
    <v-row align="stretch">
      <v-col cols="4" v-for="(card, index) in data.cards" :key="index">
        <v-card
          v-show="data.cards.length > 0"
          :width="`${cardWidth}rem`"
          class="v-card mb-8 ml-0 body"
        >
          <v-card-title
            class="d-flex justify-space-between align-start pa-6 pb-5"
          >
            <div
              class="type body"
              v-if="card.type && card.type === 'TASK ORDER'"
            >
              {{ card.type }}
            </div>
            <div class="width-90">
              <div class="d-flex align-start overflow-hidden">
                <v-btn
                  :id="'header_link_' + index"
                  :ripple="false"
                  @click="leftButtonClicked(card)"
                  small
                  class="
                    h2
                    link-button
                    no-focus-shift
                    pa-0
                    icon-after--chevron-right
                  "
                  :class="{ 'no-border': card.type === 'APPLICATION' }"
                  :aria-label="'Edit ' + card.type + ' ' + card.title"
                  role="link"
                >
                  <div class="font-weight-bold">
                    {{ truncateText(card.title, 23) }}
                  </div>
                </v-btn>
              </div>
            </div>
            <div class="width-10">
              <v-icon color="success"> check_circle </v-icon>
            </div>
          </v-card-title>
          <v-card-subtitle
            class="body-lg black--text ml-2"
            v-if="card.description"
          >
            {{ card.description }}
          </v-card-subtitle>

          <v-card-text
            class="mx-0 px-6"
            style="min-height: 125px; max-height: 125px"
          >
            <div
              class="
                body-lg
                d-flex
                justify-space-between
                black--text
                grouped-items
              "
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
                px-2
                py-0
              "
              small
              @click="leftButtonClicked(card)"
              :id="card.leftButtonText + '_' + index"
              :ripple="false"
              :aria-label="card.leftButtonText + ' ' + card.type"
              role="link"
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
                py-0
                px-2
              "
              small
              @click="
                rightButtonClicked(card, buttonId(card.rightButtonText, index))
              "
              :ripple="false"
              :id="buttonId(card.rightButtonText, index)"
              :aria-label="card.rightButtonText + ' ' + card.type"
              role="button"
              >{{ card.rightButtonText }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <atat-modal-delete
      v-show="hasDialog"
      :showDialogWhenClicked.sync="showDialogWhenClicked"
      :title="dialogTitle"
      :message="dialogMessage"
      :cancelText="cancelText"
      :isItemDeleted.sync="isItemDeleted"
      persistent
      no-click-animation
      :okText="okText"
      :width="dialogWidth + 'px'"
      v-on:delete="onDelete"
      :focus-on-cancel="returnFocusElementIdCancel"
      :focus-on-ok="returnFocusElementIdOk"
    />
  </div>
</template>

<script lang="ts">
import { ATATSummaryCardItem, ATATSummaryCards } from "types/Wizard";
import { Component, Emit, Prop, PropSync, Watch } from "vue-property-decorator";
import Vue from "vue";

@Component({})
export default class ATATSummaryCard extends Vue {
  private returnFocusElementIdCancel = "";
  @Prop({ default: "" }) private returnFocusElementIdOk!: string;

  @Prop({
    default: {
      cards: [],
    },
    required: false,
  })
  private data!: ATATSummaryCards;

  @Prop({ default: "" })
  private emptyCard!: string;

  @Prop({ default: "40" })
  private cardWidth!: string;

  @Prop({ default: "OK" })
  private okText!: string;

  @Prop({ default: "Cancel" })
  private cancelText!: string;

  @Prop({ default: true })
  private hasDialog!: boolean;

  @Prop({ default: "450" })
  private dialogWidth!: string;

  @PropSync("itemToDelete")
  private _itemToDelete!: string;

  private isItemDeleted = false;
  private dialogMessage = "";
  private dialogTitle = "";
  private showDialogWhenClicked = false;
  private cardSelected: ATATSummaryCardItem = {};
  private message = "";

  @Watch("isItemDeleted")
  protected deleteItem(newVal: string): void {
    if (newVal !== "") {
      this._itemToDelete = newVal ? this.cardSelected.title || "" : "";
    }
  }

  //todo add this as a global function....
  private truncateText(word: string, limit: number): string {
    if (word.length > limit) {
      return word.substring(0, limit - 1) + "...";
    }
    return word;
  }

  private buttonId(buttonText: string, index: number) {
    return buttonText + "_" + (index + 1);
  }

  private leftButtonClicked(card: ATATSummaryCardItem) {
    this.cardSelected = card;
    //emit edit event
    this.$emit("edit", card.id);
  }

  private rightButtonClicked(
    card: ATATSummaryCardItem,
    buttonId: string
  ): void {
    this.isItemDeleted = false;
    this.cardSelected = card;
    if (card.type === "TASK ORDER") {
      this.message = "You currently don't have any task orders saved";
      this.dialogTitle = `Delete Task Order ${card.title}?`;
      this.dialogMessage = `This task order will be permanently removed from your ATAT portfolio. Any funding details you added will not be saved.`;
    }

    if (card.type === "APPLICATION") {
      this.message = "You currently don't have any applications created";
      this.dialogTitle = `Delete '${card.title}' from your portfolio?`;
      this.dialogMessage = `This application will be permanently removed from your ATAT portfolio. Any environment details you added will not be saved.`;
    }

    this.returnFocusElementIdCancel = buttonId;
    this.showDialogWhenClicked = true;
  }

  @Emit("delete")
  private onDelete(): string {
    return this.cardSelected.id || "";
  }
}
</script>
