<template>
  <div class="portfolio-managers-modal">
    <v-dialog
      v-model="isDialogOpen"
      max-width="800px"
      persistent
      content-class="v-dialog v-dialog--active v-dialog--persistent portfolio-managers-modal-dialog"
      class="portfolio-managers-modal-dialog"
    >
      <v-form ref="formAddManagers">
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
            <label class="form-field-label"> Email address </label>
            <div class="form-field-group">
              <div
                class="form-field-item"
                v-for="(manager, counter) in listManagers"
                v-bind:key="counter"
              >
                <v-text-field
                  outlined
                  dense
                  height="42"
                  type="email"
                  :rules="validEmailRules"
                  :messages="['Messages']"
                  v-model.lazy="listManagers[counter]"
                  placeholder="add e-mail"
                  hide-details="true"
                  class="invite-portfolio-manager-email"
                >
                </v-text-field>
                <v-btn
                  @click="doRemoveManager(counter)"
                  v-if="listManagers.length > 1"
                  class="form-field-item__cancel link-button body-lg"
                  :ripple="false"
                >
                  <v-icon> mdi-delete-forever-outline </v-icon>
                </v-btn>
              </div>
            </div>

            <v-btn
              class="add-portfolio-manager-email link-button body-lg"
              :ripple="false"
              @click="doAddManager"
            >
              <v-icon class="add-portfolio-manager-email__icon" left>
                mdi-plus-circle-outline
              </v-icon>
              <strong class="text-decoration-underline">
                Add another portfolio manager
              </strong>
            </v-btn>
            <br /><br />
            <h3 class="h3">Portfolio Permissions</h3>
            <div
              class="permissions-set-list"
              v-for="permission in portfoliManagerPermisionsSet"
              :key="permission.id"
            >
              <div class="permission-set-checkbox">
                <v-checkbox
                  class="ma-0 pa-0"
                  :ripple="false"
                  :label="permission.label"
                  :value="permission.id"
                  hide-details="true"
                  v-model="currentPermisionsSet"
                />
                <p
                  class="permission-set-description"
                  v-html="permission.description"
                ></p>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn
              color="portfolio-managers-modal-cancel
                  link-button
                  body-lg
                "
              :ripple="false"
              @click="modalAction('portfolio-managers-modal-cancel')"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              :disabled="isSaveDisenable"
              @click="modalAction('portfolio-managers-modal-save')"
            >
              Send Invitation
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";
import { ActionObject } from "@/../types/Actions";
import {
  PortfolioManagerPermissions,
  Manager,
  PortfolioManagers,
} from "@/../types/Managers";
import { validEmail } from "@/store/validation.modules";

@Component({
  components: { ATATTextField },
})
export default class PermissionsModal extends Vue {
  @Prop({ default: false }) private isDialogOpen!: boolean;
  @Prop({ default: "ptfl-00001-001" }) private portfolioID!: string;

  private listManagers: string[] = [""];
  private currentPermisionsSet: string[] = [];

  get portfoliManagerPermisionsSet(): PortfolioManagerPermissions {
    return this.$store.getters.getPortfoliManagerPermisions;
  }

  get getCurrentPermisionsSet(): string[] {
    return this.currentPermisionsSet;
  }

  get isSaveDisenable(): boolean {
    let isFormValid = !!this.$refs.formAddManagers;
    console.log("isFormValid", isFormValid);
    if (this.listManagers.length > 0 && this.listManagers[0].length > 3) {
      if (this.listManagers.length > 1) {
        isFormValid = this.listManagers.reduce(
          (prev: boolean, curr: string) => {
            return prev && validEmail(curr);
          },
          true
        );
      }
      return !isFormValid;
    }
    return true;
  }

  get portfolioManagers(): PortfolioManagers {
    let managers: PortfolioManagers = {
      portfolioID: this.portfolioID,
      managers: this.listManagers.map((val) => {
        let manager: Manager = {
          email: val,
          permissionSets: this.currentPermisionsSet,
        };
        return manager;
      }),
    };
    console.log("get portfolioManagers", managers);
    return managers;
  }

  private validEmailRules = [
    (v: string): boolean | string =>
      v.length > 3 || "minimal amout of characters is 3",
    (v: string): boolean | string => validEmail(v) || "text must be a email",
  ];

  private modalAction(actionName: string): ActionObject {
    const actionObj: ActionObject = {
      action: actionName,
      data: {
        portfolioID: this.portfolioID,
        listManagers: this.listManagers,
        currentPermisionsSet: this.currentPermisionsSet,
        portfolioManagers: this.portfolioManagers,
      },
    };

    this.$emit("modalAction", actionObj);
    return actionObj;
  }

  private doAddManager(): void {
    this.listManagers.push("");
  }
  private doRemoveManager(counter: number): void {
    this.listManagers.splice(counter, 1);
  }

  private doSelectPermission(pemissionID: string): void {
    this.currentPermisionsSet.unshift(pemissionID);
  }
}
</script>

<style lang="scss"></style>
