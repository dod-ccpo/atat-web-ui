import { acquisitionPackageDetails } from "../helpers/mockedAPICalls/acquisitionPackageDetails";
import { contractDetails } from  "../helpers/mockedAPICalls/contractDetails";
import { financialDetails } from "../helpers/mockedAPICalls/financialDetails";
import { otherContractConsiderations } from "../helpers/mockedAPICalls/otherContractConsiderations";
import { standardsAndCompliance } from "./mockedAPICalls/standardsAndCompliance";
import { background } from "./mockedAPICalls/background";
import { common } from "./mockedAPICalls/common";
import { fairOpportunityProcess } from "./mockedAPICalls/fairOpportunityProcess";
import { performanceRequirements } from "./mockedAPICalls/performanceRequirements";


const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}api/now/table/${tableName}`;
}

const buildAttachmentApiPath = (attachment)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}api/now/${attachment}`;
}

const filterTestCases = (testCases, testCase) => {
  return testCases.filter(
    (fixture)=>fixture.testCase === parseInt(testCase)
  );
}

const specPath = window.Cypress.spec.name.toLowerCase().split("/");

/**
 * 
 * accommodates for .spec.ts files that have predefined 
 * test suites (read: in folders), and those that don't
 * @returns string: testSuite
 */
let testSuite = ()=>{
  let _testSuite = specPath.length === 3 
    ? specPath[specPath.length-2]
    : "";
  return _testSuite.split(".")[0];
}
const spec = specPath[specPath.length-1].split(".")[0];
const fixtureFolder = testSuite() + "/" + spec;
const saveToSNOW = (testCase)=>{
  let currentTestEndPoints = [];
  
  /** contract details */
  if (testSuite() === "acquisitionpackagedetails"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(acquisitionPackageDetails(fixtureFolder)[spec], testCase)
    );
  }
  
  /** contract details */
  if (testSuite() === "contractdetails"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(contractDetails(fixtureFolder)[spec], testCase)
    );
  }
  
  /** financialDetails */
  if (testSuite() === "financialdetails"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(financialDetails(fixtureFolder)[spec], testCase)
    );
  }

  /** otherContractConsiderations */
  if (testSuite() === "othercontractconsiderations"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(otherContractConsiderations(fixtureFolder)[spec], testCase)
    );
  }

  /** standardsAndCompliance */
  if (testSuite() === "standardsandcompliance"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(standardsAndCompliance(fixtureFolder)[spec], testCase)
    );
  }

  /** performancerequirements */
  if (testSuite() === "performancerequirements") {    
    currentTestEndPoints = currentTestEndPoints.concat(      
      filterTestCases(performanceRequirements(fixtureFolder)[spec], testCase)
    );
  }

  /** background */ 
  if (testSuite() === "background"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(background(fixtureFolder)[spec], testCase)
    );
  }

  /** common */
  if (spec === "common"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(common(fixtureFolder)[spec], testCase)
    );
  }

  /** fairOpportunityProcess */
  if (spec === "fairopportunityprocess") {
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(fairOpportunityProcess(fixtureFolder)[spec], testCase)
    );
  };


  
  currentTestEndPoints.forEach((ep)=>{
    /**
     * middleware needed for routes to executed in 
     * the order listed
     */
    
    const isAttachmentAPI = ep.apiURL.indexOf('attachment') > -1;
    const routeMatcher = {
      "method": ep.action,
      "url": isAttachmentAPI ? buildAttachmentApiPath(ep.apiURL): buildTableApiPath(ep.apiURL),
      "middleware": true
    }
    if (ep.times){
      routeMatcher.times = ep.times;
    }

    // craft static response
    let staticResponse = {
      "fixture": "saveToSNOW/" + ep.fixture,
      "statusCode":  ep.statusCode || 201,
    }

    cy.intercept(routeMatcher,(req)=>{
      req.reply(staticResponse)
    }).as(ep.fixture);

  });

}

export { saveToSNOW };