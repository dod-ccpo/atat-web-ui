<template>
  <div class="portfolio-managers-modal">
    hola {{ isDialogVisible }}
    <v-dialog
      v-model="isDialogVisible"
      max-width="800px"
      persistent
      content-class="v-dialog v-dialog--active v-dialog--persistent portfolio-managers-modal-dialog"
      class="portfolio-managers-modal-dialog"
    >
      <v-card>
        <v-card-title>
          <h2 class="h2">Invite Portfolio Manager</h2>
          <p>
            Portfolio Managers can have different levels of access based on
            their roles within your organization. Invite multiple people with
            the same permissions at once.
          </p>
          <br />
        </v-card-title>
        <v-card-text>
          <ATATTextField label="Email address" :messages="['Messages']">
            Email address
          </ATATTextField>
          <br />
          <v-btn class="link-body-md" :ripple="false">
            Add another portfolio manager
          </v-btn>
          <br /><br />
          <h3 class="h3">Portfolio Permissions</h3>
          <div class="permissions-set-list">
            <div class="permission-set-checkbox">
              <v-checkbox
                class="ma-0 pa-0"
                :ripple="false"
                label="Edit Funding"
              />
              <p>Can add or modify Task Orders to fund this Portfolio</p>
            </div>
            <div class="permission-set-checkbox">
              <v-checkbox
                class="ma-0 pa-0"
                :ripple="false"
                label="Edit Funding"
              />
              <p>Can add or modify Task Orders to fund this Portfolio</p>
            </div>
            <div class="permission-set-checkbox">
              <v-checkbox
                class="ma-0 pa-0"
                :ripple="false"
                label="Edit Funding"
              />
              <p>Can add or modify Task Orders to fund this Portfolio</p>
            </div>
            <div class="permission-set-checkbox">
              <v-checkbox
                class="ma-0 pa-0"
                :ripple="false"
                label="Edit Funding"
              />
              <p>Can add or modify Task Orders to fund this Portfolio</p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="primary" text @click="doCancel()"> Close </v-btn>
          <v-btn color="primary" @click="doSave()"> Send Invitation </v-btn>
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
  @Prop({ default: true }) private isDialogVisible!: boolean;

  @Emit()
  private modalAction(action: string, data: KeyValuePair[] = []): ActionObject {
    console.log("clickedAction in");
    return {
      action,
      data,
    };
  }

  private doCancel(): void {
    // do something
    // emit action and object
    console.log("doCancel");
    this.modalAction("cancel");
  }
  private doSave(): void {
    // do something
    // emit action and object
    console.log("doSave");
    this.modalAction("save");
  }
}
</script>

<style lang="scss">
.portfolio-managers-modal-dialog {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 0;
  .v-card.v-sheet {
    padding: 16px;
    .v-card__text {
      padding: 20px 56px 40px 24px;
      overflow-x: scroll;
    }
    .v-card__actions{
      position:absolute; 
      display: flex;
      width: 100%;
      flex-direction: row;
      align-items: flex-end;
      padding: 16px 24px;
      bottom: 0; 
      left: 0px;
      background: #F0F0F0;
    }
  }
}
.permissions-set-list {
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  margin: 8px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  .permission-set-checkbox {
    border: 1px solid #005ea2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    position: static;
    box-sizing: border-box;
    border-radius: 2px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    margin: 16px 0px 0px;
  }
}
</style>
