<template>
  <div>
    hola {{isDialogVisible}}
  <v-dialog
    v-model="isDialogVisible"
    max-width="600px"
    persistent
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
        <ATATTextField label="Email address" :messages="['Messages']">
          Email address
        </ATATTextField>
        <br />
        <v-btn class="link-body-md">Add another portfolio manager</v-btn>
        <br /><br />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="doCancel()"> Close </v-btn>
        <v-btn color="primary" text @click="doSave()"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";

export interface KeyValuePair {
  (key: string): any;
}

export interface ActionObject {
  action: string;
  data: KeyValuePair[];
}

@Component({
  components: { ATATTextField },
})
export default class PermissionsModal extends Vue {
  @Prop() private isDialogVisible!: boolean;

  @Emit()
  private modalAction(
    action: string,
    data: KeyValuePair[] = []
  ): ActionObject {

    console.log("clickedAction in")
    return {
      action,
      data,
    };
  }

  private doCancel(): void {
    // do something
    // emit action and object
    console.log("doCancel")
    this.modalAction("cancel");
  }
  private doSave(): void {
    // do something
    // emit action and object
    console.log("doSave")
    this.modalAction("save");
  }
}
</script>
