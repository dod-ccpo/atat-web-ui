import { 
  bootstrapMockApis,  
  getCheckboxIds,   
  getServiceOfferingNames,
  getCheckboxId, 
  getObjectFromArrayByKey, 
  randomAlphaNumeric
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReqs from "../../../selectors/performanceReqs.sel";

const durationLabelRequirement 
  = "Is this requirement needed for the entire duration of your task order?";
const needLabelRequirement = "Describe the anticipated need and usage of this requirement";
const letsWorkOnItHeader = "Let’s work on your performance requirements";


describe.skip("Test suite: Gather Requirements screen ",{ tags: '@iso-ignore' },  () => {
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
  });
    
  it("TC1: Gather Requirements with SINGLE classification levels ", () => {
    //Enter the Value for Base
    const periodCheckboxCount = 1
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)"];    
    const selectedClassLevelsLabelsShort = ["Unclassified/IL5"];

    cy.selectCheckBoxes([contractDetails.level5]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(letsWorkOnItHeader);    
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const applicationsObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "APPLICATIONS" 
    );
    
    const appCheckBoxId = getCheckboxId(applicationsObj.value);    
    cy.selectServiceOfferingGroup([appCheckBoxId]);
    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + applicationsObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]', applicationsObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(applicationsObj);
    const checkboxIds = getCheckboxIds(applicationsObj);
    
    cy.selectCheckBoxes([checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");  
    
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    ); 
    
    const expectedintroText = "In the previous section, you specified " +
      selectedClassLevelsLabelsShort[0] +
      " for the classification level of all cloud resources and services." +
      " If you need this within a different level," +
      " update your Classification Requirements."
    cy.verifyTextMatches(performanceReqs.classTextInIntro, expectedintroText);    
    cy.textExists(performanceReqs.updateLink, "update your Classification Requirements");

    //verify the label for the anticipated package
    cy.textExists(performanceReqs.anticipatedTextlabel1, needLabelRequirement);

    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric()
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );

    //Verify Duration label
    cy.textExists(performanceReqs.entireDurationRadioLabel1, durationLabelRequirement);
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    cy.periodCount(periodCheckboxCount, performanceReqs.periodCheckboxRow1);
    cy.selectCheckBoxes([performanceReqs.periodCheckbox1]);    
    cy.btnClick(common.continueBtn, " Continue "); 

    //navigate to Summary page
    cy.verifyPageHeader(
      "Your Performance Requirements"
    ); 
  });

  it("TC2: Multiple classification levels exists ", () => {
    const periodCheckboxCount = 2
    //Enter the Value for Base    
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });
    //click on Add Option year 
    cy.findElement(contractDetails.addOptionLink).should("exist").click();
    cy.findElement(contractDetails.optionalTextBox).type("4");
    cy.dropDownClick(contractDetails.optionDropdownIcon);
    cy.findElement(contractDetails.optionDropdownMonth).click({ force: true });    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    const selectedClassLevelsLabels = [
      "Unclassified / Impact Level 5 (IL5)",
      "Secret / Impact Level 6 (IL6)"
    ];    
    
    cy.selectCheckBoxes([contractDetails.level5,contractDetails.level6]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(letsWorkOnItHeader);    
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const networkingObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "NETWORKING" 
    );
    
    const appCheckBoxId = getCheckboxId(networkingObj.value);    
    cy.selectServiceOfferingGroup([appCheckBoxId]);    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + networkingObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]', networkingObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(networkingObj);
    const checkboxIds = getCheckboxIds(networkingObj);
    
    cy.selectCheckBoxes([checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");   
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    );
    cy.textExists(
      performanceReqs.classLevelsLabel,
      " What classification level(s) do you need? "
    );
    cy.verifyCheckBoxLabels(performanceReqs.classCheckboxes, selectedClassLevelsLabels);
    cy.textExists(
      performanceReqs.contentAboutClass,
      " I need this requirement within a different classification level. What do I do? "
    ).click().then(() => {
      const expectedContentTxt = "The levels listed above are based on the" +
        " classification requirements you specified in the previous" +
        " Contract Details section. If you need to make changes to these levels," +
        " update your Classification Requirements.";
      
      cy.verifyTextMatches(
        performanceReqs.contentText,
        expectedContentTxt
      );
      cy.textExists(
        performanceReqs.updateLink,
        "update your Classification Requirements"
      );
    });
    cy.findElement(performanceReqs.contentAboutClass).click();
    //check the classifiation check boxes
    
    const selectedClassBox = ["Unclassified/IL5 instance"]
    cy.selectCheckBoxes([contractDetails.level5])
      .then(() => {
        cy.findElement(performanceReqs.offeringDetailform).scrollIntoView().should("be.visible");
        
      });
    cy.verifyTextMatches(
      performanceReqs.requirmentHeading1,
      "1. Tell us about the "  + selectedClassBox);
    
    //verify the label for the anticipated package
    cy.textExists(performanceReqs.anticipatedTextlabel1, needLabelRequirement);
    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
    //Verify Duration label
    cy.textExists(performanceReqs.entireDurationRadioLabel1, durationLabelRequirement);
    cy.durationPeriodExists(
      performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    cy.periodCount(periodCheckboxCount, performanceReqs.periodCheckboxRow1);
    cy.selectCheckBoxes([performanceReqs.checkBoxBase]);    
    cy.btnClick(common.continueBtn, " Continue "); 

    //navigate to Summary page
    cy.verifyPageHeader(
      "Your Performance Requirements"
    ); 
  });

  it("TC3: Select multiple classification levels in Gather Requirement Screen ", () => {
    const periodCheckboxCount = 2
    //Enter the Value for Base
    cy.findElement(contractDetails.baseInputTxtBox).type("5");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });
    //click on Add Option year 
    cy.textExists(
      contractDetails.addOptionLink,
      "Add an option period"
    ).click();
    cy.findElement(contractDetails.optionalTextBox).type("4");   
    cy.dropDownClick(contractDetails.optionDropdownIcon);
    cy.findElement(contractDetails.optionDropdownMonth).click({ force: true });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    const selectedClassLevelsLabels = [
      "Unclassified / Impact Level 4 (IL4)",
      "Unclassified / Impact Level 5 (IL5)",
      "Secret / Impact Level 6 (IL6)"
    ];    
    
    cy.selectCheckBoxes([contractDetails.level4,contractDetails.level5,contractDetails.level6]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(letsWorkOnItHeader);    
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const edgecomputingObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "EDGECOMPUTING" 
    );
    
    const edgeCheckBoxId = getCheckboxId(edgecomputingObj.value);    
    cy.selectServiceOfferingGroup([edgeCheckBoxId]);    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + edgecomputingObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]', edgecomputingObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(edgecomputingObj);
    const checkboxIds = getCheckboxIds(edgecomputingObj);
    
    cy.selectCheckBoxes([checkboxIds[1],checkboxIds[2]]);
    cy.btnClick(common.continueBtn, " Continue ");   
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    );
    cy.textExists(
      performanceReqs.classLevelsLabel,
      " What classification level(s) do you need? "
    );
    cy.verifyCheckBoxLabels(performanceReqs.classCheckboxes, selectedClassLevelsLabels);
    
    cy.findElement(performanceReqs.contentAboutClass).click();
    //check the classifiation check boxes
    
    const selectedClassBox = [
      "Unclassified/IL5 instance",
      "Unclassified/IL4 instance",
    ]
    cy.selectCheckBoxes([contractDetails.level5,contractDetails.level4])
      .then(() => {
        cy.findElement(performanceReqs.offeringDetailform).scrollIntoView().should("be.visible");
        
      });
    cy.verifyTextMatches(
      performanceReqs.requirmentHeading1,
      "1. Tell us about the "  + selectedClassBox[1]);
    
    //verify the label for the anticipated package
    cy.textExists(
      performanceReqs.anticipatedTextlabel1, needLabelRequirement);
    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
    //Verify Duration label
    cy.textExists(performanceReqs.entireDurationRadioLabel1, durationLabelRequirement);
    cy.durationPeriodExists(
      performanceReqs.durationYesRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "YES");
    cy.verifyTextMatches(
      performanceReqs.requirmentHeading2,
      "2. Tell us about the "  + selectedClassBox[0]);
    
    //verify the label for the anticipated package
    cy.textExists(performanceReqs.anticipatedTextlabel2, needLabelRequirement);
    //enter the exist in the text box
    const anticipatedReqText1 = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox2,
      anticipatedReqText1
    );
    //Verify Duration label
    cy.textExists(performanceReqs.entireDurationRadioLabel2, durationLabelRequirement);
    cy.durationPeriodExists(
      performanceReqs.duration2NoRadioBtn,
      performanceReqs.duration2ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel2,
      "NO");
    cy.periodCount(periodCheckboxCount, performanceReqs.periodCheckboxRow2);
    cy.selectCheckBoxes([performanceReqs.periodCheckBoxBase2]);
    cy.btnClick(common.continueBtn, " Continue "); 
    
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[2]
    ); 
    
    
  });

  it("TC4: No classification levels exists in Gather Requirement Screen ", () => {    
    //Enter the Value for Base
    cy.findElement(contractDetails.baseInputTxtBox).type("5");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });
    //click on Add Option year 
    cy.textExists(
      contractDetails.addOptionLink,
      "Add an option period"
    ).click();
    cy.findElement(contractDetails.optionalTextBox).type("4");   
    cy.dropDownClick(contractDetails.optionDropdownIcon);
    cy.findElement(contractDetails.optionDropdownMonth).click({ force: true });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
    cy.verifyPageHeader(letsWorkOnItHeader);   
    cy.textExists(
      performanceReqs.categoryAlertheading,
      "Your  classification requirements are  missing. ");
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const securityObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "SECURITY" 
    );
    
    const secCheckBoxId = getCheckboxId(securityObj.value);    
    cy.selectServiceOfferingGroup([secCheckBoxId]);    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + securityObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',securityObj.serviceOfferingCypressLabels);    
    const checkboxIds = getCheckboxIds(securityObj);
    
    cy.selectCheckBoxes([checkboxIds[0],checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");   
    //Navigates directly to Summary page.
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    cy.textExists(
      performanceReqs.categoryAlertheading,
      "Your  classification requirements are  missing. "
    );
    const alertInfo = "We cannot gather some details about your unique requirements at this time." +
      " In order to finalize your performance requirements, you need to tell us about" +
      " your classification requirements in the Contract Details section first."
    cy.verifyTextMatches(performanceReqs.categoryAlertInfoTxt, alertInfo);  
    
  });
  it("TC5: No PoP exists in Gather Requirement Screen ", () => {
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    const selectedClassLevelsLabels = ["Unclassified / Impact Level 4 (IL4)"];    
    const selectedClassLevelsLabelsShort = ["Unclassified/IL4"];    
    
    cy.selectCheckBoxes([contractDetails.level4]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(letsWorkOnItHeader);         
    cy.textExists(
      performanceReqs.categoryAlertheading,
      "Your  period of performance is  missing. "
    );
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const trainingObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "TRAINING" 
    );
    
    const trainCheckBoxId = getCheckboxId(trainingObj.value);    
    cy.selectServiceOfferingGroup([trainCheckBoxId]);    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + trainingObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',trainingObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(trainingObj);
    const checkboxIds = getCheckboxIds(trainingObj);
    
    cy.selectCheckBoxes([checkboxIds[0],checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[0]
    ); 
    
    const expectedintroText = "In the previous section, you specified " +
      selectedClassLevelsLabelsShort[0] +
      " for the classification level of all cloud resources and services." +
      " If you need this within a different level," +
      " update your Classification Requirements."
    cy.verifyTextMatches(performanceReqs.classTextInIntro, expectedintroText);    
    cy.textExists(performanceReqs.updateLink, "update your Classification Requirements");

    //verify the label for the anticipated package
    cy.textExists(performanceReqs.anticipatedTextlabel1, needLabelRequirement);

    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric()
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );

    //Verify Duration label
    cy.textExists(performanceReqs.entireDurationRadioLabel1, durationLabelRequirement);
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    cy.findElement(performanceReqs.baseCheckbox1Disabled).should("exist")
      .and("be.disabled");
    cy.findElement(performanceReqs.alertPeriod1Text).should("be.visible");
    const alertText = "Your period of performance details are missing." +
      " To select specific base or option periods for this requirement," +
      " revisit the Contract Details section"
    cy.verifyTextMatches(performanceReqs.alertPeriod1Text,
      alertText);
      
    cy.textExists(performanceReqs.contractDtailsLink, "revisit the Contract Details section ")
      .click();
    cy.verifyPageHeader("Let’s gather some details about the duration of your task order");
    
  });

  it("TC6: Validations ", () => {

    //Enter the Value for Base    
    
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)"];    
  
    cy.selectCheckBoxes([contractDetails.level5]);    
  
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
  
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(letsWorkOnItHeader);    
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const applicationsObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "APPLICATIONS" 
    );
  
    const appCheckBoxId = getCheckboxId(applicationsObj.value);    
    cy.selectServiceOfferingGroup([appCheckBoxId]);
  
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + applicationsObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]', applicationsObj.serviceOfferingCypressLabels);
  
    const labels = getServiceOfferingNames(applicationsObj);
    const checkboxIds = getCheckboxIds(applicationsObj);
  
    cy.selectCheckBoxes([checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");  
  
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    );     

    //Validation message for antiicipated text box
    
    const anticipatedReqText = randomAlphaNumeric(501)
    cy.verifyRequiredInput(
      performanceReqs.anticipatedTextBox1,
      performanceReqs.anticipatedTextError1,
      "Please provide a description for this requirement."
    );
    //validation message more than 500
    cy.enterTextInTextField(performanceReqs.anticipatedTextBox1, anticipatedReqText)
      .then(() => {
        cy.checkErrorMessage(
          performanceReqs.anticipatedTextError1,
          "Description is to be 500 characters or less.");
      });
    cy.findElement(performanceReqs.durationYesRadioBtn).focus().tab().tab()
      .then(() => {
        cy.checkErrorMessage
        (performanceReqs.duration1Error,
          "Please select an option to specify your requirement’s duration.");
      });
    cy.radioBtn(performanceReqs.durationNoRadioBtn, "NO").click({force:true}); 
    cy.verifyRequiredCheckbox(
      performanceReqs.checkBoxBase,
      performanceReqs.baseCheck1Error,
      "Please select at least one base or option period to specify your requirement’s duration" +
      " level."
    )    
    
  });  

});
