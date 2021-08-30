<template>
  <div class="d-flex align-start">
    <v-card
      v-show="data.cards.length === 0"
      width="100rem"
      class="v-card ma-9 ml-0 body"
    >
      <v-card-text
        height="3px"
        class="h5 d-flex justify-center align-center optional"
        >You currently don't have any {{ emptyCard }} saved</v-card-text
      >
    </v-card>
    <v-card
      v-show="data.cards.length > 0"
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
          <div class="d-flex align-start">
            <v-btn
              :id="'header_link_' + index"
              :ripple="false"
              @click="leftButtonClicked(card)"
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
            pa-0
          "
          small
          @click="rightButtonClicked(card)"
          :ripple="false"
          :id="card.rightButtonText + '_' + (index + 1)"
          >{{ card.rightButtonText }}</v-btn
        >
      </v-card-actions>
    </v-card>
    <atat-modal-delete
      v-show="hasDialog"
      :showDialogWhenClicked.sync="showDialogWhenClicked"
      :title="dialogTitle"
      :message="dialogMessage"
      :cancelText="cancelText"
      persistent
      no-click-animation
      :okText="okText"
      :width="dialogWidth + 'px'"
    />
  </div>
</template>

<script lang="ts">
import { ATATSummaryCardItem, ATATSummaryCards } from "types/Wizard";
import { Component, Prop, Emit } from "vue-property-decorator";
import { VCard } from "vuetify/lib";

@Component({})
export default class ATATSummaryCard extends VCard {
  @Prop({ default: {}, required: false }) private data!: ATATSummaryCards;

  @Prop({ default: "" })
  private emptyCard!: string;

  @Prop({ default: "Dialog Title" })
  private dialogTitle!: string;

  @Prop({ default: "Dialog Message" })
  private dialogMessage!: string;

  @Prop({ default: "OK" })
  private okText!: string;

  @Prop({ default: "Cancel" })
  private cancelText!: string;

  @Prop({ default: true })
  private hasDialog!: boolean;

  @Prop({ default: "450" })
  private dialogWidth!: string;

  private showDialogWhenClicked = false;

  // these stubbed in events will have to emit back to the parent
  // might be easier to emit these directly from @click event like this.
  // @click="$emit('update:value', $event.target.value)"
  // @Emit()
  // private titleClick(card: ATATSummaryCardItem) {
  //   return true;
  // }

  private leftButtonClicked(card: ATATSummaryCardItem) {
    let id = card.title;
    switch (this.$route.name) {
      case "fundingsummary":
        this.$router.push({ name: "editfunding", params: { id: `${id}` } });
        break;
      case "applicationsummary":
        this.$router.push({
          name: "editapplication",
          params: { id: `${id}` },
        });
        break;
      default:
      // code block
    }
  }
  @Emit()
  private rightButtonClicked(card: ATATSummaryCardItem) {
    if (card.type === "TASK ORDER") {
      this.dialogTitle = this.dialogMessage = `Delete Task Order ${card.title}`;
      this.dialogMessage = `This Task Order will be permanently removed from your ATAT Portfolio. Any funding details you added will not be saved`;
    }
    this.showDialogWhenClicked = true;
    return true;
  }
}
</script>
