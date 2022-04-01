import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'Background',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class BackgroundStore extends VuexModule {
  hasCurrentContract: boolean | null = null;

  @Action
  public setHasCurrentContract(hasContract: boolean): void {
    this.doSetHasCurrentContract(hasContract);
  }
  @Mutation
  public doSetHasCurrentContract(hasContract: boolean): void {
    this.hasCurrentContract = hasContract;
  }
}

const Background = getModule(BackgroundStore);
export default Background;
