<template>
  <v-dialog
    :max-width="width"
    v-model="_showDialog"
    role="alertdialog"
    aria-labelledby="modalDeleteTitle"
    aria-describedby="modalDeleteMessage"
  >
    <v-card>
      <v-card-title class="h2 text-break" id="modalDeleteTitle" tabindex="-1">
        {{ getTitle }}
      </v-card-title>
      <v-card-text class="body-lg black--text mb-7" id="modalDeleteMessage">
        {{ message }}
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          class="link-button no-focus-shift"
          :ripple="false"
          @click="cancelItem"
          id="dialog_cancel"
          name="cancelDialog"
          >{{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          class="px-5"
          :ripple="false"
          id="dialog_ok"
          @click="deleteItem"
        >
          <!-- todo will have to emit OK event back to the parent  -->
          {{ okText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Watch } from "vue-property-decorator";
import { VDialog } from "vuetify/lib";
import Vue from "vue";

@Component({})
export default class ATATModalDelete extends Vue {
  @Prop() private message!: string;
  @Prop() private title!: string;
  @Prop() private id!: string;
  @Prop({ default: "500px" }) private width!: string;
  @Prop({ default: "Cancel" }) private cancelText!: string;
  @Prop({ default: "OK" }) private okText!: string;
  @Prop() private focusOnCancel!: string;
  @Prop() private focusOnOk!: string;

  @PropSync("isItemDeleted")
  private _isItemDeleted!: boolean;

  @PropSync("showDialogWhenClicked")
  private _showDialog!: boolean;

  @Watch("showDialogWhenClicked")
  setFocus(newVal: boolean): void {
    if (newVal) {
      this.$nextTick(() => {
        setTimeout(function () {
          document.getElementById("modalDeleteTitle")?.focus();
        }, 100);
      });
    }
  }

  get getTitle(): string {
    if (this.title && this.title.length > 60) {
      return this.title.substring(0, 60) + "...”?";
    }
    return this.title;
  }

  private cancelItem() {
    this._showDialog = false;
    this._isItemDeleted = false;
    this.returnFocus(this.focusOnCancel);
  }

  private deleteItem() {
    this._showDialog = false;
    this._isItemDeleted = true;
    this.$emit("delete");
    this.returnFocus(this.focusOnOk);
  }
  private returnFocus(elementId: string): void {
    this.$nextTick(() => {
      const focusEl =
        document.getElementById(elementId) ||
        document.getElementsByTagName("h1")[0];
      focusEl?.focus();
    });
  }
}
</script>
