import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import { ClassificationLevelDTO } from "@/api/models";

@Module({
  name: "ClassificationRequirements",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class ClassificationRequirementsStore extends VuexModule {
  public selectedClassificationLevels: ClassificationLevelDTO[] = [];

  @Mutation
  public setSelectedClassificationLevels(value: ClassificationLevelDTO[]):void {
    this.selectedClassificationLevels = value;
  }

  @Action({ rawError: true })
  public async updateClassificationLevels(value: ClassificationLevelDTO[]): Promise<void> {
    this.setSelectedClassificationLevels(value);
  }
}
const ClassificationRequirements = getModule(ClassificationRequirementsStore);
export default ClassificationRequirements;