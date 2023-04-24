import { 
  bootstrapMockApis,  
  getCheckboxIds,  
  getCheckboxId, 
  getServiceOfferingNames,   
  getObjectFromArrayByKey, 
  randomAlphaNumeric
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReqs from "../../../selectors/performanceReqs.sel";



describe.skip("Test suite: Summary screen: Selected Offerings ", { tags: '@iso-ignore' }, () => {
  let serviceOfferingGroups;  

  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
    });
    
    cy.launchATAT();  
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");     
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
  });
    
  
  it("TC1: Standard Path-No missing Info", () => {
    const periodCheckboxCount = 1
    const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)"];    
    
    cy.selectCheckBoxes([contractDetails.level5]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");    
    
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);
    
    const iotObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "IOT"
    );
    
    const iotCheckBoxId = getCheckboxId(iotObj.value);    
    cy.selectServiceOfferingGroup([iotCheckBoxId]);
    
    //Navigates to the next page

    cy.verifyPageHeader("What type of " + iotObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',iotObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(iotObj);
    const checkboxIds = getCheckboxIds(iotObj);
    const selectedServiceOffering = [labels[1]]
    cy.selectCheckBoxes([checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    );     

    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric()
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
    
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    
    cy.periodCount(periodCheckboxCount, performanceReqs.periodCheckboxRow1);
    // BASE is preselected if only one PoP, so do not check this if expecting all required fields
    // since it would UNcheck Base Period, resulting in Missing Info on DOW Summary page
    // cy.selectCheckBoxes([performanceReqs.checkBoxBase]);
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    cy.verifyTextMatches(
      performanceReqs.categoryNameHeader,
      iotObj.label);
    cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOffering);
    cy.btnExists(performanceReqs.selectedGroupsBtn, " View/Edit ");
    //Selected Category shouldn't exist in Other available categories.
    cy.notAvailableCategory(iotObj.label);
    cy.btnClick(common.continueBtn, " Wrap up this section ");
    cy.verifyPageHeader(
      " Will government equipment be furnished, provided or acquired under this acquisition? ");
    
  });

  it("TC2: Missing Info with Warning icon", () => {
    
    const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)"];    
    
    cy.selectCheckBoxes([contractDetails.level5]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");    
    
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);
    
    const adObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "ADVISORY"
    );
    
    const adCheckBoxId = getCheckboxId(adObj.value);    
    cy.selectServiceOfferingGroup([adCheckBoxId]);
    
    //Navigates to the next page

    cy.verifyPageHeader("What type of " + adObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',adObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(adObj);
    const checkboxIds = getCheckboxIds(adObj);
    const selectedServiceOffering = [labels[1],labels[2]]
    cy.selectCheckBoxes([checkboxIds[1],checkboxIds[2]]);
    cy.btnClick(common.continueBtn, " Continue ");
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    ); 
    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric(5)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
    //user didn't select the Entire duration for labels[1]
    cy.btnClick(common.continueBtn, " Continue ");

    //Navigates to the Gather your requirement screen for labels[2]
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[2]
    ); 
    //enter the exist in the text box
    const anticipatedReqText1 = randomAlphaNumeric(5)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText1
    );
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    cy.verifyTextMatches(
      performanceReqs.categoryNameHeader,
      adObj.label);
    cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOffering);
    cy.textExists(performanceReqs.missingInfo, "Missing info").should("exist"); 
    cy.btnExists(performanceReqs.reviewbtn, " Review ").click();
    //Navigates to Service-offering screen
    cy.verifyPageHeader("What type of " + adObj.label + " do you need?"); 
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedServiceOffering);
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    ); 
    cy.durationPeriodExists(
      performanceReqs.durationYesRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "YES");
    cy.radioBtn(performanceReqs.durationYesRadioBtn, "YES").click({ force: true });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[2]
    ); 
    cy.radioBtn(performanceReqs.durationYesRadioBtn, "YES").click({ force: true });
    cy.radioBtn(performanceReqs.durationNoRadioBtn, "NO").click({ force: true });
    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    cy.findElement(performanceReqs.missingInfo).should("not.exist");
    //Selected Category shouldn't exist in Other available categories.
    cy.notAvailableCategory(adObj.label);
    
    
  });

  it("TC3: View & Edit the workflow", () => {
    
    const selectedClassLevelsLabels = [
      "Unclassified / Impact Level 4 (IL4)",
      "Unclassified / Impact Level 5 (IL5)",];    
    
    cy.selectCheckBoxes([contractDetails.level4,contractDetails.level5]);     
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");    
    
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);
    
    const edgeObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "EDGECOMPUTING"
    );
    
    const edgeCheckBoxId = getCheckboxId(edgeObj.value);    
    cy.selectServiceOfferingGroup([edgeCheckBoxId]);
    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + edgeObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',edgeObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(edgeObj);
    const checkboxIds = getCheckboxIds(edgeObj);
    const selectedServiceOffering = [labels[1]]
    cy.selectCheckBoxes([checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    );     

    const selectedClassBox = [
      "Unclassified/IL5 instance",
      "Unclassified/IL4 instance",
    ]
    cy.selectCheckBoxes([contractDetails.level4])
      .then(() => {
        cy.findElement(performanceReqs.offeringDetailform).scrollIntoView().should("be.visible");
        
      });
    cy.verifyTextMatches(
      performanceReqs.requirmentHeading1,
      "1. Tell us about the "  + selectedClassBox[1]);    
    
    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
  
    cy.durationPeriodExists(
      performanceReqs.durationYesRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "YES");   
    
    cy.btnClick(common.continueBtn, " Continue "); 
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    cy.verifyTextMatches(
      performanceReqs.categoryNameHeader,
      edgeObj.label);
    cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOffering);
    cy.btnExists(performanceReqs.selectedGroupsBtn, " View/Edit ").click();
    
    //Navigates to Service Offering page
    cy.verifyPageHeader("What type of " + edgeObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedServiceOffering);
    cy.btnClick(performanceReqs.dontneedBtn, " I don’t need these cloud resources ");
    
    //Navigates back to Summary page
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );

    //Category shouldn't exist
    cy.findElement(performanceReqs.selectedGroups).should("not.visible");
    cy.notAvailableCategory(edgeObj.label);
  });

  it("TC4: Multiple Categories exists in Selected Offering section", () => {
    const periodCheckboxCount = 1
    const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)",];    
    
    cy.selectCheckBoxes([contractDetails.level5]);     
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");    
    
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);
    const appObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "APPLICATIONS" 
    );
    const networkingObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "NETWORKING" 
    );
    const appCheckBoxId = getCheckboxId(appObj.value);
    const networkCheckboxId = getCheckboxId(networkingObj.value);
    cy.selectServiceOfferingGroup([appCheckBoxId, networkCheckboxId]);
    
    //Navigates to the Application Service Offering page
    cy.verifyPageHeader("What type of " + appObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',appObj.serviceOfferingCypressLabels);
    
    const appLabels = getServiceOfferingNames(appObj);
    const appCheckboxIds = getCheckboxIds(appObj);
    const appSSOffering = appLabels[1];
    cy.selectCheckBoxes([appCheckboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");

    //Navigates to the Gather your requirement screen for Appserviceoffering
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + appLabels[1]
    );         
    
    //enter the exist in the text box
    const appAnticipatedReqText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      appAnticipatedReqText
    );
  
    cy.durationPeriodExists(
      performanceReqs.durationYesRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "YES");   
    
    cy.btnClick(common.continueBtn, " Continue ");

    //Navigates to the Networking Service Offering page
    cy.verifyPageHeader("What type of " + networkingObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',networkingObj.serviceOfferingCypressLabels);
    
    const networkLabels = getServiceOfferingNames(networkingObj);
    const networkCheckboxIds = getCheckboxIds(networkingObj);
    const netSSOffering = networkLabels[1];
    cy.selectCheckBoxes([networkCheckboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + networkLabels[1]
    ); 
    
    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
  
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    cy.periodCount(periodCheckboxCount, performanceReqs.periodCheckboxRow1);
    cy.selectCheckBoxes([performanceReqs.checkBoxBase]);       
    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    const expectedCategoryHeaders = [appObj.label, networkingObj.label];
    const serviceOfferingLabels =[appSSOffering, netSSOffering]
    cy.verifyTextArray(
      performanceReqs.categoryNameHeader,
      expectedCategoryHeaders);
    cy.verifyTextArray(
      performanceReqs.serviceOfferingSpans,
      serviceOfferingLabels);
    
  });

});
