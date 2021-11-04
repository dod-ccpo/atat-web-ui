import PortfoliosState from "../modules/portfolios/types";

interface RootState {
  currentPortfolioId: string,
  loginStatus: boolean;
  sideDrawer: boolean;
  sideDrawerType: string;
  isSideDrawerFocused: boolean;
  isUserAuthorizedToProvisionCloudResources: boolean;
  isNavSideBarDisplayed: boolean;
  dialog: {
    isDisplayed: boolean;
    type: string;
    setFocus: boolean;
    width: string;
    height: string;
    props: any;
  };
  user: {
    title: string;
    given_name: string;
    family_name: string;
    email: string;
    phone_number: string;
    service_branch: string;
    citizenship: string;
    dod_id: string;
    designation: string;
  };
  validationStamp: any;
  toast: {
    isDisplayed: boolean;
    message: string;
    contentClass: string;
  };
}

export { RootState, PortfoliosState };
