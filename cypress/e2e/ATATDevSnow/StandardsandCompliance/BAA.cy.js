import { randomString,randomAlphaNumeric} from "../../../helpers";
import sac from "../../../selectors/standComp.sel";

describe("Test suite: SAC step: BAA", () => {

  const pt = "TC-Step-6-SAC-BAA-" + randomAlphaNumeric(5);
  const scope = "SAC-BAA-" + randomString(5);

  const expectedPHIText = "Protected Health Information (PHI)";

  beforeEach(() => {   
    
    cy.goToSaCStep(
      pt,
      scope
    );
    cy.selectPiiOption(sac.noPIIRadioOption, "NO");  
  });
    
  it("TC1: Asserts: BAA", () => {    
    cy.textExists(
      sac.baaAlertHeader,
      "Business Associate Agreements (BAA)"
      );
    cy.verifyTextMatches(sac.phiTextMessage,expectedPHIText);    
    cy.textExists(sac.learnMoreBAALink, "Learn more about business associates and BAAs.");    
    //Asserts radio options
    cy.radioBtn(sac.yesBAARadioOption, "YES").not("[disabled]");
    cy.radioBtn(sac.noBAARadioOption, "NO").not("[disabled]");
    //About Business Associates info Link
    cy.textExists(sac.aboutBALink, " Why do we need to know about business associates? ").click()
      .then(() => {         
        cy.textExists(sac.moreInfoBAALink,
          "Business Associate and PHI, CFR title 45 part 160.103");         
      });
    cy.findElement(sac.aboutBALink).click().then(()=>{
          cy.findElement(sac.aboutBALink)
          .should("have.attr","aria-expanded","false");
      });
    cy.selectBAAOption(sac.yesBAARadioOption, "YES");    
    cy.clickBackButton(
      sac.foiaYesOption,               
      "Let’s find out if you need a Business Associates Agreement"          
      );
    cy.verifySelectedRadioOption(
      sac.baaRadioOptionActive,
      "radio_button_checkedYes."+
      " This contract effort will require a BAA to safeguard PHI."
      );
    
  });
  
  it("TC2: BAA: Select the radio options", () => {    
    cy.selectBAAOption(sac.noBAARadioOption, "NO");
    cy.clickBackButton(
      sac.foiaYesOption,               
      "Let’s find out if you need a Business Associates Agreement"          
      );
    cy.verifySelectedRadioOption(
      sac.baaRadioOptionActive,
      "radio_button_checkedNo."
      );
    
  });

  it("TC4: BAA: Validations", () => {        
    // radio options error
    cy.radioBtn(sac.yesBAARadioOption, "YES").focus()
    .focus();
    cy.clickSomethingElse(sac.baaRadioError)
      .then(()=> {
        cy.checkErrorMessage(sac.baaRadioError, "Please select an option");
      });
    
  });

});
