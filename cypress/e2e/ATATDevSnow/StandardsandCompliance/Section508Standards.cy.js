import { bootstrapMockApis,colors,cleanText,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import sac from "../../../selectors/standComp.sel";

describe("Test suite: SAC: Section 508 Standards", () => {
  
  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();    
  });    
    
  it("TC1: SAC: Section508 Standards is active on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //Verify the Substepis active
    cy.textExists(common.substepSection508Text, " Section 508 Standards ").click(); 
    cy.findElement(common.stepStandCompText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.findElement(common.substepSection508Text)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);     
      
  });

  it("TC2: Asserts: Section 508 standards", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //select radio option as No on PII screen
    cy.selectPiiOption(sac.noPIIRadioOption, "NO");
    //select radio options
    cy.radioBtn(sac.noBAARadioOption, "NO").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.radioBtn(sac.foiaNoOption, "NO").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into your Section 508 Accessibility requirements");
    cy.textExists(
      sac.blueAlertLabel,
      " Section 508 Accessibility Standards for Cloud Computing "
    );
    cy.findElement(sac.scrollBar).should("be.visible");
    const sectionText = "Are the above Section 508 requirements" +
      " sufficient for this acquisition?";
    cy.findElement(sac.secton508Text).should("be.visible").then((el) => {
      let actualTxt = el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(sectionText);
    });
    //radio buttons
    cy.radioBtn(sac.sectionNoRadio, "NO").not("[disabled]");
    cy.radioBtn(sac.sectionYesRadio, "YES").not("[disabled]");
    //About 508 FAQ Link
    cy.textExists(sac.about508Link,
      " How do I determine which Section 508 accessibility requirements apply to my acquisition? "
    );
    //select radio option Yes
    cy.select508Option(sac.sectionYesRadio, "YES");

  });    

  it("TC3: Additional accessibility reqs ", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    cy.textExists(common.substepSection508Text, " Section 508 Standards ").click();
    //select radio option No
    cy.select508Option(sac.sectionNoRadio, "NO");
    //navigate to Additional accessibility screen
    cy.textExists(sac.blueAlertLabel, " Determining your accessibility requirements ");
    cy.textExists(sac.accessibilityLink, " Accessibility Requirements Tool (ART) ");
    const additionalInfo = "Determining your accessibility requirements The" +
      " Accessibility Requirements Tool (ART) is a step-by-step guide that" +
      " helps you determine and properly document IT accessibility requirements" +
      " in contracting documents. From the ART website, you can choose from" +
      " pre-packaged sample procurements for standard ICT products and services or" +
      " start a new procurement to identify your relevant accessibility requirements." +
      " ART will guide you through a series of questions about your procurement," +
      " beginning with potential exceptions. If no exceptions apply, the tool will" +
      " walk you through the criteria for each item in your procurement, then produce" +
      " a comprehensive report detailing all the applicable standards and exceptions" +
      " that apply to your procurement. Copy and paste the ICT procurement language from" +
      " this report into the field below, and we will customize the Section" +
      " 508 requirements in your Description of Work."
    cy.findElement(sac.blueInfoMessageText).should("be.visible").then((el) => {
      let actualTxt = el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(additionalInfo);
    }); 
    cy.textExists(
      sac.operationPerformedLabel,
      "What accessibility requirements do you need to include in your solicitation?"
    )
    const helpText = "Copy/paste the procurement language" +
      " from your custom ART report or from one of the sample procurements.";     
    cy.findElement(sac.accessibilityHelpTxt).should("be.visible").then((el) => {
      let actualTxt = el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(helpText);
    });
    const operationTxt = randomString(5);
    cy.enterTextInTextField(sac.operationTxtBox, operationTxt);
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(common.stepFinancialDetailsText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
  });
  
  it("TC4: Validations: Additional accessibility reqs ", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    cy.textExists(common.substepSection508Text, " Section 508 Standards ").click();
    //select radio options
    cy.select508Option(sac.sectionNoRadio, "NO")
    cy.textExists(sac.blueAlertLabel, " Determining your accessibility requirements ");   
    //validation Message
    cy.verifyRequiredInput(
      sac.operationTxtBox,
      sac.operationTxtError,
      "Please enter your accessibility requirements."
    );    
    
  });

  it("TC5: Navigate back ", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    cy.textExists(common.substepSection508Text, " Section 508 Standards ").click();
    //select radio options
    cy.select508Option(sac.sectionNoRadio, "NO")
    cy.textExists(sac.blueAlertLabel, " Determining your accessibility requirements ");   
    cy.btnExists(common.backBtn, "Back").not("[disabled]").click();
    cy.verifyPageHeader("Let’s look into your Section 508 Accessibility requirements");
    const expectedSelectedOption = "radio_button_checkedNo." +
      " I need to customize the Section 508 Accessibility Standards in my Description of Work."
    cy.findElement(sac.sectionradioActive)
      .then(($radioBtn) => {
        const selectedOption = cleanText($radioBtn.text());        
        expect(selectedOption).to.equal(expectedSelectedOption)
      });
  
  });
});
