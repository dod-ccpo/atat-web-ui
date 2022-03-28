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
  
  // this was the old ATAT way, used to conditionally show components that were all 
  // imported into the side drawer component instead of using slots
  slideoutPanelType = ""; // use slots instead? see below... 

  // use to pass component into slot? put a watcher on this in App.vue?
  slideoutPanelComponent = ""; 

  // for 508 return focus. set when link clicked to open panel
  slideoutPanelOpenerId = ""; 

  slideoutPanelChange = false; // not sure what this is... if slot component don't need?
 
  // MUTATIONS from old ATAT
  // doCloseSideDrawer(state) {
  //   state.sideDrawerIsOpen = false;
  //   state.sideDrawerChange = !state.sideDrawerChange;
  // },
  // doOpenSideDrawer(state, [drawerType, openerId]) {
  //   state.sideDrawerIsOpen = true;
  //   state.sideDrawerType = drawerType;
  //   state.sideDrawerOpenerId = openerId;
  //   state.sideDrawerChange = !state.sideDrawerChange;
  // },

  // ACTIONS from old ATAT
  // closeSideDrawer({ commit }) {
  //   commit("doCloseSideDrawer");
  // },
  // openSideDrawer({ commit }, [drawerType, openerId]) {
  //   commit("doOpenSideDrawer", [drawerType, openerId]);
  // },

}

const SlideoutPanel = getModule(SlideoutPanelStore);
export default SlideoutPanel;