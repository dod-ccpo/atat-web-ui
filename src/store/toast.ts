import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "./index";
import { ToastObj } from "types/Global";

@Module({
  name: 'Toast',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class ToastStore extends VuexModule {

  toast: ToastObj = {
    isOpen: false,
    type: "success",
    message: "",
    hasUndo: false,
    hasIcon: false,  
  }

  @Action
  public setToast(toast: ToastObj): void {
    this.doSetToast(toast);
  }

  @Mutation
  public doSetToast(toast: ToastObj): void {
    Object.assign(this.toast, toast);
  }

  @Action
  setToastClosed(): void {
    this.doSetToastClosed();
  }

  @Mutation
  doSetToastClosed(): void {
    this.toast.isOpen = false;
  }
}

const Toast = getModule(ToastStore);
export default Toast;
