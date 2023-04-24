import background from "../../../selectors/background.sel";
import common from "../../../selectors/common.sel"
import { bootstrapMockApis,colors, randomAlphaNumeric, randomNumber} from "../../../helpers";


describe("Test suite: Current Contract", () => {


  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();    
  })
    
  it("TC1: Current Contract on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    //Verify the Substeps are  visible
    cy.textExists(common.substepCurrentContractLink, " Current Contract ");
    cy.textExists(common.substepCurrentEnvironmentLink, " Current Environment ");
    // step is active
    cy.findElement(common.substepCurrentContractText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
      .click();       
        
  });

  it("TC2: Current Contract: Asserts on Do you have a current contract for this effort?", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.textExists(common.header, " Do you have a current contract for this effort? ");
    //assert radio button options
    cy.radioBtn(background.currentYesRadioOption, "YES").not("[disabled]");
    cy.radioBtn(background.currentNoRadioOption, "NO").not("[disabled]");
            
  });

  it("TC3: Current Contract: Validations", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    //validation message for the radio options
    cy.findElement(background.currentYesRadioOption).focus().tab().tab().then(() => {
      cy.checkErrorMessage(background.radioOptionError, "Please select an option");
    });
    cy.contractOption(background.currentYesRadioOption, "YES");

    //Navigates to the current contract substep
    cy.textExists(common.header, "Let’s gather some details about your current contract"); 
    
    //validation error for incumbent text box
    cy.verifyRequiredInput(background.incumbentTxtBox, background.incumbentError,
      "Please enter the incumbent contractor’s name.");
    
    //validation error for contract number text box
    cy.verifyRequiredInput(background.contractNoTxtBox, background.contractNoTxtError,
      "Please enter your contract number.");
    
    //validation error for expiration date picker
    cy.findElement(background.expirationDatePickerInputbox).should("be.visible").clear()
      .click().blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          background.expirationDatePickerError,
          "Please enter your contract/order expiration date."
        );
      });
    
  });
  
  it("TC4: Current Contract: Option Yes: Let’s gather some details about your current contract",
    () => {
      cy.clickSideStepper(common.stepBackgroundLink, " Background ");
      //assert radio button options    
      cy.contractOption(background.currentYesRadioOption, "YES");
      cy.textExists(common.header, "Let’s gather some details about your current contract");

      //assert all the field labels
      cy.textExists(background.incumbentLabel, " Incumbent contractor name ");
      cy.textExists(background.contractNoLabel, " Contract number ");
      cy.textExists(background.taskDeliveryOrderNoLabel, " Task/Delivery order number ");
      cy.textExists(background.expirationDatePickerLabel, " Contract/Order expiration date ");
    
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
      cy.findElement(background.navigateNextMonth).click({force: true}).then(() => {
        cy.findElement(background.selectDate).first().click({force: true});
      });
      cy.btnExists(
        background.noExistingContractBtn,
        " I don’t have an existing contract ").not("[disabled]");
      cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
        
    });

  it("TC5: Click on I don't have an existing contract button ", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.contractOption(background.currentYesRadioOption, "YES");
    cy.btnExists(background.noExistingContractBtn, " I don’t have an existing contract ")
      .not("[disabled]").click();
    cy.findElement(common.stepContractDetailsText).contains(" Contract Details ")
      .and('have.css', 'color', colors.primary);
    
  });
        
  it("TC6: Current Contract: Option No", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.contractOption(background.currentNoRadioOption, "NO");
    
  });
  
});
