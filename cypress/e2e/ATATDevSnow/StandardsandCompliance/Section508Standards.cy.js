import {randomString,randomAlphaNumeric} from "../../../helpers";
import sac from "../../../selectors/standComp.sel";

describe("Test suite: SAC: Section 508 Standards", () => {
  
  const pt = "TC-Step-6-SAC-580-" + randomAlphaNumeric(5);
  const scope = "SAC-section508Standards-" + randomString(5);
  const sectionText = "Are the above Section 508 requirements" +
  " sufficient for this acquisition?";
  const radioLabels=[
    "Yes.", 
    "No. I need to customize the Section 508 Accessibility Standards in my Description of Work."
  ];
  const operationTxt = randomString(5);  
  const helpText = "Copy/paste the procurement language" +
  " from your custom ART report or from one of the sample procurements."; 

  beforeEach(() => {
    cy.goToSaCStep(
      pt,
      scope
    );
    cy.selectPiiOption(sac.noPIIRadioOption, "NO");     
    cy.selectBAAOption(sac.noBAARadioOption, "NO");    
    cy.selectFOIAOption(sac.foiaNoOption, "NO"); 
        
  });    
    

  it("TC1: Asserts: Section 508 standards", () => {
    
    cy.textExists(sac.blueAlertLabel, " Section 508 Accessibility Standards for Cloud Computing ");
    cy.findElement(sac.scrollBar).should("be.visible");   
    cy.verifyTextMatches(sac.secton508Text,sectionText);      

    //About 508 FAQ Link
    cy.textExists(sac.about508Link,
      " How do I determine which Section 508 accessibility requirements apply to my acquisition? "
    );  
    //radio buttons
    cy.verifyRadioGroupLabels(sac.section508RadioGroup, radioLabels);
    cy.select508Option(sac.sectionYesRadio,"YES");
    cy.clickBackButton(
      sac.priceEstimateAlert,
      "Let’s look into your Section 508 Accessibility requirements"
      );
    cy.verifySelectedRadioOption(
      sac.sectionradioActive,
      "radio_button_checkedYes."
      );
    
  });

  it("TC2: Validations: Section 508 standards ", () => {    
    // radio options are not selected
    cy.radioBtn(sac.sectionYesRadio, "YES").focus()
    cy.clickSomethingElse(sac.sectionradioError)
      .then(() => {
        cy.checkErrorMessage(sac.sectionradioError, "Please select an option");
      });

  });

  it("TC3: Additional accessibility reqs ", () => {   
    //select radio options
    cy.select508Option(sac.sectionNoRadio, "NO")
    cy.textExists(sac.blueAlertLabel, " Determining your accessibility requirements ");
    cy.textExists(sac.accessibilityLink, " Accessibility Requirements Tool (ART) ");   
    cy.textExists(
      sac.operationPerformedLabel,
      "What accessibility requirements do you need to include in your Description of Work?"
    );       
    cy.verifyTextMatches(sac.accessibilityHelpTxt,helpText);      
    cy.enterTextInTextField(sac.operationTxtBox, operationTxt);
    cy.clickContinueButton(
      sac.operationTxtBox,
      "Let’s work on a price estimate for your cloud requirements"
      );
    cy.clickBackButton(
      sac.priceEstimateAlert,
      "Tell us more about your Section 508 Accessibility requirements"
      );
    cy.verifyEnteredInputTxt(sac.operationTxtBox, operationTxt);
  });
  
  it("TC4: Validations: Additional accessibility reqs ", () => {    
    //select radio options
    cy.select508Option(sac.sectionNoRadio, "NO");
    cy.textExists(sac.blueAlertLabel, " Determining your accessibility requirements ");   
    //validation Message
    cy.verifyRequiredInput(
      sac.operationTxtBox,
      sac.operationTxtError,
      "Please enter your accessibility requirements."
    );    
    
  });

});
