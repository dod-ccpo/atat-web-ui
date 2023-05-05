import { Component } from "vue";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";
import { SlideoutPanelContent } from "types/Global";

@Module({
  name: 'SlideoutPanel',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class SlideoutPanelStore extends VuexModule {
  
  slideoutPanelIsOpen = false;
  // slideoutPanelOpenerId for 508 return focus. set when link clicked to open panel
  slideoutPanelOpenerId = ""; 
  slideoutPanelTitle = "";
  slideoutPanelComponent: Component = {};
  slideoutPanelHasComponent = false;

  public get getSlideoutPanelIsOpen(): boolean {
    return this.slideoutPanelIsOpen;
  }

  @Action
  public async setSlideoutPanelComponent(panelContent: SlideoutPanelContent): Promise<void> {
    this.doSetSlideoutPanelComponent(panelContent);
  }

  @Mutation
  public doSetSlideoutPanelComponent(panelContent: SlideoutPanelContent): void {
    this.slideoutPanelComponent = panelContent.component;
    this.slideoutPanelTitle = panelContent.title || "";
    this.slideoutPanelHasComponent = true;
    const wrapper = document.getElementById("PanelWrap");
    if (wrapper) {
      wrapper.scrollTop = 0;
    }
  }

  @Action 
  public closeSlideoutPanel(): void {
    this.doCloseSlideoutPanel();
  }
  @Mutation
  public doCloseSlideoutPanel(): void {
    this.slideoutPanelIsOpen = false;
  }

  @Action
  public openSlideoutPanel(openerId: string): void {
    this.doOpenSlideoutPanel(openerId);
  }

  @Mutation
  public doOpenSlideoutPanel(openerId: string): void {
    this.slideoutPanelIsOpen = true;
    if (openerId) {
      this.slideoutPanelOpenerId = openerId;
    }
  }

}

const SlideoutPanel = getModule(SlideoutPanelStore);
export default SlideoutPanel;
