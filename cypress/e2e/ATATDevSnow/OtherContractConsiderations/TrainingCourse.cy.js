import { bootstrapMockApis,cleanText,colors,randomString}from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";


describe.skip("Test suite: Training substep: Training Course", () => {

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
  });
      
  it("TC1: Training Courses", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepTrainingText, " Training ").click({force: true});
    cy.verifyPageHeader("Do you require any specific training courses from your contractors?");
    cy.selectTrainingOption(occ.trainingYesRadioBtn, "YES");
    const expectedText = "In the field(s) below, specify the training courses that contractors" +
      " will be required to complete, based on your requirements and organization policies." +
      " Add or remove as many courses as needed."
    cy.findElement(occ.coiBodyCopyTxt).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedText);
    });
    cy.textExists(occ.reqTrainCoursesLabel, "Required training courses");
    cy.trainingCourseExists();
    const tc1 = randomString(5)
    cy.enterTextInTextField(occ.trainCourseOneTxtBox, tc1);
    //Add Training Another Link exists
    cy.textExists(occ.addAnotherTrainingBtn, "Add another training course");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();    
    //navigates next step Standards and Compliance
    cy.findElement(common.stepStandCompText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
    cy.findElement(common.subStepPIIText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);    
        
  });

  it("TC2: Add another Training Course", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepTrainingText, " Training ").click({force: true});
    cy.verifyPageHeader("Do you require any specific training courses from your contractors?");
    cy.selectTrainingOption(occ.trainingYesRadioBtn, "YES");
    cy.textExists(occ.reqTrainCoursesLabel, "Required training courses");
    //Add Training Another Link exists
    cy.textExists(occ.addAnotherTrainingBtn, "Add another training course").click()
      .then(() => {
        cy.findElement(occ.trainCourseOptionTwo).should("exist");
        cy.findElement(occ.trainCourseOptionTwo).should("contain.text", "2");
        const tc2 = randomString(5)
        cy.enterTextInTextField(occ.trainCourseTwoTxtBox, tc2);
      });
    
  });

  it("TC3: Validation", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepTrainingText, " Training ").click({force: true});
    cy.verifyPageHeader("Do you require any specific training courses from your contractors?");
    cy.selectTrainingOption(occ.trainingYesRadioBtn, "YES");
    cy.textExists(occ.reqTrainCoursesLabel, "Required training courses");
    //Training course input field is blank
    cy.verifyRequiredInput(
      occ.trainCourseOneTxtBox,
      occ.trainCourseError,
      "Please enter the name of your training course."
    );
    //Training course is morethan 300 characters
    const email = randomString(301)
    cy.findElement(occ.trainCourseOneTxtBox).should("be.visible").clear()
      .type(email).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          occ.trainCourseError,
          "Course name cannot exceed 300 characters."
        );
      });
  });

  it("TC4: Delete Training Course", () => {    
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepTrainingText, " Training ").click({force: true});
    cy.verifyPageHeader("Do you require any specific training courses from your contractors?");
    cy.selectTrainingOption(occ.trainingYesRadioBtn, "YES");
    cy.textExists(occ.reqTrainCoursesLabel, "Required training courses");
    cy.trainingCourseExists();
    //Add Training Another Link exists
    cy.textExists(occ.addAnotherTrainingBtn, "Add another training course").click()
      .then(() => {
        cy.findElement(occ.trainCourseOptionTwo).should("exist");
        cy.findElement(occ.trainCourseOptionTwo).should("contain.text", "2");
        const tc2 = randomString(5)
        cy.enterTextInTextField(occ.trainCourseTwoTxtBox, tc2);
        
      });
    cy.trainingCourseExists();
    cy.findElement(occ.trainCourseRemovebtn).click().then(() => {
      cy.findElement(occ.trainCourseOptionTwo).should("not.exist");
    })
        
  });

});
