import { Component } from "vue-property-decorator";
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import ApplicationsState from "@/store/modules/applications/types";
import {
  ApplicationModel,
  EnvironmentModel,
  OperatorModel,
} from "types/Portfolios";

const namespace = "applications";

/**
 * Mixin to encapsulate application store module data
 */
@Component({})
export default class ApplicationModuleData extends Vue {
  @State(namespace) applicationsState!: ApplicationsState;
  @Action("setCurrentApplicationId", { namespace })
  setCurrentApplicationId!: (id: string) => void;
  @Action("deleteApplication", { namespace })
  deleteApplication!: (id: string) => Promise<void>;
  @Action("updateEnvironmentOperators", { namespace })
  updateEnvironmentOperators!: ({
    appId,
    environments,
  }: {
    appId: string;
    environments: EnvironmentModel[];
  }) => void;

  @Action("updateRootAdminInfo", { namespace })
  updateRootAdminInfo!: ({
    index,
    display_name,
    email,
  }: {
    index: number;
    display_name: string;
    email: string;
  }) => void;

  @Action("updateApplicationOperators", { namespace })
  updateApplicationOperators!: ({
    appId,
    operators,
  }: {
    appId: string;
    operators: OperatorModel[];
  }) => void;

  @Action("updateRootAdministrators", { namespace })
  updateRootAdministrators!: (operators: OperatorModel[]) => void;

  @Action("initializeRootAdministrators")
  initializeRootAdministrators!: (n: void) => void;

  @Getter("currentApplication", { namespace })
  currentApplication!: ApplicationModel;

  get applications(): ApplicationModel[] {
    return this.applicationsState && this.applicationsState.applicationModels
      ? this.applicationsState.applicationModels
      : [];
  }

  get operators(): OperatorModel[] {
    return this.applicationsState && this.applicationsState.portfolioOperators
      ? this.applicationsState.portfolioOperators
      : [];
  }
}
