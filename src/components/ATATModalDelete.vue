<template>
  <v-dialog
    :max-width="width"
    v-model="_showDialog"
    role="dialog"
    aria-labelledby="dialogTitle"
    aria-describedby="dialogMessage"
  >
    <v-card>
      <v-card-title class="h3 text-break" id="dialogTitle">
        {{ title }}
      </v-card-title>
      <v-card-text class="body-lg black--text" id="dialogMessage">
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
import { Component, PropSync, Prop } from "vue-property-decorator";
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

// EJY pass props for cancel focus and OK focus

  @PropSync("isItemDeleted")
  private _isItemDeleted!: boolean;

  @PropSync("showDialogWhenClicked")
  private _showDialog!: boolean;

  private cancelItem() {
    this._showDialog = false;
    this._isItemDeleted = false;
    // ejy DRY this - move to mixin?
    this.$nextTick(() => {
      // const openerId = this.$store.state.returnFocusId;
      if (this.focusOnCancel !== "") {
        document.getElementById(this.focusOnCancel)?.focus();
        this.$store.state.returnFocusId = "";
      } else {
        const h1 = document.getElementsByTagName("h1");
        if (h1.length) {
          h1[0].focus();
        }
      }
    });
  }

  private deleteItem() {
    this._showDialog = false;
    this._isItemDeleted = true;
    this.$emit("delete");
    this.$nextTick(() => {
      // this works for member deletion, but not application/task order deletion.
      // it fires before the app/TO is removed from the DOM, so it focuses
      // for a moment on the "Delete" button on the cards before the card is removed.
      // need better solution.
      // const openerId = this.$store.state.returnFocusId;
      if (this.focusOnOk !== "") {
        const focusEl = document.getElementById(this.focusOnOk);
        if (focusEl) {
          focusEl.focus();
        } else {
          const h1 = document.getElementsByTagName("h1");
          if (h1.length) {
            h1[0].focus();
          }
        }
      }
      this.$store.state.returnFocusId = "";
    });
  }
}
</script>
