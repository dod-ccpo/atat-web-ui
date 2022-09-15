<template>
  <v-dialog
    :max-width="width + 'px'"
    v-model="_showDialog"
    role="alertdialog"
    aria-labelledby="modalDialogTitle"
    aria-describedby="modalDialogMessage"
    id="ATATDialog"
    ref="atatDialog"
    style="background-color: red !important;"
  >
    <v-card>
      <v-card-title class="h2 text-break" id="modalDialogTitle" tabindex="-1">
        {{ getTitle }}
      </v-card-title>
      <v-card-text class="body-lg black--text px-10" id="modalDialogMessage">
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          class="link-button no-focus-shift"
          :ripple="false"
          @click="onCancel"
          id="dialog_cancel"
          name="cancelDialog"
        >{{ cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          :ripple="false"
          id="dialog_ok"
          :disabled="OKDisabled"
          @click="onOK"
        >
          {{ okText }}
        </v-btn>
      </v-card-actions>

      <!-- modal slideout -->
      <v-navigation-drawer
        id="ModalSlideout"
        v-if="modalSlideoutComponent"
        v-model="_modalDrawerIsOpen"
        absolute
        temporary
        right
        width="100%"
        transition="slide-x-reverse-transition"
      >
        <v-card elevation="0">
          <v-card-title v-if="modalSlideoutTitle">
            <v-btn 
              id="ModalSlideoutCloser"
              class="_icon-only mr-2"
              @click="closeModalDrawer"
              @keydown.enter="closeModalDrawer"
              @keydown.space="closeModalDrawer"
            >
              <ATATSVGIcon
                name="arrowBack"
                width="16"
                height="16"
              />
            </v-btn>
            <h2 id="ModalSlideoutTitle">{{ modalSlideoutTitle}}</h2>
          </v-card-title>
          <v-card-text id="ModalSlideoutContent" class="body text-base-darker pt-6">
            <component :is="modalSlideoutComponent" />
          </v-card-text>
        </v-card>
      </v-navigation-drawer>
      <!-- end modal slideout -->   

    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Prop, PropSync} from "vue-property-decorator";
import Vue from "vue";
import { Component as VueComponent } from "vue";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class ATATDialog extends Vue {
  @Prop() private title!: string;
  @Prop({default: "500px"}) private width!: string;
  @Prop({default: "Cancel"}) private cancelText!: string;
  @Prop({default: "OK"}) private okText!: string;
  @Prop() private focusOnCancel!: string;
  @Prop() private focusOnOk!: string;
  @Prop({ default: false }) private OKDisabled!: boolean;
  @Prop({ default: false }) private truncate!: boolean;

  @Prop() private modalSlideoutTitle?: string;
  @Prop() modalSlideoutComponent?: VueComponent;

  @PropSync("showDialog") private _showDialog!: boolean;
  @PropSync("modalDrawerIsOpen") public _modalDrawerIsOpen!: boolean;

  get getTitle(): string {
    if(this.truncate){
      if (this.title && this.title.length > 60) {
        return this.title.substring(0, 60) + "...";
      }
    }
    return this.title;
  }

  private onCancel() {
    this.$emit("cancelClicked");
    this._showDialog = false;
    this.returnFocus(this.focusOnCancel);
  }

  private onOK() {
    this.$emit("ok");
    this._showDialog = false;
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

  private closeModalDrawer(): void {
    this._modalDrawerIsOpen = false;
  }
}
</script>
