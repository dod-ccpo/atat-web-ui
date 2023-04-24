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

import SlideoutPanel from "@/store/slideoutPanel"; 

@Module({
  name: "AppSectionsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class AppSectionsStore extends VuexModule {

  sectionTitles: Record<string, string> = {
    Home: "Home",
    AcquisitionPackage: "Acquisition Package Builder",
    JWCCDashboard: "JWCC Dashboard",
    TOLookup: "Lookup TO in EDA",
    Portfolios: "Portfolios",
    PortfolioSummary: "Portfolio Summary",
    DocumentReview: "Document Review",
    Packages: "Packages",
    ProvisionWorkflow: "ProvisionWorkflow"
  }

  activeAppSection = this.sectionTitles.Home;

  appSectionMenuItems: { title: string }[] = [
    { title: this.sectionTitles.AcquisitionPackage },
    { title: this.sectionTitles.JWCCDashboard },
    { title: this.sectionTitles.TOLookup },
    { title: this.sectionTitles.Portfolios },
    { title: this.sectionTitles.DocumentReview },
    { title: this.sectionTitles.Packages },
    { title: this.sectionTitles.ProvisionWorkflow }
  ];

  activeTabIndex = 0;

  @Action
  public async setActiveTabIndex(idx: number): Promise<void> {
    this.doSetActiveTabIndex(idx);
  }
  
  @Mutation
  public async doSetActiveTabIndex(idx: number): Promise<void> {
    this.activeTabIndex = idx;
  }

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
    SlideoutPanel.closeSlideoutPanel();
  }

}

const AppSections = getModule(AppSectionsStore);
export default AppSections;
