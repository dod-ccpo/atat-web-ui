import { bootstrapMockApis,randomAlphaNumeric,capitalizeFirstLetter } from "../../../helpers";
import projectOverview from "../../../selectors/projectOverview.sel";
import common from "../../../selectors/common.sel";
import co from "../../../selectors/contractOffice.sel";
import lp from "../../../selectors/landingPage.sel";


describe("Test suite: Acquisition Package: Project Overview ", () => {    

  const expectedEmail = Cypress.env("snowUser");
  const expectedNames = expectedEmail.split('-ctr')[0].split('.');
  const expectedFirstName = expectedNames[0];
  const firstName = capitalizeFirstLetter(expectedFirstName);    
  let projectDetails;   
  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("projectOverview").then((details) => {
      projectDetails = details;
    });
    
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists("#Step_AcquisitionPackageDetails .step-text", " Acquisition Package Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");
    cy.textExists(common.subStepOrganizationTxt, " Organization ");
    cy.textExists(common.subStepContactInformationTxt, " Contact Information ");
    cy.activeStep(common.subStepProjectOverviewTxt);
  });
  
  it("TC1: Ensure data retrieved correctly upon edit", () => {

    // lands on New Acquistion Package    
    cy.textExists(common.packageNameHeader, "New Acquisition");   
    
    //Sub header
    cy.verifyPageHeader(" Let’s start with basic info about your new acquisition ");
        
    //label of the "Project/Requirement Title" text
    cy.textExists(projectOverview.projectTitleLabel, " Project/Requirement Title ");

    //tooltip
    const expectedText = "Provide a short, descriptive title of the work to be performed." +
      " This will be used to refer to this project within ATAT and across all acquisition" +
      " documents."        
    cy.hoverToolTip(projectOverview.toolTipBtn, projectOverview.toolTipTxt, expectedText);
        
    //Enter the Value
    const pt = "Step-1-ProjectTitle-" + randomAlphaNumeric(5);
    cy.verifyAcqPackageName(pt); 
        
    //label of the "Projectscope" text
    cy.textExists(projectOverview.scopeLabel, "What is the scope of your requirement?");
        
    //Enter What the scope requirement      
    cy.enterTextInTextField(projectOverview.scopeTxtBox, projectDetails.scope).click();
        
    //Assert Emergency declaration text          
    cy.findElement(projectOverview.emergencyDeclaration).then(($emergencytext) => {
      expect($emergencytext).to.have.text(
        " Is this requirement in support of an emergency declaration? "
      );
    });
        
    //Assert radio button
    cy.radioBtn(projectOverview.radioBtnNo, "NO").not("[disabled]");
        
    //select radio button
    cy.radioBtn(projectOverview.radioBtnYes, "YES").not("[disabled]")
      .click({ force: true });        
    //Project disclaimer
    cy.textExists(
      projectOverview.projDisLabel,
      " 2. Compliance with Military Service-specific policies ");
    cy.checkBoxOption(projectOverview.projDisChxkBox, "YES").click({force: true});
    //buttons that exists on the view
    cy.btnExists(common.backBtn, "Back");
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(projectOverview.projDisChxkBox);      
    cy.verifyPageHeader(" Next, we’ll gather information about your organization ");
    cy.findElement(common.dashboardTab).click();
    cy.waitUntilElementIsGone(common.sideNavBar);    
    cy.textExists(lp.welcomeBarText, "Hi " + firstName + "! How can we help you?");
    cy.findElement(lp.acqPackageaccordion).should("exist");
    cy.textExists(lp.acqCard0, pt).then(() => {
      cy.findElement(lp.acqPackage0).click();
    });
    cy.waitUntilElementIsGone(lp.acqCard0);
    cy.waitUntilModalNotVisible();
    cy.verifySelectedRadioOption(co.activeRadioOption, "Yes");
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(co.radioDITCO);
    cy.verifyEnteredInputTxt(projectOverview.projectTitleTxtBox, pt);
    cy.verifyEnteredInputTxt(projectOverview.scopeTxtBox, projectDetails.scope);
    cy.verifySelectedRadioOption(projectOverview.activeRadioOption, "Yes");
    cy.verifySelectedCheckBoxOption(projectOverview.projDisChxkBox);
      
  });

  it("TC2: Validations", () => {
    //ProjectTitle is blank
    cy.verifyRequiredInput(
      projectOverview.projectTitleTxtBox,
      projectOverview.projectTitleError,
      "Please enter your project title"
    );
    const pt = randomAlphaNumeric(4);
    cy.findElement(projectOverview.projectTitleTxtBox).scrollIntoView()
      .type(pt)
    cy.clickSomethingElse(projectOverview.scopeTxtBox).then(() => {
      cy.findElement(projectOverview.projectTitleTxtBox).scrollIntoView();
      cy.findElement(projectOverview.projectTitleError).should("not.exist");      
    });   
    //enter morethan 60 characters
    const projectTitle = randomAlphaNumeric(61);
    cy.findElement(projectOverview.projectTitleTxtBox).scrollIntoView().should("be.visible")
      .clear().type(projectTitle).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          projectOverview.projectTitleError,
          "Title cannot exceed 60 characters"
        );
      });
    //scope is blank
    cy.verifyRequiredInput(
      projectOverview.scopeTxtBox,
      projectOverview.scopeError,
      "Please describe the scope of your requirement"
    );
    cy.findElement(projectOverview.scopeTxtBox).scrollIntoView()
      .type(pt);
    cy.clickSomethingElse(projectOverview.emergencyDeclarationControl).then(() => {
      cy.findElement(projectOverview.scopeTxtBox).scrollIntoView();
      cy.findElement(projectOverview.scopeError).should("not.exist");      
    }); 
    //morethan 300 
    const scope = randomAlphaNumeric(301);
    cy.findElement(projectOverview.scopeTxtBox).scrollIntoView().should("be.visible")
      .clear().type(scope)
      .blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          projectOverview.scopeError,
          "Please limit your description to 300 characters or less"
        );
      });
    //Emergency decalartion is blank
    cy.radioBtn(projectOverview.radioBtnNo, "NO").focus();
    cy.clickSomethingElse(projectOverview.emergencyDeclarationControl)
      .then(() => {
        cy.checkErrorMessage(
          projectOverview.emergencyDeclarationControl,
          "Please select an option"
        );
      });
    //Project disclaimer is blank
    cy.verifyRequiredCheckbox(
      projectOverview.projDisChxkBox,
      projectOverview.projDisBoxError,
      "You must acknowledge compliance with your Military-specific policies."
    );
  });

});      
