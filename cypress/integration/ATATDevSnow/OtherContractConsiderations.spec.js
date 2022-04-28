import { bootstrapMockApis,colors,cleanText ,randomAlphaNumeric} from "../../helpers";
import common from "../../selectors/common.sel";
import org from "../../selectors/org.sel";
import occ from "../../selectors/occ.sel";

describe("Test suite: Other Contract Considerations Step", () => {
  let orgAddressType;

  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("orgAddressType").then((types) => {
      orgAddressType = types;
    });
    cy.launchATAT();
        
  });    
    
  it("TC1: Other Contract Considerations on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepPIIText, " Personally Identifiable Information (PII) ");
    cy.textExists(common.subStepBAAText, " Business Associate Agreement (BAA) ");
    cy.textExists(common.substepPDOIText, " Public Disclosure of Information ");
    cy.textExists(common.substepSection508Text, " Section 508 Standards "); 
    cy.findElement(common.stepOCCText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
    cy.findElement(common.subStepPIIText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
      .click();     
      
  });

  it("TC2: Asserts: PII", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ")
    cy.textExists(common.header,
      " Let's find out if your effort provides for Personally Identifiable Information ");
    const expectedPIIText = "Personally Identifiable Information (PII)" +
      " PII is information about an individual which identifies, links," +
      " relates, or is unique to an individual. Examples include social" +
      " security number, age, military rank, civilian grade, etc. that" +
      " can be used to distinguish or track an individual's identity."
    cy.findElement(occ.blueInfoMessageText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(expectedPIIText);

    });
    //Assert Radio option label
    const piiOptionTextLabel = "Does this effort provide for the design," +
      " development, or operation of a system of records on individuals" +
      " by the contractor (in whole or in part)?"
    cy.findElement(occ.piiRadioOptionText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(piiOptionTextLabel);
    });
    //Asserts radio options
    cy.radioBtn(occ.yesPIIRadioOption, "Yes").not("[disabled]");
    cy.radioBtn(occ.noPIIRadioOption, "No").not("[disabled]");
    //Links Exists
    cy.textExists(occ.piiLink, " Why do we need to know about PII? ")
      .click({ force: true }).then(() => {
        const piiFAQTxt = "If this effort provides for the design," +
          " development, or operation of a system of records on" +
          " individuals (in whole or in part), then the contracting" +
          " officer must include the following clauses in the solicitation:"
        cy.findElement(occ.piiFAQText).then(($el) => {
          let actualTxt = $el.text();
          cy.log(actualTxt);
          const formattedTxt = cleanText(actualTxt);
          expect(formattedTxt).equal(piiFAQTxt);
          cy.textExists(occ.patLink, "FAR 52.224-1");
          cy.textExists(occ.paLink, "FAR 52.224-2");
          cy.textExists(occ.moreInfoLink, "FAR 24.1, Protection of Individual Privacy.");
        })
      
      });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });

  it("TC3: PII: Select radio option: Yes", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ")
    //select radio option as yes
    cy.selectPiiOption(occ.yesPIIRadioOption, "Yes");
    cy.textExists(common.header, "Tell us more about your system of records");
    //Assert textbox labels
    cy.textExists(occ.systemLabel, " System name ");
    cy.textExists(occ.operationPerformedLabel, "What is the operation of work to be performed?");
    //enter the Values in the Textboxs
    const systemName = randomAlphaNumeric(9);
    cy.enterTextInTextField(occ.systemNameTextBox, systemName);
    const operationPerformed = randomAlphaNumeric(15);
    cy.enterTextInTextField(occ.operationPerformedTextBox, operationPerformed);
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    //navigates to BAA screen
    cy.textExists(occ.baaLabelText, "Business Associate Agreements (BAA)");
    cy.findElement(common.subStepBAAText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
  });

  it("TC4: PII: Select radio option: No", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ")
    //select radio option as No
    cy.selectPiiOption(occ.noPIIRadioOption, "No");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });
  
  it("TC5: Asserts: BAA", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    //select radio option as No
    cy.selectPiiOption(occ.noPIIRadioOption, "No");
    cy.textExists(occ.baaLabelText, "Business Associate Agreements (BAA)");
    const expectedPHIText = "Protected Health Information (PHI) is information which relates" +
      " to the past, present, or future physical or mental health or condition of any individual." +
      " Per the Health Insurance Portability and Accountability Act of 1996 (HIPAA), a BAA is" +
      " required between the mission owner and the business associate to provide assurance that" +
      " the business associate will appropriately safeguard PHI when it is transmitted or" +
      " maintained in electronic (e-PHI) or any other form. Learn more about business" +
      " associates and BAAs."
    cy.findElement(occ.phiTextMessage).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(expectedPHIText);
    });
    cy.textExists(occ.learnMoreBAALink, "Learn more about business associates and BAAs.");
    //Assert Radio option label
    const baaOptionTextLabel = "Does this effort provide for definition of a" +
      " Business Associate who may be involved in but not limited to design or development" +
      " (in whole or in part) of the system, and/or for creating, receiving, transmitting," +
      " managing, and disposing of PHI?"
    cy.findElement(occ.baaRadioOptionText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(baaOptionTextLabel);
    });
    //Asserts radio options
    cy.radioBtn(occ.yesBAARadioOption, "Yes").not("[disabled]");
    cy.radioBtn(occ.noBAARadioOption, "No").not("[disabled]");
    //About Business Associates info Link
    cy.textExists(occ.aboutBALink, " Why do we need to know about business associates? ").click()
      .then(() => {
        const BAAFAQTxt = "Per HIPAA, a BAA is required when PHI is transmitted" +
          " and maintained in electronic (e-PHI) or any other form or medium and" +
          " in combination with one or more of the 18 identifiers defined by HIPAA." +
          " DISA strives to protect the confidentiality, integrity, and availability" +
          " of e-PHI by permitting a business associate to create, receive, maintain," +
          " or transmit e-PHI on its behalf, only if there is written agreement" +
          " between DISA and the business associate that provides assurance that" +
          " the business associate will appropriately safeguard such e-PHI." +
          " Business associate must also obtain same business associate agreements from" +
          " its subcontractors. For more information, reference Business Associate and PHI," +
          " CFR title 45 part 160.103 and BAA, CFR title 45 part 164.308 (b)(4)."
        cy.findElement(occ.contentAboutBA).then(($el) => {
          let actualTxt = $el.text();
          cy.log(actualTxt);
          const formattedTxt = cleanText(actualTxt);
          expect(formattedTxt).equal(BAAFAQTxt);
          cy.textExists(occ.moreInfoBAALink,
            "Business Associate and PHI, CFR title 45 part 160.103");
        });
      
      });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });
  
  it("TC6: BAA: Select the radio options", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    //select radio option as No
    cy.selectPiiOption(occ.noPIIRadioOption, "No");
    //Select radio options
    const infoAlert = "As a mission owner, it is your responsibility to obtain the appropriate" +
      " agreements with your business associate(s). Business associates must also obtain BAAs" +
      " from their subcontractors. You do not need to provide these agreements in your" +
      " acquisition package. For sample BAA provisions, visit" +
      " https://www.hhs.gov/hipaa/for-professionals/covered-entities/" +
      " sample-business-associate-agreement-provisions/index.html."
    cy.radioBtn(occ.yesBAARadioOption, "Yes").click({ force: true })
      .then(() => {
        cy.findElement(occ.infoAlert).should("be.visible").then((el) => {
          let actualTxt = el.text();
          cy.log(actualTxt);
          const formattedTxt = cleanText(actualTxt);
          expect(formattedTxt).equal(infoAlert);            
        });
      });
    
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true })
      .then(() => {
        cy.findElement(occ.infoAlert).should("not.be.visible")
      });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();

    //navigates to next substep
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");    
    cy.findElement(common.substepPDOIText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
  });

  it("TC7: Asserts: FOIA", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    //select radio option as yes
    cy.selectPiiOption(occ.noPIIRadioOption, "No");
    
    //select radio options
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.textExists(occ.foiaLearnLink, " Learn more about FOIA. ").click()
      .then(() => {
        cy.findElement(occ.foiaLearnDrawer).should("exist");
        cy.textExists(occ.learnMoreDrawerLabel, " Learn More ");
        cy.textExists(occ.learnMoreHeaderTxt,
          "Understanding the Freedom of Information Act (FOIA)");
        cy.textExists(occ.learnMoreFOIAUrl, "https://www.foia.gov");
        //close the side panel
        cy.findElement(occ.learnMoreDrawerClose).should("be.visible").click();
        cy.findElement(occ.foiaLearnDrawer).not("be.visible");

      });
    cy.textExists(occ.foiaFAQLink, " How does FOIA impact my acquisition package? ").click()
      .then(() => {
        cy.findElement(occ.foiaFAQText).should("be.visible");
        cy.findElement(occ.foiaFAQLink).click()
      });
    cy.radioBtn(occ.foiaYesOption, "true").not("[disabled]");
    cy.radioBtn(occ.foiaNoOption, "false").not("[disabled]");
    //select No option
    cy.selectFOIAOption(occ.foiaNoOption, "false")
    cy.textExists(occ.blueAlertLabel, " Section 508 Accessibility Standards for Cloud Computing ");
      
  });
  
  it("TC8: FOIA cordinator: Foreign address", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    //select radio option as yes
    cy.selectPiiOption(occ.noPIIRadioOption, "No");
    
    //select radio options
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.selectFOIAOption(occ.foiaYesOption, "true");
    //asserts the labels
    cy.textExists(occ.fullNameLabel, " Full name ");
    cy.textExists(occ.fullNameHelpTxt, " Include rank, if applicable ");
    cy.textExists(occ.emailLabel, " Email address ");
    cy.textExists(occ.emailHelpTxt, " Enter a .mil or .gov email address. ");
    //enter the values in the text
    const fullName = randomAlphaNumeric(5)
    cy.enterTextInTextField(occ.fullNameTxtBox, fullName)
    const email = randomAlphaNumeric(5) + "@test.mil"
    cy.enterTextInTextField(occ.emailTxtbox,email)
    //radio buttons        
    cy.radioBtn(org.usaRadioBtn, "US").not("[disabled]");
    cy.radioBtn(org.militaryradioBtn, "MILITARY").not("[disabled]");
    cy.radioBtn(org.foreignradioBtn, "FOREIGN").not("[disabled]");

    //verify the labels when the radio butotn is selected
    cy.selectTypeOfMailingAddress(org.usaRadioBtn, "US");
    cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");
    cy.selectTypeOfMailingAddress(org.foreignradioBtn, "FOREIGN");
    const orgAddress = {
      streetAddress : orgAddressType.StreetAddress,
      unit : orgAddressType.Unit2,            
      city : orgAddressType.city2,
      state:   "",
      zipCode: orgAddressType.postalCode1,
      apoFPOSelector :    "",
      statecodeSelector :    "",
      stateProvince :    orgAddressType.stateProvince2,
      inputCountryName :    orgAddressType.country
        
    }
    //enter the text in the text fields
    cy.enterOrganizationAddress(orgAddress);
      
  });

  it("TC9: FOIA cordinator: Military", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.clickSideStepper(common.substepPDOIText, " Public Disclosure of Information ");
    //select radio option as yes
    cy.selectFOIAOption(occ.foiaYesOption, "true");
    //enter the values in the text
    const fullName = randomAlphaNumeric(5)
    cy.enterTextInTextField(occ.fullNameTxtBox, fullName)
    const email = randomAlphaNumeric(5) + "@test.mil"
    cy.enterTextInTextField(occ.emailTxtbox, email);
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");
    const orgAddress = {
      streetAddress: orgAddressType.StreetAddress1,
      unit : orgAddressType.Unit,            
      city : "",
      state:   "",
      zipCode: orgAddressType.Zipcode,
      apoFPOSelector : org.apoFpoDropDownListItemsArmy,
      statecodeSelector : org.stateCodeAmerica,
      stateProvince :orgAddressType.stateProvince2,
      inputCountryName : orgAddressType.country
            
    }
    cy.enterOrganizationAddress(orgAddress);
      
  });

  it("TC10: FOIA cordinator: U.S Address", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.clickSideStepper(common.substepPDOIText, " Public Disclosure of Information ");
    //select radio option as yes
    cy.selectFOIAOption(occ.foiaYesOption, "true");
    //enter the values in the text
    const fullName = randomAlphaNumeric(5)
    cy.enterTextInTextField(occ.fullNameTxtBox, fullName)
    const email = randomAlphaNumeric(5) + "@test.mil"
    cy.enterTextInTextField(occ.emailTxtbox, email);
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.usaRadioBtn, "US");

    //Enter the Orgranization address details
    const orgAddress = {
      streetAddress: orgAddressType.StreetAddress2,
      unit: orgAddressType.Unit,
      city: orgAddressType.City,
      state: orgAddressType.State,
      zipCode: orgAddressType.Zipcode,
            
    }
    cy.enterOrganizationAddress(orgAddress);
        
    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();
    //navigates to next substep
    cy.findElement(".v-main__wrap").scrollTo('top', { easing: 'linear' });
    cy.textExists(common.header, "Let’s look into your Section 508 Accessibility requirements");
    
  });

  it("TC7: Asserts: Section 508 standards", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    //select radio option as No on PII screen
    cy.selectPiiOption(occ.noPIIRadioOption, "No");

    //select radio options
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.radioBtn(occ.foiaNoOption, "false").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into your Section 508 Accessibility requirements");
    cy.textExists(occ.blueAlertLabel, " Section 508 Accessibility Standards for Cloud Computing ");
    cy.findElement(occ.scrollBar).should("be.visible");
    const sectionText = "Are the above Section 508 requirements" +
      " sufficient for this acquisition?";
    cy.findElement(occ.secton508Text).should("be.visible").then((el) => {
      let actualTxt = el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(sectionText);      
    });
    //radio buttons
    cy.radioBtn(occ.sectionYesRadio, "true").not("[disabled]").click({ force: true });
    cy.radioBtn(occ.sectionNoRadio, "false").not("[disabled]").click({ force: true });

    //About 508 FAQ Link
    cy.textExists(occ.about508Link,
      " How do I determine which Section 508 accessibility requirements apply to my acquisition? "
    );  
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(common.stepEvaluationCriteriaText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
  });

});
