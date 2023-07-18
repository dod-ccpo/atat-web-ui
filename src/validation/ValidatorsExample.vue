<template>
  <v-form ref="form" lazy-validation>
    
    <a 
      class="d-block mb-10" 
      role="button" 
      id="SlideoutPanelOpener" 
      tabindex="0"
      @click="openSlideoutPanel"
      aria-label="Example slideout panel trigger"
    >
      Open slideout panel
    </a>

    <a 
      class="d-block mb-2" role="button" id="ToastOpener" tabindex="0" 
      @click="setToast('success', false, false, false)"
    >
      Open toast: success, no icon, no undo, short message
    </a>
    <a 
      class="d-block mb-2" role="button" id="ToastOpener" tabindex="0" 
      @click="setToast('success', true, true, false)"
    >
      Open toast: success, has icon, has undo, short message
    </a>
    <a 
      class="d-block mb-6" role="button" id="ToastOpener" tabindex="0" 
      @click="setToast('success', false, true, true)"
    >
      Open toast: success, no icon, has undo, long message
    </a>

    <a 
      class="d-block mb-2" role="button" id="ToastOpener" tabindex="0" 
      @click="setToast('info', false, false, false)"
    >
      Open toast: info, no icon, no undo, short message
    </a>
    <a 
      class="d-block mb-2" role="button" id="ToastOpener" tabindex="0" 
      @click="setToast('info', true, true, false)"
    >
      Open toast: info, has icon, has undo, short message
    </a>
    <a 
      class="d-block mb-10" role="button" id="ToastOpener" tabindex="0" 
      @click="setToast('info', false, true, true)"
    >
      Open toast: info, no icon, has undo, long message
    </a>



    <v-row>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.minLength(3)]"
          :value.sync="minValue"
          label="Min Length 3"
          ref="minLengthField"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.minLength(3, 'need at least than 3 chars bud')]"
          :value="minValueCustom"
          label="Min Length 3 Custom message"
          ref="minLengthCustom"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.maxLength(9)]"
          :value="maxValue"
          label="Max Length 9"
          ref="maxLengthField"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.required()]"
          :value="requiredValue"
          label="Value Required"
          ref="requiredField"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.integer()]"
          :value="integerValue"
          label="Integers only"
          ref="integerField"
      /></v-col>
      <v-col cols="7"
        ><ATATTextField
          :rules="[$validators.isEmail()]"
          :value="emailValue"
          label="Email only"
          ref="emailField"
          id='checkEmail'
      /></v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
import ATATTextField from "@/components/ATATTextField.vue";

import SampleLearnMore from "./SampleLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import Toast from "@/store/toast";

import { SlideoutPanelContent, ToastObj } from "types/Global";

@Component({
  components: {
    ATATTextField,
    SampleLearnMore,
  },
})

export default class ValidatatorsExample extends Vue {
  private minValue = "a";
  private minValueCustom = "a";
  private maxValue = "12345678910";
  private requiredValue = "";
  private integerValue = "y";
  private emailValue = ""

  private setToast(
    type: "success" | "info", 
    hasIcon: boolean, 
    hasUndo: boolean, 
    longMessage: boolean,
  ): void {
    //eslint-disable-next-line prefer-const
    let message = longMessage 
      ? `My toast with a long message to check the timing of the toast - one extra 
        second for every 120 characters so this message should add one second. `
      : "My toast message ";

    const toast: ToastObj = {
      type,
      message,
      isOpen: true,
      hasUndo,
      hasIcon,
    }

    Toast.setToast(toast);
  }

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  public async validateForm(): Promise<boolean> {
    let valid = false;

    await this.$nextTick(() => {
      valid = this.Form.validate();
    });

    return valid;
  }

  public async mounted(): Promise<void> {
    await this.validateForm();

    const slideoutPanelContent: SlideoutPanelContent = {
      component: SampleLearnMore,
      title: "Learn More 1",
    }
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

}
</script>
