import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'SlideoutPanel',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class SlideoutPanelStore extends VuexModule {
  
  slideoutPanelIsOpen = false;
  slideoutPanelOpenerId = ""; // for 508 return focus. set when link clicked to open panel
  slideoutPanelChange = false; // ? if slot component don't need?
 
  // MUTATIONS from old ATAT
  @Mutation
  public doCloseSideDrawer(): void {
    this.slideoutPanelIsOpen = false;
    this.slideoutPanelChange = !this.slideoutPanelChange;
  }

  @Mutation
  public doOpenSideDrawer(openerId: string): void {
    this.slideoutPanelIsOpen = true;
    this.slideoutPanelOpenerId = openerId;
    this.slideoutPanelChange = !this.slideoutPanelChange;
  }

  @Action 
  public closeSideDrawer(): void {
    this.doCloseSideDrawer();
  }

  @Action
  public openSideDrawer(openerId: string): void {
    this.doOpenSideDrawer(openerId);
  }

}

const SlideoutPanel = getModule(SlideoutPanelStore);
export default SlideoutPanel;