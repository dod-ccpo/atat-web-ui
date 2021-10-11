<template>
  <v-snackbar
    v-model="toast.isDisplayed"
    :class="toast.contentClass"
    :timeout="3000"
    light
    top
    right
    transition="scroll-y-reverse-transition"
  >
    {{ toast.message }}
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";
import { Toast } from "types/Global";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class ATATToast extends Vue {
  get toast(): Toast {
    return this.$store.state.toast;
  }
}
</script>
