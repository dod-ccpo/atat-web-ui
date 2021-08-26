<template>
  <div class="d-flex align-start">
    <v-card width="60rem" class="v-card ma-9 px-2 ml-0 body">
      <v-card-title>
        <div class="width-100 d-flex justify-space-between align-center">
          <h4 class="h4">{{ title }}</h4>
          <v-btn class="pa-0 primary--text" text small :ripple="false"
            ><v-icon small class="icon-12 mr-2">edit</v-icon>
            <span class="link-body-md">Edit</span></v-btn
          >
        </div>
        <p class="body width-80">
          {{ description }}
        </p>
      </v-card-title>
      <v-card-text class="body-lg text--base-darkest">
        <!-- <v-container fluid>
          <v-row class="border-0 border-left-4 border-accent-cool border-solid">
            <v-col cols="3"><strong>Funded by</strong></v-col>
            <v-col cols="6">Air Force, Marine Corps</v-col>
          </v-row>
          <v-row class="border-0 border-left-4 border-accent-cool border-solid">
            <v-col cols="3"><strong>Deploy to</strong></v-col>
            <v-col cols="6">CSP 1</v-col>
          </v-row>
        </v-container> -->
        <table
          class="
            body-lg
            black--text
            border-0 border-solid border-l-4 border-accent-cool
            pl-2
            width-60
          "
        >
          <tr v-for="(item, idx) in items" :key="idx">
            <td v-if="item.value" class="pr-4">
              <strong>{{ item.prefix }}</strong>
            </td>
            <td class="text-left" v-if="item.value">
              {{ item.value }}
            </td>
          </tr>
        </table>
      </v-card-text>
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
import { Component, Prop } from "vue-property-decorator";
import { VCard } from "vuetify/lib";

@Component({})
export default class SummaryCard extends VCard {
  @Prop({ default: "Title" })
  private title!: string;

  @Prop({ default: "Description" })
  private description!: string;

  @Prop({ default: [] })
  private items!: Array<Record<string, unknown>>;

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
  //   @Emit()
  //   private titleClick(card: ATATSummaryCardItem) {
  //     return true;
  //   }

  //   @Emit()
  //   private leftButtonClicked(card: ATATSummaryCardItem) {
  //     return true;
  //   }

  //   @Emit()
  //   private rightButtonClicked(card: ATATSummaryCardItem) {
  //     this.showDialogWhenClicked = true;
  //     return true;
  //   }
}
</script>
