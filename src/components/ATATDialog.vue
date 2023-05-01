<template>
  <v-dialog
    :max-width="width + 'px'"
    v-model="_showDialog"
    eager
    role="alertdialog"
    :aria-labelledby="modalTitleId"
    :aria-describedby="modalMessageId"
    :id="'ATATDialog_' + id"
    ref="atatDialog"
    :persistent="disableClickingOutside"
    @click:outside="outsideClicked"
  >
    <v-card :id="id" :class="modalClass">
      <v-card-title class="h2 text-break" :id="modalTitleId" tabindex="-1">
        {{ getTitle }}
      </v-card-title>
      <v-card-text class="body-lg black--text px-10" :id="modalMessageId">
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          class="link-button no-focus-shift"
          :ripple="false"
          @click="onCancel"
          :id="cancelButtonId"
          name="cancelDialog"
        >{{ cancelText }}
        </v-btn>
        <v-btn
          v-if="!hideOkButton"
          :color="buttonColor"
          :ripple="false"
          :id="okButtonId"
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
          <v-card-title v-if="modalSlideoutTitle" class="d-flex">
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
  @Prop() private message!: string;
  @Prop({default: "Dialog-Title"}) private title!: string;
  @Prop({ default: "ATATModalContent"}) private id!: string;
  @Prop({default: "500px"}) private width!: string;
  @Prop({default: "Cancel"}) private cancelText!: string;
  @Prop({default: "dialog_cancel"}) private cancelButtonId?: string;
  @Prop({default: "OK"}) private okText!: string;
  @Prop({default: "dialog_ok"}) private okButtonId?: string;
  @Prop() private focusOnCancel!: string;
  @Prop() private focusOnOk!: string;
  @Prop({ default: false }) private OKDisabled!: boolean;
  @Prop({ default: false }) private hideOkButton!: boolean;
  @Prop({ default: false }) private truncate!: boolean;
  @Prop({ default: "primary" }) private buttonColor?: string;
  @Prop({ default: false }) private disableClickingOutside?: boolean;
  @Prop() private modalSlideoutTitle?: string;
  @Prop() modalSlideoutComponent?: VueComponent;
  @Prop() modalClass?: string;

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

  public get modalTitleId(): string {
    return this.id + "Title";
  }

  public get modalMessageId(): string {
    return this.id + "Message";
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

  private outsideClicked() {
    if(!this.disableClickingOutside){
      this.onCancel();
    }
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
