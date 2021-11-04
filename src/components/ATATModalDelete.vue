<template>
  <v-dialog :max-width="width" v-model="_showDialog">
    <v-card>
      <v-card-title class="h3 text-break">{{ title }}</v-card-title>
      <v-card-text class="body-lg black--text">
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

  @PropSync("isItemDeleted")
  private _isItemDeleted!: boolean;

  @PropSync("showDialogWhenClicked")
  private _showDialog!: boolean;

  private cancelItem() {
    this._showDialog = false;
    this._isItemDeleted = false;
    this.$nextTick(() => {
      const openerId = this.$store.state.returnFocusId;
      if (openerId !== "") {
        document.getElementById(openerId)?.focus();
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
      this.$store.state.returnFocusId = "";
      const h1 = document.getElementsByTagName("h1");
      if (h1.length) {
        h1[0].focus();
      }
    });
  }
}
</script>
