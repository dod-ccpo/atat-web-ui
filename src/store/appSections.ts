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
  name: "AppSectionsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class AppSectionsStore extends VuexModule {

  sectionTitles: Record<string, string> = {
    AcquisitionPackage: "Acquisition Package Builder",
    JWCCDashboard: "JWCC Dashboard",
    PortfolioDashboard: "Portfolio Dashboard",
    TOLookup: "Lookup TO in EDA",
    PortfolioSummary: "Portfolio Summary",
    DocumentReview: "Document Review"
  }

  activeAppSection = this.sectionTitles.AcquisitionPackage;

  appSectionMenuItems: { title: string }[] = [
    { title: this.sectionTitles.AcquisitionPackage },
    { title: this.sectionTitles.JWCCDashboard },
    { title: this.sectionTitles.PortfolioDashboard },
    { title: this.sectionTitles.TOLookup },
    { title: this.sectionTitles.PortfolioSummary },
    { title: this.sectionTitles.DocumentReview }
  ];

  @Mutation
  public changeActiveSection(section: string): void {
    this.activeAppSection = section;
  }

  @Action
  public async getSectionData(): Promise<{ 
    activeSection: string, 
    sectionTitles: Record<string, string> 
  }> {
    return {
      activeSection: this.activeAppSection,
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

const AppSections = getModule(AppSectionsStore);
export default AppSections;
