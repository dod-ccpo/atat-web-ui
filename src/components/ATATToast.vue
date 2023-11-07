<template>
<!--  TODO figure out why this component has two location props-->
  <v-snackbar
    v-model="isToastOpen"
    location="top"
    transition="slide-x-reverse-transition"
    class="_atat-toast"
    :class="[
      '_toast-' + toast.type, 
      { '_has-icon': toast.hasIcon },
      { '_has-undo': toast.hasUndo },     
    ]"
    :timeout="getTimeout"
  >
    <div v-html="toast.message"></div>
    <!--TODO: validate that this still works after removal of slot action-->
    <template v-if="toast.hasUndo">
      <v-btn
        variant="text"
        @click="onUndo"
      >
        Undo
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Watch, toNative } from "vue-facing-decorator";
import Toast from "@/store/toast"

@Component({
  emits:["toast-undo"]
})
class ATATToast extends Vue {
  private toast = Toast.toast;

  private isOpen = false;
  set isToastOpen(isOpen: boolean) {
    this.isOpen = isOpen;
  }
  get isToastOpen(): boolean {
    return Toast.toast.isOpen;
  }

  public timeout = 0;

  @Watch("isToastOpen")
  public setToast(isOpen: boolean): void {
    clearTimeout(this.timeout);
    this.$nextTick(() => {
      this.isOpen = isOpen;
      this.timeout = window.setTimeout(() => {
        Toast.doSetToastClosed();
      }, this.getTimeout);
    });
  }

  private onUndo(): void {
    this.$emit("toast-undo");
  }

  get getTimeout(): number {
    let timeout = 3;
    
    // add an extra second for every 120 chars
    if (this.toast.message) {
      const textLength = this.toast.message.length;
      const extraTime: number = Math.floor(textLength / 120);
      timeout += extraTime;
    }
    
    // add 2 seconds if there is an "Undo" link
    timeout += this.toast.hasUndo ? 2 : 0;

    return timeout * 1000;
  }
}
export default toNative(ATATToast)
</script>
