/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import { Component } from "vue";
import rootStore from "./index";

@Module({
  name: "SectionsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class SectionsStore extends VuexModule {

  sectionTitles: Record<string, string> = {
    AcquisitionPackage: "Acquisition Package Builder",
    JWCCDashboard: "JWCC Dashboard",
    PortfolioDashboard: "Portfolio Dashboard",
    TOLookup: "Lookup TO in EDA",
  }

  activeSection = this.sectionTitles.AcquisitionPackage;

  appSectionMenuItems: { title: string }[] = [
    { title: this.sectionTitles.AcquisitionPackage },
    { title: this.sectionTitles.JWCCDashboard },
    { title: this.sectionTitles.PortfolioDashboard },
    { title: this.sectionTitles.TOLookup },
  ];

  @Mutation
  public changeActiveSection(section: string): void {
    this.activeSection = section;
  }

  @Action
  public async getSectionData(): Promise<{ 
    activeSection: string, 
    sectionTitles: Record<string, string> 
  }> {
    return {
      activeSection: this.activeSection,
      sectionTitles: this.sectionTitles
    }
  }

  appContentComponent: Component = {};

  @Action
  async setAppContentComponent(contentComponent: Component): Promise<void> {
    this.doSetAppContentComponent(contentComponent);
    return;
  }

  @Mutation
  doSetAppContentComponent(contentComponent: Component): void {
    this.appContentComponent = contentComponent;
  }

}

const Sections = getModule(SectionsStore);
export default Sections;
