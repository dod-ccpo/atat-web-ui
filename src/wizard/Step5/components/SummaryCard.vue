<template>
  <div class="d-flex align-start">
    <v-card class="v-card ma-9 px-2 ml-0 body">
      <v-card-title>
        <div class="width-100 d-flex justify-space-between align-center">
          <h4 class="h4">{{ title }}</h4>
          <v-btn
            class="py-0 px-2 primary--text"
            text
            small
            @click="handleClicked(editPlace)"
            :ripple="false"
            ><v-icon small class="icon-12 mr-2">edit</v-icon>
            <span class="link-body-md">Edit</span></v-btn
          >
        </div>
        <slot name="summary-description"> </slot>
      </v-card-title>
      <v-card-text class="body-lg text--base-darkest">
        <slot name="summary-body"></slot>
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
  @Prop()
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
  @Prop({ default: "" })
  public editPlace!: string;
  private showDialogWhenClicked = false;
  // these stubbed in events will have to emit back to the parent
  // might be easier to emit these directly from @click event like this.
  // @click="$emit('update:value', $event.target.value)"
  //   @Emit()
  //   private titleClick(card: ATATSummaryCardItem) {
  //     return true;
  //   }
  private handleClicked(editPlace: string) {
    this.$router.push({ name: editPlace });
  }
  //   @Emit()
  //   private rightButtonClicked(card: ATATSummaryCardItem) {
  //     this.showDialogWhenClicked = true;
  //     return true;
  //   }
}
</script>
