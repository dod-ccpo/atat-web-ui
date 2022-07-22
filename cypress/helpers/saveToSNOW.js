
const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}api/now/table/${tableName}`;
}

const buildAttachmentApiPath = (attachment)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}api/now/${attachment}`;
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

export function saveToSNOW(testCase){
  let currentTestEndPoints = [];
  let acquistionpackagedetails = [
    {
      'fixture': 'projectOverview',
      'apiURL': 'x_g_dis_atat_project_overview',
      'action': 'POST',
    },  
    {
      'fixture': 'organization',
      'apiURL': 'x_g_dis_atat_organization',
      'action': 'POST',
    },  
    {
      'fixture': 'contacts',
      'apiURL': 'x_g_dis_atat_contacts',
      'action': 'POST',
    }
  ].filter((fixture)=>fixture.testCase === parseInt(testCase));
  currentTestEndPoints =  currentTestEndPoints.concat(acquistionpackagedetails);
  /** contract details */
  if (spec === "classificationrequirements"){
    let classificationrequirements = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },

    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(classificationrequirements);
  }

  if (spec === "contracttype"){
    let contractType = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_contractType_POST_1',
        'apiURL': 'x_g_dis_atat_contract_type',
        'action': 'POST',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(contractType);
  }
  if (spec === "workflow"){
    let workflow = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_PATCH_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_PATCH_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_contractType_POST_1',
        'apiURL': 'x_g_dis_atat_contract_type',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_classificationLevel_GET_1',
        'apiURL': 'x__g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
    
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(workflow);
  }

  /** financialDetails */
  if (spec === "financialpoc"){
    const financialPOC = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },      
      {
        'fixture': fixtureFolder + '/TC1_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingIncrement_POST_1',
        'apiURL': 'x_g_dis_atat_funding_increment',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingPlan_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingIncrement_GET_1',
        'apiURL': 'x_g_dis_atat_funding_increment/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_PATCH_2',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_contacts_POST_1',
        'apiURL': 'x_g_dis_atat_contacts',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },      
      {
        'fixture': fixtureFolder + '/TC2_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_fundingIncrement_POST_1',
        'apiURL': 'x_g_dis_atat_funding_increment',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_fundingPlan_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_fundingIncrement_GET_1',
        'apiURL': 'x_g_dis_atat_funding_increment/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_PATCH_2',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(financialPOC);
  };    
  
  if (spec === "fundingplan"){
    const fundingPlan = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_2',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_2',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingRequesrMIPR_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request_mipr',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(fundingPlan);
  }
  if (spec === "ginvoicing"){
    const gInvoicing = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingRequestFSForm_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestFSForm_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestFSForm_GET_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestFSForm_GET_2',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestFSForm_GET_3',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundReqFSForm_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundReqFSForm_PATCH_2',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestFSForm_GET_4',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_attachment_POST_2',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestFSForm_PATCH_3',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestFSForm_GET_5',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },      
      {
        'fixture': fixtureFolder + '/TC4_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_fundingRequestFSForm_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_fundingRequestFSForm_GET_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_fundingRequestFSForm_GET_2',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_fundReqFSForm_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_fundingRequestFSForm_GET_3',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingRequestFSForm_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingRequestFSForm_GET_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingRequestFSForm_GET_2',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' :5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundReqFSForm_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingRequestFSForm_GET_3',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_attachment_DELETE_1',
        'apiURL': 'attachment/**',
        'action': 'DELETE',
        'statusCode': 204,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingRequestFSForm_GET_4',
        'apiURL': 'x_g_dis_atat_funding_request_fs_form/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },      
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(gInvoicing);
  };
  if (spec === "ifpbaseperiod"){
    const ifpBasePeriod = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },      
      {
        'fixture': fixtureFolder + '/TC1_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingIncrement_POST_1',
        'apiURL': 'x_g_dis_atat_funding_increment',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingPlan_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },   
      {
        'fixture': fixtureFolder + '/TC1_fundingIncrement_GET_1',
        'apiURL': 'x_g_dis_atat_funding_increment/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_PATCH_2',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },      
      {
        'fixture': fixtureFolder + '/TC2_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },      
      {
        'fixture': fixtureFolder + '/TC3_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_fundingPlan_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(ifpBasePeriod);
  };

  if (spec === "incrementalfunding"){
    const incrementalFunding = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_2',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_requirementsCostEstimate_POST_1',
        'apiURL': 'x_g_dis_atat_requirements_cost_estimate',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_PATCH_1',
        'apiURL': 'x_g_dis_atat_task_order/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_2',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(incrementalFunding);
  };

  if (spec === "mipr"){
    const mipr = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingRequestMIPR_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request_mipr',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingRequestMIPR_POST_2',
        'apiURL': 'x_g_dis_atat_funding_request_mipr',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingRequestMIPR_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_request_mipr/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingRequestMIPR_POST_3',
        'apiURL': 'x_g_dis_atat_funding_request_mipr',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingRequestMIPR_GET_1',
        'apiURL': 'x_g_dis_atat_funding_request_mipr/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },      
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequest_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },  
      {
        'fixture': fixtureFolder + '/TC3_fundingRequest_GET_1',
        'apiURL': 'x_g_dis_atat_funding_request/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestMIPR_POST_1',
        'apiURL': 'x_g_dis_atat_funding_request_mipr',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },       
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestMIPR_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_request_mipr/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestMIPR_GET_1',
        'apiURL': 'x_g_dis_atat_funding_request_mipr/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },      
      {
        'fixture': fixtureFolder + '/TC3_attachment_DELETE_1',
        'apiURL': 'attachment/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingRequestMIPR_GET_2',
        'apiURL': 'x_g_dis_atat_funding_request_mipr/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      }
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(mipr);
  };
  if (spec === "requirementscostestimate"){
    const requirementsCostEstimate = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_requirementsCostEstimate_POST_1',
        'apiURL': 'x_g_dis_atat_requirements_cost_estimate',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(requirementsCostEstimate);
  }

  /** otherContractConsiderations */
  if (spec === "conflictofinterest"){
    currentTestEndPoints =  currentTestEndPoints.concat([
      {
        'fixture': fixtureFolder + '/taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'action': 'POST',
        'times': 1,
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
    ]);
  }
  if (spec === "packagingpackingshipping"){
    currentTestEndPoints =  currentTestEndPoints.concat([
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1
      },
    ]);
  }
  if (spec === "training"){
    currentTestEndPoints =  currentTestEndPoints.concat([
      {
        'fixture': fixtureFolder + '/taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_PATCH_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_2',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_PATCH_2',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1
      },
    ]);
  }
  if (spec === "trainingcourse"){
    currentTestEndPoints =  currentTestEndPoints.concat([
      {
        'fixture': fixtureFolder + '/taskOrder_POST',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/taskOrder_GET',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'GET',
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_2',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'times': 1,
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_2',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'times': 1,
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_PATCH_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1
      }
    ]);
  }
    
  /** standardsAndComplaince */
  if (spec === "baa"){
    const baa = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      }, 
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },   
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      }, 
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
     
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(baa);
  }
  if (spec === "foia"){
    const foia = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },  
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 4,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 7
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 7
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 8
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 8
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 9
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 9
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },

    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(foia);
  }
  if (spec === "pii"){
    const pii = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4,
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 4,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(pii);
  }
  if (spec === "section508standards"){
    const section508standards = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 2,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4,
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 4,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(section508standards);
  }

  
  if (spec === "background"){
    const background = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 3,
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 4,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5,
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(background);
  }

  if (spec === "common"){
    const common = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(common);
  }

  /** fairOpportunityProcess */
  if (spec === "fairopportunityprocess") {
    const fairOpportunityProcess = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fairOpportunity_POST_1',
        'apiURL': 'x_g_dis_atat_fair_opportunity',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase': 3
      },
    ].filter((fixture) => fixture.testCase === parseInt(testCase));
    currentTestEndPoints = currentTestEndPoints.concat(fairOpportunityProcess);
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