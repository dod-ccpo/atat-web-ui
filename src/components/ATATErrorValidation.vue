<template>
  <div v-if="showError" :id="id" class="mt-2">
    <div
      v-for="(em, idx) in errorMsgs"
      :key="idx"
      class="d-flex justify-start atat-text-field-error"
      :class="textAreaWithCounter ? 'mt-n5' : 'mt-2'"
    >
      <div>
        <v-icon class="text-base-error icon-20 ma-1 mt-0" color="error">mdi-alert-circle</v-icon>
      </div>
      <div class="field-error ml-2 text-left" v-html="errorMessages[idx]"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component, toNative } from "vue-facing-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
@Component({
  components:{
    ATATSVGIcon
  }
})
class ATATErrorValidation extends Vue {
  @Prop({ default: () => [] }) private errorMessages!: string[];
  @Prop({ default: false }) private textAreaWithCounter!: boolean;
  @Prop({ default: false }) private showAllErrors!: boolean;
  @Prop({default: "Error"}) private id?: string;

  private errorMsgs: string[] = [];

  get showError(): boolean {
    if (!this.showAllErrors){
      this.errorMsgs = this.errorMessages.length>0 ? [this.errorMessages[0]] : [];
    } else {
      this.errorMsgs = this.errorMessages;
    }
    return this.errorMsgs?.length > 0;
  }
}
export default toNative(ATATErrorValidation)
</script>