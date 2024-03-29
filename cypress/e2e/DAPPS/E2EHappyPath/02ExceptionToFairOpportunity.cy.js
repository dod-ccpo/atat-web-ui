import {
  randomString,
  randomAlphaNumeric,
  randomNumber,
  prefixId,
  noToCurrency,
  cleanText,
  formatDateWithPeriod,
  formatDateWithoutPeriod,
} from "../../../helpers";
import fo from "../../../selectors/fairOpportunityProcess.sel";
import org from "../../../selectors/org.sel";
import contact from "../../../selectors/contact.sel";
import common from "../../../selectors/common.sel";
import contactInfo from "../../../fixtures/contactInfo.json";
import commonCorAcor from "../../../selectors/commonCorAcor.sel";
import ac from "../../../selectors/acor.sel";
import { jaSet1, jaSet2, jaSet3 } from "../../../sharedData/sharedData";

const dataSets = [jaSet1, jaSet2, jaSet3];
describe("Test suite: Step02-Exception to Fair Opportunity", () => {  

  const dataSetIndex = Cypress.env("jaDataSetIndex");
  const dataSet = dataSets[dataSetIndex];
  
  const {
    acor,
    exceptionToFairOpp,
    contractAction,
    techniques,
    addTimeCost,
    estDelayVal,
    dropDownOption,
    govEngineer,
    specificFeaProduct,
    isProductOrFeature,
    capablesourceOption,
    reviewCatalogSectionOption,
    researchSameDate,
    followOn,
    logicalException,
    purgeTraining,
    reqIaaS,
    priorProcurement
  } = dataSet;
  //Set values for Step1
  const pt = "TC-Step-2-EvalCriteria-FairOpp-" + randomAlphaNumeric(5);
  const scope = "EvaluationCriteria-FairOpp-" + randomString(5);

  //Selection of Contact details
  const contactInformation = {
    firstNameSelector: contact.fNameTxtBox,
    firstName: contactInfo.firstName,
    mNameSelector: contact.mNameTxtBox,
    mName: contactInfo.middleName,
    lastNameSelector: contact.lNameTxtBox,
    lastName: contactInfo.lastName,
    emailSelector: contact.emailTxtBox,
    email: contactInfo.email,
  };

  //Selection of COR
  const phoneInputSelector = prefixId(commonCorAcor.phoneInputBox, "COR_");
  const contactDetails = {
    firstNameSelector: contact.fNameTxtBox,
    firstName: contactInfo.firstName2,
    mNameSelector: contact.mNameTxtBox,
    mName: contactInfo.middleName1,
    lastNameSelector: contact.lNameTxtBox,
    lastName: contactInfo.lastName1,
    emailSelector: commonCorAcor.emailTxtBox,
    email: contactInfo.email,
    cor: "cor",
    dodText: "D0DCCA",
  };

  //Selection of  ACOR
  
  const acorDetails = {
    firstNameSelector: contact.fNameTxtBox,
    firstName: contactInfo.firstName1,
    mNameSelector: contact.mNameTxtBox,
    mName: contactInfo.middleName2,
    lastNameSelector: contact.lNameTxtBox,
    lastName: contactInfo.lastName2,
    emailSelector: commonCorAcor.emailTxtBox,
    email: contactInfo.email,
    cor: "cor",
    dodText: "D0DCCA",
  };
  const phoneInputACORSelector = prefixId(commonCorAcor.phoneInputBox, "ACOR_");

  //Selection of Exception to Fair Opp  
  const fairOpp = exceptionToFairOpp;
  const oneCSP = "YES_FAR_16_505_B_2_I_B";
  const allFair = "YES_FAR_16_505_B_2_I_C";
  const urgent = "YES_FAR_16_505_B_2_I_A";

  //Selection of CSP
  const csp = "Oracle";
  const descJustificationText = "Justificaiton- " + randomString(5);
  const minGovInputText = "Min gov req-" + randomString(5);

  //Selection of Cause Sole situation
  const costEstimateInputTxt = randomNumber(4);
  const costEstimate = noToCurrency(costEstimateInputTxt); 
  const pName = " Unique Cloud- " + randomString(3);
  const insuffInput = "Insufficient value- " + randomString(5);
  const productInputVal = "uniquePro - " + randomString(3);
  const whyEssInputVal = "Entering Ess value for testing- " + randomString(3);
  const whyInadequateInputVal =
    "Entering Inadequate value for testing- " + randomString(3);
  // eslint-disable-next-line max-len
  const reviewSoleSourceSitVal = cleanText(
    "The only source capable of performing the " +
      pt +
      " at the level of quality required is the incumbent contractor, " +
      csp +
      " Cloud. The refactoring of the current environment from the " +
      csp +
      " Cloud environment to another CSP would result in additional cost and time." +
      " Migration from one platform to another platform would cost " +
      costEstimate +
      " and delay the project " +
      estDelayVal +
      " " +
      dropDownOption +
      ". In addition, there would be a duplication of costs of having to keep the solution " +
      "running on one platform while " +
      "refactoring it on another platform. Further, the only source capable of performing the " +
      pt +
      " at the level and quality required is Oracle Cloud based on Government engineers " +
      "being trained and certified in " +
      pName +
      ". Due to ..., there is insufficient time to retrain and obtain certification in another" +
      " platform/technology." +
      insuffInput +
      " The only source capable of performing the " +
      pt +
      " at the level and quality required is" +
      " Oracle Cloud based on " +
      productInputVal +
      " that is peculiar to Oracle Cloud. This " +
      isProductOrFeature +
      " is essential to the Government’s requirements due to..." +
      whyEssInputVal +
      " Other similar " +
      isProductOrFeature +
      "s do not meet, nor can be modified to meet, the Government’s requirements due to..." +
      whyInadequateInputVal
  );
  // eslint-disable-next-line max-len
  const reviewDescVal = cleanText(`${csp} possesses the knowledge, skills, capabilities, certification, clearance, and experience required to continue the program without a break or degradation in critical mission services. Given these critical mission requirements, ${csp} is the only contractor that is capable of performing the necessary services for the DoD within the current required timeline.`
  );
  const soleSourceSitVal = "customsoleSourcesituation-Test";

  //Selection of Procurement
  const exisitingEnv = "Yes";
  const procurementInputVal = "ProcurementTxt- " + randomString(5);
  const procurementImpactInputVal = "ProcurementImpact- " + randomString(5);
  const descImpactInputVal = "descImpactInput- " + randomString(5);

  //Selectionof MRR-Contract action
  const personReliedVal = "personReliedInput- " + randomString(5);
  const otherVal = "otherTechniques-" + randomString(5);
  const techniquesSummaryInputVal = "summaryText- " + randomString(5);

  //Selection  of Market research
  const crResultVal = "Catalog Review Result- " + randomString(5);

  const supportDataVal = "supportdata- " + randomString(5);
  const cd = new Date();
  const selectedDate = formatDateWithoutPeriod(cd, 13, "previous");
  const sameEndDate = formatDateWithoutPeriod(cd, 27, "previous");

  //Review Market Research details
  const researchDetailsVal = "test research details- " + randomString(5);

  //Selection of Conducted,market research
  const name = "TestName" + randomString(2);
  const jobTitle = "JT" + randomString(2);
  const orgName = "org" + randomString(2);

  //Selection of Logical Exception
  const exceptionInputVal = "exceptionalinput- " + randomString(5);

  //Selection of Remove Barriers
  const priorProcurementVal = "priorProcurementTxt- " + randomString(5);
  const currentDate = new Date();
  const formattedDate = formatDateWithPeriod(currentDate);
  const reviewBarrierDetailsVal = cleanText(
    "To overcome future barriers to competition, is preparing a fair opportunity competitive " +
      "follow-on requirement." +
      " The follow-on is expected to be completed, solicited, and awarded by " +
      formattedDate +
      ". To overcome future barriers to competition, will pursue training and certification for" +
      " Government engineers in other technologies. To overcome future barriers to competition," +
      " future development and enhancement of IaaS components" +
      " will include shifting to a containerized platform. This will enable multiple vendors "+
      "to meet the requirements which will enable the flexibility to shift workload based on "+
      "financial and" +
      " mission requirements. " +
      priorProcurementVal
  );
  const barrierDetailsVal = "test barriers details- " + randomString(5);

  //summary:
  const evalPlanDescriptionText = `No Evaluation Plan is required.`;

  before(() => {
    cy.goToAcqPackageStepOne(pt, scope);
    cy.clickContinueButton(
      org.foreignradioBtn,
      "Let’s find out about the primary point of contact for this requirement"
    );
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn, "CIVILIAN");
    cy.enterContactInformation(contactInformation);
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "united",
      contact.countryListItems,
      contact.phoneInputBox,
      "5127845362"
    );
    cy.clickContinueButton(
      contact.emailTxtBox,
      "Let’s gather info about your Contracting Officer’s Representative (COR)"
    );
    cy.findElement(contact.civilianRadioBtn).click({
      force: true,
    });
    cy.enterContactInformation(contactDetails, "COR_");
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Cro",
      contact.countryListItems,
      phoneInputSelector,
      "521136541"
    );
    cy.clickContinueButton(
      contact.civilianRadioBtn,
      "Do you have an Alternate Contracting Officer’s Representative (ACOR)?"
    );

    if (acor === "Yes") {
      cy.findElement(ac.yesRadioBtn).click({
        force: true,
      });
      cy.clickContinueButton(
        ac.yesRadioBtn,
        "Let’s gather info about your ACOR"
      );
      cy.manuallyEnterContactInformation(
        "ACOR_",
        " Your ACOR’s Contact Information ",
        " What role best describes your ACOR’s affiliation with the DoD? ",
        contact.militaryRadioBtn,
        "MILITARY"
      );
      cy.enterContactInformation(acorDetails, "ACOR_");
      cy.enterPhoneNumber(
        contact.phoneControlIcon,
        contact.phoneDropdown,
        "Cana",
        contact.countryListItems,
        phoneInputACORSelector,
        "56987412564"
      );
    } else {
      cy.findElement(ac.noRadioBtn).click({
        force: true,
      });
    }
    cy.clickSideStepper(
      common.stepEvaluationCriteriaLink,
      " Evaluation Criteria "
    );
    cy.activeStep(common.stepEvaluationCriteriaText);
    cy.verifyPageHeader(
      "Let’s see if you qualify for an exception to fair opportunity"
    );
  });

  function selectTimeCost(addTimeCost, dropDownOption, estDelayVal) {
    if (addTimeCost === "Yes") {
      cy.radioBtn(fo.addTimeCostYesOption, "YES").click({
        force: true,
      });
      cy.findElement(fo.estCostMigrateInput).clear().type(costEstimateInputTxt);
      const dropdownMap = {
        year: fo.estDelayDropdownYear,
        months: fo.estDelayDropdownMonth,
        weeks: fo.estDelayDropdownWeek,
        days: fo.estDelayDropdownDays,
      };
      cy.selectTimePeriodDropdown(
        fo.estDelayDropdownIcon,
        dropdownMap[dropDownOption],
        fo.estDelayProjectInput,
        estDelayVal
      );
    } else {
      cy.radioBtn(fo.addTimeCostNoOption, "NO").click({
        force: true,
      });
    }
  }

  function selectGovEngineer(govEngineer, pName, insuffInput) {
    if (govEngineer === "Yes") {
      cy.radioBtn(fo.govEngineersYesOption, "YES").click({
        force: true,
      });
      cy.enterTextInTextField(fo.platNameInput, pName);
      cy.findElement(fo.InsufficientInput).type(insuffInput);
    } else {
      cy.radioBtn(fo.govEngineersNoOption, "NO").click({
        force: true,
      });
    }
  }

  function selectSpecificFeatureProduct(
    specificFeaProduct,
    isProductOrFeature,
    productInputVal,
    whyEssInputVal,
    whyInadequateInputVal
  ) {
    if (specificFeaProduct === "Yes") {
      cy.radioBtn(fo.featureYesOption, "YES").click({
        force: true,
      });
      const optionMap = {
        product: fo.productOption,
        feature: fo.featureOption,
      };
      cy.findElement(optionMap[isProductOrFeature]).click({
        force: true,
      });
      cy.findElement(fo.productInputBox)
        .scrollIntoView()
        .clear()
        .type(productInputVal);
      cy.findElement(fo.whyEssInputBox).type(whyEssInputVal);
      cy.findElement(fo.whyInadequateInputBox).type(whyInadequateInputVal);
    } else {
      cy.radioBtn(fo.featureNoOption, "NO").click({
        force: true,
      });
    }
  }

  function soleSourceSituation(
    addTimeCost,
    govEngineer,
    specificFeaProduct,
    reviewSoleSourceSitVal,
    soleSourceSitVal
  ) {
    if (
      addTimeCost === "Yes" &&
      govEngineer === "Yes" &&
      specificFeaProduct === "Yes"
    ) {
      cy.clickContinueButton(
        fo.featureYesOption,
        "Let’s review the cause of your sole source situation"
      );
      cy.reviewPageTxtMatches(fo.soleSourceSitInputBox, reviewSoleSourceSitVal);
    } else if (
      addTimeCost === "No" &&
      govEngineer === "No" &&
      specificFeaProduct === "No"
    ) {
      cy.clickContinueButton(
        fo.featureYesOption,
        "Tell us about the cause of your sole source situation"
      );
      cy.findElement(fo.soleSourceSitInputBox).should("be.empty");
      cy.enterTextInTextField(fo.soleSourceSitInputBox, soleSourceSitVal);
    }
  }

  function otherTechniquesExists() {
    if (contractAction === "none") {
      cy.findElement(fo.capablesourceYesOption).should("not.be.checked");
      cy.waitUntil(function () {
        return cy.findElement(fo.otherTechniques).should("be.visible");
      });
    } else {
      cy.findElement(fo.otherTechniques).should("not.exist");
    }
  }

  function selectOnlyCapableSource(supportDataVal) {
    if (capablesourceOption === "Yes") {
      cy.findElement(fo.capablesourceYesOption)
        .should("exist")
        .should("be.enabled")
        .and("not.checked")
        .click({
          force: true,
        })
        .should("be.checked");
      cy.findElement(fo.capablesourceActiveOption).then(($radioBtn) => {
        const selectedOption = cleanText($radioBtn.text());
        cy.log(selectedOption);
      });
      cy.findElement(fo.researchDetailsForm)
        .scrollIntoView()
        .should("be.visible");
      cy.textExists(fo.researchQuestion, "When did you conduct this research?");
      cy.selectDatefromDatePicker(
        fo.csStartDateBtn,
        fo.csNavigatePreviousMonth,
        fo.csSelectDate,
        "13",
        fo.csDatePicker
      );
      cy.findElement(fo.supportinput).type(supportDataVal);
    } else {
      cy.findElement(fo.capablesourceNoOption)
        .click({
          force: true,
        })
        .should("be.checked");
    }
  }

  function reviewCatalogSection(crResultVal) {
    if (reviewCatalogSectionOption === "Yes") {
      cy.findElement(fo.reviewCatalogSectionYesOption)
        .should("exist")
        .should("be.enabled")
        .click({
          force: true,
        })
        .should("be.checked");

      cy.findElement(fo.reviewCatalogSectionActiveOption);
      cy.findElement(fo.rcCatSameDateControl)
        .scrollIntoView()
        .should("be.visible");

      if (researchSameDate === "No") {
        cy.findElement(fo.sameDatesNoOption)
          .should("exist")
          .should("be.enabled")
          .click({
            force: true,
          });

        cy.selectDatefromDatePicker(
          fo.crStartDateBtn,
          fo.crNavigatePreviousMonth,
          fo.crSelectDate,
          "27",
          fo.crDatePicker
        );
      } else {
        cy.findElement(fo.sameDatesYesOption)
          .should("exist")
          .should("be.enabled")
          .click({
            force: true,
          })
          .should("be.checked");
      }

      cy.findElement(fo.crResultInput).type(crResultVal);
    } else {
      cy.findElement(fo.reviewCatalogSectionNoOption)
        .click({
          force: true,
        })
        .should("be.checked");
    }
  }

  function selectOtherTechniques(
    techniques,
    personReliedVal,
    otherVal,
    techniquesSummaryInputVal
  ) {
    if (contractAction === "none") {
      const techniquesCBMap = {
        perKnowledge: fo.perKnowledgeCb,
        disaMRR: fo.disaMRRCb,
        contactKnowledge: fo.contactKnowledgeCb,
        reviewDB: fo.reviewDBCb,
        reviewSorceList: fo.reviewSorceListCb,
        reviewProdLit: fo.reviewProdLitCb,
        reviewOtherContracts: fo.reviewOtherContractsCb,
        reviewJWCCCatlog: fo.reviewJWCCCatlogCb,
        other: fo.otherCb,
      };
      for (const technique of techniques) {
        cy.findElement(techniquesCBMap[technique]).click({
          force: true,
        });
      }
      if (techniques.includes("perKnowledge")) {
        cy.findElement(fo.personReliedInput)
          .scrollIntoView()
          .clear()
          .type(personReliedVal);
      } else if (techniques.includes("other")) {
        cy.findElement(fo.otherCb).type(otherVal);
      }
      cy.findElement(fo.techniquesSummaryinput)
        .scrollIntoView()
        .clear()
        .type(techniquesSummaryInputVal);
    }
  }

  function commonMRRReviewText() {
    return cleanText(
      " Additional research was conducted on " +
        selectedDate +
        " by reviewing the specific capabilities in the JWCC Contracts and it was"+
        " determined that " +
        csp +
        " is the only source capable of fulfilling the Government’s" +
        " minimum needs in the manner and time frame required. " +
        supportDataVal +
        " Further research was conducted on " +
        sameEndDate +
        " by reviewing the JWCC contractor's catalogs to determine if other similar offerings" +
        " (to include: " +
        productInputVal +
        ") meet or can be modified to satisfy the Government’s requirements. " +
        "The results have determined that no other offering is suitable as follows..." +
        crResultVal +
        " Therefore, it was determined the " +
        productInputVal +
        " is essential to the Government’s requirements and " +
        csp +
        " is the only source capable of fulfilling the Government’s" +
        " minimum needs in the manner and time frame required."
    );
  }

  function reviewResearchDetailsText() {
    let reviewResearchText = "";
    const commonText =
      " Additional market research was not completed for this effort" +
      " because an exception applies ";

    switch (contractAction) {
    case "none":
      reviewResearchText =
          commonMRRReviewText() + " " + cleanText(techniquesSummaryInputVal);
      break;
    case "bridge":
      reviewResearchText =
          commonMRRReviewText() + `${commonText}(a bridge extension).`;
      break;
    case "undefinitized":
      reviewResearchText = commonMRRReviewText() + `${commonText}(UCA).`;
      break;
    case "optionToExtend":
      reviewResearchText =
          commonMRRReviewText() + `${commonText}(-8 extension).`;
      break;
    }

    return reviewResearchText;
  }

  function selectMRREfforts(
    capablesourceOption,
    reviewCatalogSectionOption,
    contractAction,
    researchDetailsVal
  ) {
    const reviewPageHeaderText = "Let’s review your market research details";
    const tellUsReviewText = "Tell us about your market research details";
    const isCapableSourceYes = capablesourceOption === "Yes";
    const isContractActionNone = contractAction === "none";
    const isReviewCatalogYes = reviewCatalogSectionOption === "Yes";

    if (isCapableSourceYes) {
      if (isReviewCatalogYes && isContractActionNone) {
        cy.clickContinueButton(fo.capablesourceYesOption, reviewPageHeaderText);
        cy.reviewPageTxtMatches(
          fo.researchDetailsInput,
          reviewResearchDetailsText()
        );
      } else if (!isReviewCatalogYes && !isContractActionNone) {
        cy.clickContinueButton(fo.capablesourceYesOption, tellUsReviewText);
        cy.findElement(fo.researchDetailsInput).should("be.empty");
        cy.enterTextInTextField(fo.researchDetailsInput, researchDetailsVal);
      } else if (isReviewCatalogYes && !isContractActionNone) {
        cy.clickContinueButton(fo.capablesourceYesOption, reviewPageHeaderText);
        cy.reviewPageTxtMatches(
          fo.researchDetailsInput,
          reviewResearchDetailsText()
        );
      }
    } else if (!isCapableSourceYes && !isContractActionNone) {
      cy.clickContinueButton(fo.capablesourceYesOption, tellUsReviewText);
      cy.findElement(fo.researchDetailsInput).should("be.empty");
      cy.enterTextInTextField(fo.researchDetailsInput, researchDetailsVal);
    }
  }

  function followOnUniqueOrSpecializedCapabilities() {
    cy.verifyPageHeader(
      "Do you want to include any other facts to support the use of" +
        " the “unique or highly specialized capabilities” exception?"
    );
  }

  function followOnLogicalFollowOn() {
    cy.verifyPageHeader(
      "Do you want to include any other facts to support the use of " +
        "the “logical follow-on” exception?"
    );
  }

  function followOnUnusualAndCompellingUrgency() {
    cy.verifyPageHeader(
      "Do you want to include any other facts to support the use of" +
        " the “unusual and compelling urgency” exception?"
    );
  }

  function followOnException() {
    if (fairOpp === oneCSP) {
      followOnUniqueOrSpecializedCapabilities();
    } else if (fairOpp === allFair) {
      followOnLogicalFollowOn();
    } else if (fairOpp === urgent) {
      followOnUnusualAndCompellingUrgency();
    }
  }

  function selectFollowOn(followOn) {
    if (followOn === "Yes") {
      cy.radioBtn(fo.followOnYesOption, "YES").click({
        force: true,
      });
      cy.selectDatefromDatePicker(
        fo.followOnbtnIcon,
        fo.followOnNavigateNextMonth,
        fo.followOnSelectDate,
        "13",
        fo.followOnDatePicker
      );
    } else {
      cy.radioBtn(fo.followOnNoOption, "NO").click({
        force: true,
      });
    }
  }

  function selectPriorProcurement(priorProcurement, priorProcurementVal) {
    if (priorProcurement === "Yes") {
      cy.radioBtn(fo.priorProcurementYesOption, "YES").click({
        force: true,
      });
      cy.enterTextInTextField(fo.priorProcurementTextBox, priorProcurementVal);
    } else {
      cy.radioBtn(fo.priorProcurementNoOption, "NO").click({
        force: true,
      });
    }
  }

  function selectRemoveBarriers(
    followOn,
    purgeTraining,
    priorProcurement,
    reqIaaS,
    reviewBarrierDetailsVal,
    barrierDetailsVal
  ) {
    if (
      followOn === "Yes" &&
      purgeTraining === "Yes" &&
      priorProcurement === "Yes" &&
      reqIaaS == "Yes"
    ) {
      cy.findElement(fo.priorProcurementNoOption).scrollIntoView();
      cy.clickContinueButton(
        fo.followOnYesOption,
        "Let’s review your agency’s plans to remove barriers to fair opportunity"
      );
      cy.reviewPageTxtMatches(fo.barriersInput, reviewBarrierDetailsVal);
    } else if (
      followOn === "No" &&
      purgeTraining === "No" &&
      reqIaaS == "No" &&
      priorProcurement === "No"
    ) {
      cy.findElement(fo.priorProcurementYesOption).scrollIntoView();
      cy.clickContinueButton(
        fo.followOnYesOption,
        "Tell us how your agency plans to remove barriers to fair opportunity"
      );
      cy.findElement(fo.barriersInput).should("be.empty");
      cy.enterTextInTextField(fo.barriersInput, barrierDetailsVal);
    }
  }

  function gatherPOC() {
    if (acor === "Yes") {
      cy.findElement(fo.techAcorPOC).click({
        force: true,
      });
      cy.findElement(fo.reqCorPOC).click({
        force: true,
      });
    } else {
      cy.findElement(fo.techCorPOC).click({
        force: true,
      });
      cy.findElement(fo.reqPrimaryPOC).click({
        force: true,
      });
    }
  }

  function exceptionToFairOppSummaryDescDetails() {
    let description = "";

    switch (fairOpp) {
    case allFair:
      description = "FAR 16.505(b)(2)(i)(C) – Logical follow-on.";
      break;
    case oneCSP:
      description =
          "FAR 16.505(b)(2)(i)(B) – Unique or highly specialized capabilities.";
      break;
    case urgent:
      description =
          "FAR 16.505(b)(2)(i)(A) – Unusual and compelling urgency.";
      break;
    }

    let descriptionText = "";

    switch (contractAction) {
    case "none":
      descriptionText =
          "A J&A and Sole Source MRR are required in final acquisition package.";
      break;
    case "bridge":
    case "undefinitized":
    case "optionToExtend":
      descriptionText = "A J&A is required in final acquisition package.";
      break;
    }

    const exceptionToFairOppDescriptionText = description + descriptionText;
    cy.verifyTextMatches(
      fo.exceptionToFairOppDescriptionText,
      exceptionToFairOppDescriptionText
    );
  }

  it("TC1: Proposed CSP", () => {
    if (fairOpp === oneCSP) {
      cy.radioBtn(fo.radioOneCSP, oneCSP).click({
        force: true,
      });
    } else if (fairOpp === allFair) {
      cy.radioBtn(fo.radioAllFair, allFair).click({
        force: true,
      });
    } else if (fairOpp === urgent) {
      cy.radioBtn(fo.radioUrgent, urgent).click({
        force: true,
      });
    }
    cy.clickContinueButton(
      fo.radioUrgent,
      "Which CSP does this exception to fair opportunity apply to?"
    );
    cy.selectCSPSelctionOption(fo.buttonOracle);
    cy.enterTextInTextField(fo.descJustifictionInput, descJustificationText);
    cy.clickContinueButton(
      fo.descJustifictionInput,
      "Tell us about your minimum government requirements"
    );
    cy.enterTextInTextField(fo.minGovInput, minGovInputText);
    cy.clickContinueButton(
      fo.minGovInput,
      "Let’s find out more about the cause of the sole source situation"
    );
  });

  it("TC2: Cause sole source situation", () => {
    selectTimeCost(addTimeCost, dropDownOption, estDelayVal);
    selectGovEngineer(govEngineer, pName, insuffInput);
    selectSpecificFeatureProduct(
      specificFeaProduct,
      isProductOrFeature,
      productInputVal,
      whyEssInputVal,
      whyInadequateInputVal
    );
    soleSourceSituation(
      addTimeCost,
      govEngineer,
      specificFeaProduct,
      reviewSoleSourceSitVal,
      soleSourceSitVal
    );
    cy.clickContinueButton(
      fo.soleSourceSitInputBox,
      "Why is " + csp + " the only source capable of meeting your requirements?"
    );
    cy.reviewPageTxtMatches(fo.descJustifictionInput, reviewDescVal);
    cy.clickContinueButton(
      fo.descJustifictionInput,
      "Now let’s find out more about your procurement"
    );
  });

  it("TC3: Procurement Discussion", () => {
    cy.enterTextInTextField(fo.procurementInput, procurementInputVal);
    if (exisitingEnv === "Yes") {
      cy.radioBtn(fo.exisitngEnvYesOption, "YES").click({
        force: true,
      });
      cy.findElement(fo.procurementImpactInput, procurementImpactInputVal);
    } else {
      cy.radioBtn(fo.exisitngEnvNoOption, "NO").click({
        force: true,
      });
    }
    cy.clickContinueButton(
      fo.exisitngEnvYesOption,
      "Tell us about the impact of this requirement"
    );
    cy.enterTextInTextField(fo.descImpactInput, descImpactInputVal);
    cy.clickContinueButton(
      fo.descImpactInput,
      "Now let’s see if you need a Market Research Report (MRR)"
    );
  });
  it("TC4: MRR Contract Action", () => {
    const contractActionsMap = {
      undefinitized: fo.undefinitizedRadioOption,
      bridge: fo.bridgeContractAction,
      optionToExtend: fo.optionToExtend,
      none: fo.noneContractOption,
    };
    cy.findElement(contractActionsMap[contractAction]).click({
      force: true,
    });
    cy.clickContinueButton(
      fo.noneContractOption,
      "Let’s find out more about your market research efforts"
    );
    cy.waitUntil(function () {
      return (
        Cypress.$(fo.capablesourceYesOption).attr("aria-checked") == "false"
      );
    });
    otherTechniquesExists();
    selectOnlyCapableSource(supportDataVal);

    if (specificFeaProduct === "Yes") {
      reviewCatalogSection(crResultVal);
    }
    selectOtherTechniques(
      techniques,
      personReliedVal,
      otherVal,
      techniquesSummaryInputVal
    );
    selectMRREfforts(
      capablesourceOption,
      reviewCatalogSectionOption,
      contractAction,
      researchDetailsVal
    );
    if (contractAction === "none") {
      cy.clickContinueButton(
        fo.researchDetailsInput,
        "Who conducted market research for this effort?"
      );
      cy.enterTextInTextField(fo.name0Txtfield, name);
      cy.enterTextInTextField(fo.title0Txtfield, jobTitle);
      cy.enterTextInTextField(fo.org0Txtfield, orgName);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.waitUntilElementIsGone(fo.name0Txtfield);
    } else {
      cy.btnClick(common.continueBtn, " Continue ");
      cy.waitUntilElementIsGone(fo.researchDetailsInput);
    }
  });
  it("TC5: Exceptions", () => {
    followOnException();
    if (logicalException === "Yes") {
      cy.radioBtn(fo.exceptionYesOption, "YES").click({
        force: true,
      });
      cy.enterTextInTextField(fo.exceptionInput, exceptionInputVal);
    } else {
      cy.radioBtn(fo.exceptionNoOption, "NO").click({
        force: true,
      });
    }
    cy.clickContinueButton(
      fo.exceptionNoOption,
      "Now let’s find out about any actions proposed to remove barriers to fair opportunity"
    );
  });

  it("TC6: Remove Barriers", () => {
    selectFollowOn(followOn);
    const pursingTrainingMap = {
      Yes: fo.pursingYesOption,
      No: fo.pursingNoOption,
    };
    cy.findElement(pursingTrainingMap[purgeTraining]).click({
      force: true,
    });
    const reqIaaSMap = {
      Yes: fo.reqIaaSYesOption,
      No: fo.reqIaaSNoOption,
    };
    cy.findElement(reqIaaSMap[reqIaaS]).click({
      force: true,
    });
    selectPriorProcurement(priorProcurement, priorProcurementVal);

    selectRemoveBarriers(
      followOn,
      purgeTraining,
      priorProcurement,
      reqIaaS,
      reviewBarrierDetailsVal,
      barrierDetailsVal
    );
    cy.clickContinueButton(
      fo.barriersInput,
      "Lastly, let’s gather details about your certification POCs"
    );
    gatherPOC();
    cy.clickContinueButton(
      fo.reqPrimaryPOC,
      "Based on what you told us, you do not need an evaluation plan for this acquisition."
    );
  });

  it("TC7: Evaluation Criteria Summary", () => {
    cy.clickContinueButton(
      fo.evalPlanAlertHeader,
      "Your Evaluation Criteria Summary"
    );
    exceptionToFairOppSummaryDescDetails();
    cy.verifyTextMatches(fo.evalPlanDesriptionText, evalPlanDescriptionText);
  });
});
