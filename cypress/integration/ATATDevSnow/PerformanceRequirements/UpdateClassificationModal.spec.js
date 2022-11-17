import { 
  bootstrapMockApis,  
  getCheckboxIds,   
  getServiceOfferingNames,
  getCheckboxId, 
  getObjectFromArrayByKey,   
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReqs from "../../../selectors/performanceReqs.sel";


describe.skip("Test suite: Gather Requirements-Update Classification modal ", 
  { tags: '@iso-ignore' },  
  () => {
    let serviceOfferingGroups; 

    beforeEach(() => {
      bootstrapMockApis();

      cy.fixture("serviceOfferingGroups").then((data) => {
        serviceOfferingGroups = data;
      });
    
      cy.launchATAT();
      cy.homePageClickAcquisitionPackBtn();
      cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
      cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");
      //Enter the Value for Base
      cy.findElement(contractDetails.baseInputTxtBox).type("12");
      cy.dropDownClick(contractDetails.baseDropdownIcon);
      cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });    
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Do you want to request a PoP start date?");
      cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
      cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    }); 

    it("TC1: Update Classification for SINGLE Level in Gather Requirement screen ", () => {    
      const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)"];    
    
      cy.selectCheckBoxes([contractDetails.level5]);    
    
      cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
      cy.btnClick(common.continueBtn, " Continue ");    
      cy.verifyPageHeader(" Let’s work on your performance requirements ");    
      const expectedLabels = [];
      serviceOfferingGroups.forEach((obj) => {
        expectedLabels.push(obj.label);
      });    
      cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

      const machineObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "MACHINELEARNING" 
      );
    
      const machineCheckBoxId = getCheckboxId(machineObj.value);    
      cy.selectServiceOfferingGroup([machineCheckBoxId]);
    
      //Navigates to the next page
      cy.verifyPageHeader("What type of " + machineObj.label + " do you need?");             
      cy.verifyCheckBoxLabels('input[type=checkbox]', machineObj.serviceOfferingCypressLabels);
    
      const labels = getServiceOfferingNames(machineObj);
      const checkboxIds = getCheckboxIds(machineObj);
    
      cy.selectCheckBoxes([checkboxIds[1]]);
      cy.btnClick(common.continueBtn, " Continue ");  
    
      //Navigates to the Gather your requirement screen
      cy.verifyPageHeader(
        "Next, we’ll gather your requirements for " + labels[1]
      );
    
      cy.textExists(performanceReqs.updateLink, "update your Classification Requirements").click()
        .then(() => {
          cy.findElement(performanceReqs.updateModal).should("be.visible");
          const modalTitle = "What classification level(s) are required" +
          " for your cloud resources and/or services?"
          cy.verifyTextMatches(
            performanceReqs.modaltitle,
            modalTitle);
          const modalMessage = "Changes to the selections below will be" +
          " reflected in the overall Classification Requirements section." +
          " If you select more than one, we will ask you to specify a" +
          " level for each performance requirement."
          cy.verifyTextMatches(
            performanceReqs.modalMessage,
            modalMessage);
          cy.verifyCheckBoxLabels(
            performanceReqs.modalCheckboxes, 
            selectedClassLevelsLabels
          );
          cy.findElement(performanceReqs.changeLevelBtn).should("be.disabled");
          cy.selectCheckBoxes([contractDetails.modalLevel2]).then(() => {
            cy.findElement(performanceReqs.changeLevelBtn).should("not.be.disabled")
              .click().then(() => {
                cy.verifyPageHeader(
                  "Next, we’ll gather your requirements for " + labels[1]
                );
                const updatedClassLevels = [
                  "Unclassified / Impact Level 2 (IL2)",
                  "Unclassified / Impact Level 5 (IL5)"
                ];
                cy.verifyCheckBoxLabels(performanceReqs.classCheckboxes,
                  updatedClassLevels);
                            
              });
          });
        });    
    });

    it("TC2: Uncheck all checkboxes on Update Classification modal", () => {
      const selectedClassLevelsLabels = [
        "Unclassified / Impact Level 5 (IL5)",
        "Secret / Impact Level 6 (IL6)"
      ];    
    
      cy.selectCheckBoxes([contractDetails.level5,contractDetails.level6]);   
    
      cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
      cy.btnClick(common.continueBtn, " Continue ");    
      cy.verifyPageHeader(" Let’s work on your performance requirements ");    
      const expectedLabels = [];
      serviceOfferingGroups.forEach((obj) => {
        expectedLabels.push(obj.label);
      });    
      cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

      const iotObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "IOT" 
      );
    
      const iotCheckBoxId = getCheckboxId(iotObj.value);    
      cy.selectServiceOfferingGroup([iotCheckBoxId]);
    
      //Navigates to the next page
      cy.verifyPageHeader("What type of " + iotObj.label + " do you need?");             
      cy.verifyCheckBoxLabels('input[type=checkbox]', iotObj.serviceOfferingCypressLabels);
    
      const labels = getServiceOfferingNames(iotObj);
      const checkboxIds = getCheckboxIds(iotObj);
    
      cy.selectCheckBoxes([checkboxIds[1]]);
      cy.btnClick(common.continueBtn, " Continue ");  
    
      //Navigates to the Gather your requirement screen
      cy.verifyPageHeader(
        "Next, we’ll gather your requirements for " + labels[1]
      );
      cy.verifyCheckBoxLabels(performanceReqs.classCheckboxes,
        selectedClassLevelsLabels);
      cy.verifyTextMatches(
        performanceReqs.contentAboutClass,
        "I need this requirement within a different classification level. What do I do?"
      ).click({ force: true });
      cy.textExists(performanceReqs.updateLink, "update your Classification Requirements").click()
        .then(() => {
          cy.findElement(performanceReqs.updateModal).should("be.visible");
          const modalTitle = "What classification level(s) are required" +
          " for your cloud resources and/or services?"
          cy.verifyTextMatches(
            performanceReqs.modaltitle,
            modalTitle);
          cy.verifyCheckBoxLabels(
            performanceReqs.modalCheckboxes,
            selectedClassLevelsLabels);
          cy.findElement(performanceReqs.classReqAlertMess).should("exist");
          cy.findElement(performanceReqs.changeLevelBtn).should("be.disabled");     
          cy.deselectAllCheckboxes([contractDetails.level5, contractDetails.level6])
            .then(() => {
              cy.checkErrorMessage(performanceReqs.modalCheckboxesError,
                "Please select at least one classification level.");
              cy.findElement(performanceReqs.changeLevelBtn).should("be.disabled");
              cy.btnClick(performanceReqs.cancelBtn, "Cancel ");
              cy.verifyPageHeader(
                "Next, we’ll gather your requirements for " + labels[1]
              );
              cy.verifyCheckBoxLabels(
                performanceReqs.classCheckboxes,
                selectedClassLevelsLabels);
            });
        });    
    });
  
    it("TC3: Update for Classification MULTIPLE Levels in Gather Requirement screen", () => {
      const selectedClassLevelsLabels = [
        "Unclassified / Impact Level 4 (IL4)",
        "Unclassified / Impact Level 5 (IL5)",
        "Secret / Impact Level 6 (IL6)"
      ];    
    
      cy.selectCheckBoxes([contractDetails.level4,contractDetails.level5,contractDetails.level6]);
    
      cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
      cy.btnClick(common.continueBtn, " Continue ");    
      cy.verifyPageHeader(" Let’s work on your performance requirements ");    
      const expectedLabels = [];
      serviceOfferingGroups.forEach((obj) => {
        expectedLabels.push(obj.label);
      });    
      cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

      const dataObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "DATABASE" 
      );
    
      const dataCheckBoxId = getCheckboxId(dataObj.value);    
      cy.selectServiceOfferingGroup([dataCheckBoxId]);
    
      //Navigates to the next page
      cy.verifyPageHeader("What type of " + dataObj.label + " do you need?");             
      cy.verifyCheckBoxLabels('input[type=checkbox]', dataObj.serviceOfferingCypressLabels);
    
      const labels = getServiceOfferingNames(dataObj);
      const checkboxIds = getCheckboxIds(dataObj);
    
      cy.selectCheckBoxes([checkboxIds[1]]);
      cy.btnClick(common.continueBtn, " Continue ");  
    
      //Navigates to the Gather your requirement screen
      cy.verifyPageHeader(
        "Next, we’ll gather your requirements for " + labels[1]
      );
      cy.verifyCheckBoxLabels(performanceReqs.classCheckboxes,
        selectedClassLevelsLabels);
      cy.verifyTextMatches(
        performanceReqs.contentAboutClass,
        "I need this requirement within a different classification level. What do I do?"
      ).click({ force: true });
      cy.textExists(performanceReqs.updateLink, "update your Classification Requirements").click()
        .then(() => {
          cy.findElement(performanceReqs.updateModal).should("be.visible");
          const modalTitle = "What classification level(s) are required" +
          " for your cloud resources and/or services?"
          cy.verifyTextMatches(
            performanceReqs.modaltitle,
            modalTitle);
          cy.verifyCheckBoxLabels(
            performanceReqs.modalCheckboxes,
            selectedClassLevelsLabels);
          cy.findElement(performanceReqs.classReqAlertMess).should("exist");
          cy.findElement(performanceReqs.changeLevelBtn).should("be.disabled");     
          cy.findElement(performanceReqs.level6).uncheck({ force: true })
            .then(() => {
              cy.findElement(performanceReqs.classReqAlertMess).should("exist");
              cy.findElement(performanceReqs.changeLevelBtn).should("not.be.disabled");
              cy.btnClick(performanceReqs.changeLevelBtn, " Change Levels ");
              cy.verifyPageHeader(
                "Next, we’ll gather your requirements for " + labels[1]
              );
              const updatedClassLevels = [
                "Unclassified / Impact Level 4 (IL4)",
                "Unclassified / Impact Level 5 (IL5)",];
              cy.verifyCheckBoxLabels(
                performanceReqs.classCheckboxes,
                updatedClassLevels);
            });
        });    
    });

    it("TC4: If two Classification levels exists,then Update Levels ", () => {
      const selectedClassLevelsLabels = [
        "Unclassified / Impact Level 4 (IL4)",
        "Secret / Impact Level 6 (IL6)"
      ];    
    
      cy.selectCheckBoxes([contractDetails.level4,contractDetails.level6]);   
    
      cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
      cy.btnClick(common.continueBtn, " Continue ");    
      cy.verifyPageHeader(" Let’s work on your performance requirements ");    
      const expectedLabels = [];
      serviceOfferingGroups.forEach((obj) => {
        expectedLabels.push(obj.label);
      });    
      cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

      const adObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "ADVISORY" 
      );
    
      const adCheckBoxId = getCheckboxId(adObj.value);    
      cy.selectServiceOfferingGroup([adCheckBoxId]);
    
      //Navigates to the next page
      cy.verifyPageHeader("What type of " + adObj.label + " do you need?");             
      cy.verifyCheckBoxLabels('input[type=checkbox]', adObj.serviceOfferingCypressLabels);
    
      const labels = getServiceOfferingNames(adObj);
      const checkboxIds = getCheckboxIds(adObj);
    
      cy.selectCheckBoxes([checkboxIds[1]]);
      cy.btnClick(common.continueBtn, " Continue ");  
    
      //Navigates to the Gather your requirement screen
      cy.verifyPageHeader(
        "Next, we’ll gather your requirements for " + labels[1]
      );
      cy.verifyCheckBoxLabels(performanceReqs.classCheckboxes,
        selectedClassLevelsLabels);
      cy.verifyTextMatches(
        performanceReqs.contentAboutClass,
        "I need this requirement within a different classification level. What do I do?"
      ).click({ force: true });
      cy.textExists(performanceReqs.updateLink, "update your Classification Requirements").click()
        .then(() => {
          cy.findElement(performanceReqs.updateModal).should("be.visible");
          const modalTitle = "What classification level(s) are required" +
          " for your cloud resources and/or services?"
          cy.verifyTextMatches(
            performanceReqs.modaltitle,
            modalTitle);
          cy.verifyCheckBoxLabels(
            performanceReqs.modalCheckboxes,
            selectedClassLevelsLabels);
          cy.findElement(performanceReqs.classReqAlertMess).should("exist");
          cy.findElement(performanceReqs.changeLevelBtn).should("be.disabled");     
          cy.findElement(performanceReqs.level6).uncheck({ force: true })
            .then(() => {
              cy.findElement(performanceReqs.classReqAlertMess).should("exist");
              cy.findElement(performanceReqs.changeLevelBtn).should("not.be.disabled");
              cy.btnClick(performanceReqs.changeLevelBtn, " Change Levels ");
              cy.verifyPageHeader(
                "Next, we’ll gather your requirements for " + labels[1]
              );
              cy.findElement(performanceReqs.classCheckboxes).should("not.to.exist");
            });
        });    
    });

  });
