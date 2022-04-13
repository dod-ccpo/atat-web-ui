import background from "../../selectors/background.sel";
import common from "../../selectors/common.sel"
import { bootstrapMockApis,colors, randomAlphaNumeric, randomNumber} from "../../helpers";


describe("Test suite: BackGround", () => {


  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
        
  })
    
  it("TC1: Background on the Vertical Stepper", () => {
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

  it("TC2: Background:Asserts on Do you have a current contract for this effort?", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.textExists(common.header, " Do you have a current contract for this effort? ");
    //assert radio button options
    cy.radioBtn(background.yesRadioOption, "true").not("[disabled]");
    cy.radioBtn(background.noRadioOpion, "false").not("[disabled]");
            
  });
  
  it("TC3: Background: Option Yes: Asserts on Let’s gather some details about your current contract", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    //assert radio button options    
    cy.contractOption(background.yesRadioOption, "true");
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
    cy.btnExists(background.noExistingContractBtn, " I don’t have an existing contract ").not("[disabled]");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
        
  });

  it("TC4: Click on I don't have an existing contract button ", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.contractOption(background.yesRadioOption, "true");
    cy.btnExists(background.noExistingContractBtn, " I don’t have an existing contract ").not("[disabled]").click();
    cy.findElement(common.stepBackgroundLink).contains(" Background ")
      .and('have.css', 'color', colors.primary);
    
  });
        
  it("TC5: Background: Option No", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.contractOption(background.noRadioOpion, "false");
    
  });

    });
