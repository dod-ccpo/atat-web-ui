<template>
  <div class="portfolio-managers-modal">
    hola {{ isDialogOpen }}
    <v-dialog
      v-model="isDialogOpen"
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
          <pre class="">
              listManagers: {{ listManagers }}
              currentManagerEmail: {{ currentManagerEmail }}
              currentPermisionsSet: {{ currentPermisionsSet }}
          </pre>
          <label class="">Email address</label>
          <v-text-field
            outlined
            dense
            height="42"
            :messages="['Messages']"
            v-model="currentManagerEmail"
            placeholder="add e-mail"
            hide-details="true"
            class="invite-portfolio-manager-email"
          >
          </v-text-field>
          <v-btn
            class="add-portfolio-manager-email link-button body-lg"
            :ripple="false"
          >
            <v-icon class="add-portfolio-manager-email__icon" left>
              mdi-plus-circle-outline
            </v-icon>
            <strong> Add another portfolio manager </strong>
          </v-btn>
          <br /><br />
          <h3 class="h3">Portfolio Permissions</h3>
          <div class="permissions-set-list">
            <div class="permission-set-checkbox">
              <v-checkbox
                class="ma-0 pa-0"
                :ripple="false"
                label="Edit Funding"
                value="EDIT_TASK_ORDER"
                hide-details="true"
                v-model="currentPermisionsSet"
              />
              <p class="permission-set-description">
                Can add or modify Task Orders to fund this Portfolio
              </p>
            </div>
            <div class="permission-set-checkbox">
              <v-checkbox
                class="ma-0 pa-0"
                :ripple="false"
                label="Edit Application"
                value="EDIT_APPLICATION"
                hide-details="true"
                v-model="currentPermisionsSet"
              />
              <p class="permission-set-description">
                Can create, edit and remove Applications in this Portfolio
              </p>
            </div>
            <div class="permission-set-checkbox">
              <v-checkbox
                class="ma-0 pa-0"
                :ripple="false"
                label="Manage Reporting"
                value="VIEW_PORTFOLIO_FUNDING"
                hide-details="true"
                v-model="currentPermisionsSet"
              />
              <p class="permission-set-description">
                Can view and export reports about this Portfolio’s funding and
                expenditures
              </p>
            </div>
            <div class="permission-set-checkbox">
              <v-checkbox
                class="ma-0 pa-0"
                :ripple="false"
                label="Edit Portfolio"
                value="EDIT_PORTFOLIO_POC"
                hide-details="true"
                v-model="currentPermisionsSet"
              />
              <p class="permission-set-description">
                Can update Portfolio settings, add Portfolio Managers and delete
                this Portfolio <br />
                NOTE: The option to delete this Portfolio will only be available
                as a draft. A Portfolio cannot be removed from ATAT after it has
                been provisioned.
              </p>
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

export interface Manager {
  name?: string;
  email: string;
  permissionSets?: string[];
}

export interface PortfolioManagers {
  portfolioID?: string;
  managers: Manager[];
}

@Component({
  components: { ATATTextField },
})
export default class PermissionsModal extends Vue {
  @Prop({ default: false }) private isDialogOpen!: boolean;

  private portfolioID = "ptfl-00001-001";
  private listManagers: string[] = [];
  private currentManagerEmail = "blue";
  private currentPermisionsSet: string[] = [];

  get getCurrentPermisionsSet(): string[] {
    return this.currentPermisionsSet;
  }

  @Emit()
  private modalAction(action: string, data: KeyValuePair[] = []): ActionObject {
    console.log("clickedAction in");
    return {
      action,
      data,
    };
  }

  private doAddManager(): void {
    if (this.currentManagerEmail && this.currentManagerEmail != "") {
      this.listManagers.unshift(this.currentManagerEmail);
    }
  }
  private doRemoveManager(pemissionID: string): void {
    this.currentPermisionsSet = this.currentPermisionsSet.filter(
      (permission) => permission != pemissionID
    );
  }

  private doSelectPermission(pemissionID: string): void {
    this.currentPermisionsSet.unshift(pemissionID);
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
    .v-card__title {
      height: 120px;
      position: absolute;
      background-color: white;
      z-index: 10;
    }
    .v-card__text {
      position: relative;
      padding: 20px 56px 40px 24px;
      height: 60vh;
      margin-top: 120px;
      margin-bottom: 60px;
      overflow-y: auto;
    }
    .v-card__actions {
      position: absolute;
      z-index: 10;
      display: flex;
      width: 100%;
      flex-direction: row;
      align-items: flex-end;
      padding: 16px 24px;
      bottom: 0;
      left: 0px;
      background: #f0f0f0;
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
  .permission-set-description {
  }
}
.invite-portfolio-manager-email {
  .v-input__control {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 24px;
  }
}
.add-portfolio-manager-email__icon {
  text-decoration: none;
  text-decoration-color: transparent;
  text-decoration-style: unset;
  text-decoration-line: none;
}
</style>
