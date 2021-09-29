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
          class="v-card ma-9 ml-0 body"
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
                  class="h3 link-button no-focus-shift pa-0"
                  :class="{ 'no-border': card.type === 'APPLICATION' }"
                >
                  <div class="font-weight-bold">
                    {{ truncateText(card.title, 23) }}
                  </div>
                </v-btn>
                <v-btn
                  small
                  :ripple="false"
                  @click="leftButtonClicked(card)"
                  class="
                    no-focus-shift
                    pa-0
                    no-text-decoration no-border
                    link-button
                    mx-n2
                  "
                >
                  <v-icon v-if="card.showChevronRight" x-large>
                    chevron_right
                  </v-icon>
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
              @click="rightButtonClicked(card)"
              :ripple="false"
              :id="card.rightButtonText + '_' + (index + 1)"
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
    />
  </div>
</template>

<script lang="ts">
import { ATATSummaryCardItem, ATATSummaryCards } from "types/Wizard";
import { Component, Emit, Prop, PropSync, Watch } from "vue-property-decorator";
import Vue from "vue";

@Component({})
export default class ATATSummaryCard extends Vue {
  @Prop({ default: {}, required: false }) private data!: ATATSummaryCards;

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
      this._itemToDelete = newVal
        ? this.cardSelected.title || ""
        : (this._itemToDelete = "");
    }
  }

  //todo add this as a global function....
  private truncateText(word: string, limit: number): string {
    if (word.length > limit) {
      return word.substring(0, limit - 1) + "...";
    }
    return word;
  }

  private leftButtonClicked(card: ATATSummaryCardItem) {
    this.cardSelected = card;
    let id = card.title;
    switch (this.$route.name) {
      case "fundingsummary":
        this.$router.push({ name: "editfunding", params: { id: `${id}` } });
        break;
      case "applicationsummary":
        id = card.id;
        this.$router.push({
          name: "editapplication",
          params: { id: `${id}` },
        });
        break;
      default:
      // code block
    }

    if (card.type === "PORTFOLIO") {
      id = card.id;
    }

    //emit edit event
    this.$emit("edit", id);
  }

  private rightButtonClicked(card: ATATSummaryCardItem): void {
    this.isItemDeleted = false;
    this.cardSelected = card;
    if (card.type === "TASK ORDER") {
      this.message = "You currently don't have any Task Orders saved";
      this.dialogTitle = `Delete Task Order ${card.title}`;
      this.dialogMessage = `This Task Order will be permanently removed from your ATAT Portfolio. Any funding details you added will not be saved`;
    }

    if (card.type === "APPLICATION") {
      this.message = "You currently don't have any Applications created";
      this.dialogTitle = `Delete '${card.title}' from your portfolio?`;
      this.dialogMessage = `This application will be permanently removed from your ATAT Portfolio. Any environment details you added will not be saved.`;
    }

    if (card.type === "PORTFOLIO") {
      this.message = "You're removing your portfolio";
      this.dialogTitle = `Delete  '${card.title}' from your portfolio drafts`;
      this.dialogMessage = `This portfolio and any details you added will be permanently removed`;
    }
    this.showDialogWhenClicked = true;
  }

  @Emit("delete")
  private onDelete(): string {
    return this.cardSelected.id || "";
  }
}
</script>
