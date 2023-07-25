import {
    randomString,
    randomAlphaNumeric,
    randomNumber,
    prefixId,
    noToCurrency,
    cleanText
} from "../../../../helpers";
import fo from "../../../../selectors/fairOpportunityProcess.sel";
import org from "../../../../selectors/org.sel";
import contact from "../../../../selectors/contact.sel";
import common from "../../../../selectors/common.sel";
import contactInfo from "../../../../fixtures/contactInfo.json";
import commonCorAcor from "../../../../selectors/commonCorAcor.sel";

describe("Test suite: E2E-Exception to Fair Opportunity", () => {

    const pt = "TC-Step-2-EvalCriteria-FairOpp-" + randomAlphaNumeric(5);
    const scope = "EvaluationCriteria-FairOpp-" + randomString(5);
    const contactInformation = {
        firstNameSelector: contact.fNameTxtBox,
        firstName: contactInfo.firstName,
        mNameSelector: contact.mNameTxtBox,
        mName: contactInfo.middleName,
        lastNameSelector: contact.lNameTxtBox,
        lastName: contactInfo.lastName,
        emailSelector: contact.emailTxtBox,
        email: contactInfo.email
    };
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
        dodText: "D0DCCA"
    };
    const fairOpp = "YES_FAR_16_505_B_2_I_C"; //YES_FAR_16_505_B_2_I_A//YES_FAR_16_505_B_2_I_B;
    const oneCSP = "YES_FAR_16_505_B_2_I_B";
    const allFair = "YES_FAR_16_505_B_2_I_C";
    const urgent = "YES_FAR_16_505_B_2_I_A";
    const csp = "Oracle";
    const descJustificationText = "Justificaiton- " + randomString(5);
    const minGovInputText = "Min gov req-" + randomString(5);
    let addTimeCost = "Yes";//Yes//No
    const costEstimateInputTxt = randomNumber(4);
    const costEstimate = noToCurrency(costEstimateInputTxt);
    let estDelayVal = "365";//year=1,week=52,month=12,days=365;
    let dropDownOption = "days";// months,year,days,weeks;
    let govEngineer = "Yes";//Yes//No
    const pName = " Unique Cloud- " + randomString(3);
    const insuffInput = "Insufficient value- " + randomString(5);
    let specificFeaProduct = "Yes";
    const productInputVal = "uniquePro - " + randomString(3);
    let isProductOrFeature = "feature";//product//feature
    const whyEssInputVal = "Entering Ess value for testing- " + randomString(3);
    const whyInadequateInputVal = "Entering Inadequate value for testing- " + randomString(3);

    const reviewSoleSourceSitVal = cleanText(`The only source capable of performing the ${pt} at the level of quality required is the incumbent contractor, ${csp} Cloud. The refactoring of the current environment from the ${csp} Cloud environment to another CSP would result in additional cost and time. Migration from one platform to another platform would cost ${costEstimate} and delay the project ${estDelayVal} ${dropDownOption}. In addition, there would be a duplication of costs of having to keep the solution running on one platform while refactoring it on another platform. Further, the only source capable of performing the ${pt} at the level and quality required is Oracle Cloud based on Government engineers being trained and certified in ${productInputVal}. Due to ..., there is insufficient time to retrain and obtain certification in another platform/technology.${insuffInput} The only source capable of performing the ${pt} at the level and quality required is Oracle Cloud based on that is peculiar to Oracle Cloud. This ${isProductOrFeature} is essential to the Government’s requirements due to...${whyEssInputVal} Other similar ${isProductOrFeature}s do not meet, nor can be modified to meet, the Government’s requirements due to...${whyInadequateInputVal}`);
    const reviewDescVal = cleanText(`${csp} possesses the knowledge, skills, capabilities, certification, clearance, and experience required to continue the program without a break or degradation in critical mission services. Given these critical mission requirements, ${csp} is the only contractor that is capable of performing the necessary services for the DoD within the current required timeline.`);

    const soleSourceSitVal = "customsoleSourcesituation-Test";
    let exisitingEnv = "Yes";
    const procurementInputVal = "ProcurementTxt- " + randomString(5);
    const procurementImpactInputVal = "ProcurementImpact- " + randomString(5);
    const descImpactInputVal = "descImpactInput- " + randomString(5);

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
            force: true
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
        cy.clickSideStepper(
            common.stepEvaluationCriteriaLink,
            " Evaluation Criteria "
        );
        cy.activeStep(common.stepEvaluationCriteriaText);
        cy.verifyPageHeader(
            "Let’s see if you qualify for an exception to fair opportunity"
        );
    });

    function handleTimeCost(addTimeCost, dropDownOption, estDelayVal) {
        if (addTimeCost === "Yes") {
            cy.radioBtn(fo.addTimeCostYesOption, "YES").click({
                force: true
            });
            cy.findElement(fo.estCostMigrateInput)
                .clear()
                .type(costEstimateInputTxt);
            const dropdownMap = {
                year: fo.estDelayDropdownYear,
                months: fo.estDelayDropdownMonth,
                weeks: fo.estDelayDropdownWeek,
                days: fo.estDelayDropdownDays
            };
            cy.selectTimePeriodDropdown(
                fo.estDelayDropdownIcon,
                dropdownMap[dropDownOption],
                fo.estDelayProjectInput,
                estDelayVal
            );
        } else {
            cy.radioBtn(fo.addTimeCostNoOption, "NO").click({
                force: true
            });
        }
    }

    function handleGovEngineer(govEngineer, pName, insuffInput) {
        if (govEngineer === "Yes") {
            cy.radioBtn(fo.govEngineersYesOption, "YES").click({
                force: true
            });
            cy.enterTextInTextField(fo.platNameInput, pName);
            cy.findElement(fo.InsufficientInput).type(insuffInput);
        } else {
            cy.radioBtn(fo.govEngineersNoOption, "NO").click({
                force: true
            });
        }
    }

    function handleSpecificFeatureProduct(
        specificFeaProduct,
        isProductOrFeature,
        productInputVal,
        whyEssInputVal,
        whyInadequateInputVal
    ) {
        if (specificFeaProduct === "Yes") {
            cy.radioBtn(fo.featureYesOption, "YES").click({
                force: true
            });
            const optionMap = {
                product: fo.productOption,
                feature: fo.featureOption
            };
            cy.findElement(optionMap[isProductOrFeature]).click({
                force: true
            });
            cy.findElement(fo.productInputBox)
                .scrollIntoView()
                .clear()
                .type(productInputVal);
            cy.findElement(fo.whyEssInputBox).type(whyEssInputVal);
            cy.findElement(fo.whyInadequateInputBox).type(whyInadequateInputVal);
        } else {
            cy.radioBtn(fo.featureNoOption, "NO").click({
                force: true
            });
        }
    }

    function handleSoleSourceSituation(
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

    it("TC1: Proposed CSP", () => {
        if (fairOpp === oneCSP) {
            cy.radioBtn(fo.radioOneCSP, oneCSP).click({
                force: true
            });
        } else if (fairOpp === allFair) {
            cy.radioBtn(fo.radioAllFair, allFair).click({
                force: true
            });
        } else if (fairOpp === urgent) {
            cy.radioBtn(fo.radioUrgent, urgent).click({
                force: true
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
        handleTimeCost(addTimeCost, dropDownOption, estDelayVal);
        handleGovEngineer(govEngineer, pName, insuffInput);
        handleSpecificFeatureProduct(
            specificFeaProduct,
            isProductOrFeature,
            productInputVal,
            whyEssInputVal,
            whyInadequateInputVal
        );
        handleSoleSourceSituation(
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
                force: true
            });
            cy.findElement(fo.procurementImpactInput, procurementImpactInputVal);
        } else {
            cy.radioBtn(fo.exisitngEnvNoOption, "NO").click({
                force: true
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
});



