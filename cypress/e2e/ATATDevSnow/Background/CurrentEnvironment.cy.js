import background from "../../../selectors/background.sel";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import { bootstrapMockApis,randomAlphaNumeric, randomNumber} from "../../../helpers";

//Temporaily skipping these tests,need to update
describe.skip("Test suite: Current Environment ", () => {

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.contractOption(background.currentYesRadioOption, "YES");
    cy.verifyPageHeader("Let’s gather some details about your current contract");
    //enter Values in the input fields
    const inputText = randomAlphaNumeric(8);
    cy.enterTextInTextField(background.incumbentTxtBox, inputText);
    const contractNoValue = randomNumber(8);
    cy.enterTextInTextField(background.contractNoTxtBox, contractNoValue);
    const taskOrderNo = randomNumber(10);
    cy.enterTextInTextField(background.taskDeliveryOrderNoTxtBox, taskOrderNo);
    //click on Calendar icon
    cy.findElement(background.expirationDatePickerIcon).should("exist").click();
    //select the date from calendar picker
    cy.findElement(background.navigateNextMonth).scrollIntoView()
      .click({ force: true }).then(() => {
        cy.findElement(background.selectDate).first().click({force: true});
      });      
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you have a current environment to rehost?");
        
  })    

  it("TC1: Select Radio Option Yes on existing environment",
    () => {      
      const introTextInfo = "If you select “Yes” below," +
        " we’ll gather details about your current compute resources next." +
        " This info will be included in your Description of Work to provide" +
        " CSPs with a better understanding of what currently exists." +
        " This environment may not align with your current needs for this acquisition," +
        " but you’ll have an opportunity to tell us about your performance" +
        " requirements later."
      cy.verifyTextMatches(common.introText, introTextInfo);
      cy.selectExistingEnv(background.existYesRadioOption, "true");
      cy.findElement(background.existNoRadioOption).click({ force: true });
      cy.btnClick(common.continueBtn, " Continue ");
      const introText = "If you have instances in a hybrid environment," +
        " then we will gather details about the location for each instance later."
      cy.verifyTextMatches(common.introText, introText);
      //able to select the radio buttons
      cy.findElement(background.cceRadiobutton).click({force:true});
      cy.findElement(background.opRadioButton).click({ force: true }); 
      cy.findElement(background.hceRadioButton).click({force:true});       
      cy.btnClick(common.continueBtn, " Continue ");
      //Navigates to Classification level
      cy.verifyPageHeader("What classification level(s) are your instances deployed in?");
      let selectClassifications = [contractDetails.level4, background.topSecret];
      cy.selectCheckBoxes(selectClassifications);
      cy.btnClick(common.continueBtn, " Continue ");
    
    });

  it("TC2: Select Radio Option No on existing environment screen",
    () => {
            
      cy.selectExistingEnv(background.existNoRadioOption, "false");      
    
    });
  
});
