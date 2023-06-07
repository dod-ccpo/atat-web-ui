<template>
  <ATATAlert
    id="WarningAlert"
    type="warning"
    maxWidth="900"
    class="mt-8 mb-10"
  >
    <template v-slot:content>
      <p>
        {{ alertText }}
      </p>
    </template>
  </ATATAlert>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert,
  }
})

export default class AlertForForms extends Vue {
  @Prop() private alertType!: "custom" | "suggestion";
  public get alertText(): string {
    switch(this.alertType) {
    case "custom":
      return `If you update any responses below, we’ll replace your custom 
        explanation with suggested language based on your responses. You will be 
        able to restore your custom explanation, if needed.`;
    case "suggestion":
      return `Any changes below will not automatically overwrite your edits
        to the previous suggested language. You can update your current explanation
        to a new suggestion on the next screen, if needed.`
    }
    return "";
  };

}

</script>