<template>
  <v-dialog
    v-model="isDialogVisible"
    max-width="500px"
    class="portfolio-managers-modal"
  >
    <v-card>
      <v-card-title> Invite Portfolio Manager </v-card-title>
      <v-card-text>
        <p>
          Portfolio Managers can have different levels of access based on their
          roles within your organization. Invite multiple people with the same
          permissions at once.
        </p>
        <br />
        <ATATTextField>Email address</ATATTextField>
        <br />
        <v-btn class="link-body-md">Add another portfolio manager</v-btn>
        <br /><br />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="dialog2 = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: { ATATTextField },
})
export default class PermissionsModal extends Vue {
  @Prop() isDialogVisible = true;

  private doCancel(): void {
    // do something
    // emit action and object
  }
  private doSave(): void {
    // do something
    // emit action and object
  }
}
</script>
