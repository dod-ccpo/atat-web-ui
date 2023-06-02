import { 
  bootstrapMockApis,   
  randomAlphaNumeric,
  getObjectFromArrayByKey  
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReq from "../../../selectors/performanceReqs.sel";


const generalXaaSReqHeader = "Your general IaaS, PaaS, and SaaS requirements";
const req2 = "Let’s gather some details for Requirement #2";
const serviceCatOffering = "General Iaas, PaaS, and SaaS";


describe.skip("Test suite: General XaaS Flows", () => {

  let serviceOfferingGroups;  
  let categoryObj;
  let periodCheckboxCount = 2;
  let compute;
  
  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
      categoryObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "GENERALXAAS"
      );
    });         
    cy.fixture("compute").then((data) => {
      compute = data;
    });

    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownYear).click({ force: true });
    cy.findElement(contractDetails.baseInputTxtBox).type("1");
    cy.findElement(contractDetails.addOptionLink).should("exist").click();
    cy.dropDownClick(contractDetails.optionDropdownIcon);
    cy.findElement(contractDetails. optioneDropdownDays).click({ force: true });
    cy.findElement(contractDetails.optionalTextBox).type("365");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();

  });

  it("TC1: Multiple Classifications exists - Delete General XaaS requirement", () => {
    
    let selectedClassifications = [contractDetails.level5, contractDetails.level6];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectGeneralXaaSOption(categoryObj, serviceOfferingGroups);
    cy.textExists(performanceReq.requirementTitleLabel, " Requirement title ");
    const rtTooltipTxt = "Enter a title that briefly describes this IaaS, PaaS or SaaS requirement."
    cy.hoverToolTip(
      performanceReq.requirementTitleTooltipBtn,
      performanceReq.requirementTitleTooltipText,
      rtTooltipTxt
    );
    const reqTitle = randomAlphaNumeric(8)
    cy.enterTextInTextField(performanceReq.requirementTitleTxtBox, reqTitle);
    cy.findElement(performanceReq.classLevelLabel).scrollIntoView();
    cy.findElement(performanceReq.classIL6RadioBtn)
      .click({ force: true });
    const decriptionText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReq.anticipatedTextBox2,
      decriptionText
    );
    cy.durationPeriodExists(
      performanceReq.duration2NoRadioBtn,
      performanceReq.duration2ActiveRadioBtn,
      performanceReq.baseCheckbox,
      "NO");
    
    //click on Continue button,Navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(generalXaaSReqHeader);
    cy.verifyColumnHeaders(
      2,
      "Requirement title",
      reqTitle
    );
    cy.verifyColumnHeaders(
      3,
      "Duration",
      "Base period"
    );

    //delete the exisiting requirement
    cy.deleteRequirement(
      performanceReq.instanceOneDeleteBtn,
      " Delete “" + reqTitle + "?” ",
      " Delete requirement "
    );
    cy.textExists(performanceReq.noReqTxt,"You do not have any requirements yet.")
  });

  it("TC2: Single Classifications exists - Edit General XaaS Requirement", () => {
    
    let selectedClassifications = [contractDetails.level2];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectGeneralXaaSOption(categoryObj, serviceOfferingGroups);
    const introText = "Unclassified/IL2"      
    cy.textExists(performanceReq.singleClassText, introText); 
    const reqTitle = randomAlphaNumeric(8)
    cy.enterTextInTextField(performanceReq.requirementTitleTxtBox, reqTitle);
    //click on Continue button,Navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(generalXaaSReqHeader);
    cy.verifyColumnHeaders(
      2,
      "Requirement title",
      reqTitle+"Missing info"
    );
    
    cy.verifyColumnHeaders(
      3,
      "Duration",
      ""
    );

    //Edit the exisiting requirement
    cy.EditRequirement(
      performanceReq. instanceOneEditBtn,
      "Requirement #1"
      
    );
    const decriptionText = randomAlphaNumeric(15)
    cy.enterTextInTextField(
      performanceReq.anticipatedTextBox2,
      decriptionText
    );
    cy.durationPeriodExists(
      performanceReq.duration2NoRadioBtn,
      performanceReq.duration2ActiveRadioBtn,
      performanceReq.baseCheckbox,
      "NO");
    cy.periodCount(periodCheckboxCount, performanceReq.periodCheckboxRow2);
    cy.selectCheckBoxes([performanceReq.optionOneCheckbox]);  
    //click on Continue button,Navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(generalXaaSReqHeader);
    cy.verifyColumnHeaders(
      2,
      "Requirement title",
      reqTitle
    );
    
    cy.verifyColumnHeaders(
      3,
      "Duration",
      "Base period," + " Option period 1"
    );
  });

  it("TC3: Add another General XaaS Requirement and update classification", () => {
    
    let selectedClassifications = [contractDetails.level5];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectGeneralXaaSOption(categoryObj, serviceOfferingGroups);
    const introText = "Unclassified/IL5"
    cy.textExists(performanceReq.singleClassText, introText);
    const reqTitle = randomAlphaNumeric(10)
    cy.enterTextInTextField(performanceReq.requirementTitleTxtBox, reqTitle);
    const decriptionText = randomAlphaNumeric(15)
    cy.enterTextInTextField(
      performanceReq.anticipatedTextBox2,
      decriptionText
    );
    cy.selectRadioBtn(
      performanceReq.durationYesRadioBtn,
      "YES");
    //click on Continue button,Navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(generalXaaSReqHeader);
    cy.verifyColumnHeaders(
      2,
      "Requirement title",
      reqTitle
    );
    cy.verifyColumnHeaders(
      3,
      "Duration",
      "Entire task order"
    );
    //click on Add another requirement
    cy.addAnotherRequirement(performanceReq.addAnotherInstance, "Requirement #2");    
    cy.textExists(performanceReq.updateCLLink, "update your Classification Requirements").click()
      .then(() => {
        cy.findElement(performanceReq.updateModal).should("be.visible");
        cy.selectCheckBoxes([performanceReq.level5, performanceReq.level2])
        cy.findElement(performanceReq.changeLevelBtn).click().then(() => {
          cy.textExists(performanceReq.toastText, " Classification requirements updated ");
          cy.verifyPageHeader(req2);
          //updated classification updates in the intro text
          const introText = "Unclassified/IL2"
          cy.textExists(performanceReq.singleClassText, introText);           
        });
      });
    cy.durationPeriodExists(
      performanceReq.duration2NoRadioBtn,
      performanceReq.duration2ActiveRadioBtn,
      performanceReq.baseCheckbox,
      "NO");
    //click on Continue button,Navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(generalXaaSReqHeader);
    cy.findElement("table")
      .find("tr")
      .then((row) => {        
        cy.log(row.length);
      })
      .should("have.length", 3);
    cy.verifyColumnHeaders(2,
      "Requirement title",
      reqTitle + "UntitledMissing info");
  });

  it("TC4: Navigation: Click on back button  & No Classification exists ", () => { 
    
    cy.selectGeneralXaaSOption(categoryObj, serviceOfferingGroups);
    cy.verifyTextMatches(performanceReq.subAlertMessage, compute.subtleClassAlert)
    cy.btnClick(common.backBtn, "Back");    
    //Navigates to  Your Performance Requirements
    cy.verifyPageHeader("Your Performance Requirements");
    cy.verifyTextMatches(
      performanceReq.categoryNameHeader,
      serviceCatOffering);
    cy.textExists(performanceReq.missingInfo, "Missing info").should("exist");
    cy.btnExists(performanceReq.reviewbtn, " Review ").click()
      .then(() => {
        cy.verifyPageHeader(generalXaaSReqHeader);
      });
    cy.btnClick(common.backBtn, "Back");    
    //Navigates to  Your Performance Requirements
    cy.verifyPageHeader("Your Performance Requirements");  
      
  });

  it("TC5: Navigation: Click on I don't need compute resources button ", () => {
    
    let selectedClassifications = [contractDetails.level2,contractDetails.level5];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectGeneralXaaSOption(categoryObj, serviceOfferingGroups);
    cy.btnClick(performanceReq.dontneedBtn, " I don’t have general XaaS requirements ");    
    //Navigates to  Your Performance Requirements
    cy.verifyPageHeader("Your Performance Requirements");
    cy.otherAvailableCategory(serviceCatOffering);
  });
  
});
