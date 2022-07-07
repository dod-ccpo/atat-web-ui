
const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}api/now/table/${tableName}`;
}

const buildAttachmentApiPath = (attachment)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}api/now/${attachment}`;
}

const testNames = window.Cypress.spec.name.toLowerCase().split("/");
const testSuite = testNames[testNames.length-2];
const spec = testNames[testNames.length-1].split(".")[0];
const fixtureFolder = testSuite + "/" + spec;

export function saveToSNOW(){
  let acqPackageEndPoints = [
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
  ]
  const contractDetailsEndPoints = [
    {
      'fixture': 'fairOpportunity',
      'apiURL': 'x_g_dis_atat_fair_opportunity',
      'action': 'POST',
    },
    {
      'fixture': 'period',
      'apiURL': 'x_g_dis_atat_period',
      'action': 'POST',
    },
    {
      'fixture': 'periodOfPerformance',
      'apiURL': 'x_g_dis_atat_period_of_performance',
      'action': 'POST',
    },
  ]
  // const financialDetailsEndPoints = [
  //   {
  //     'fixture': 'fairOpportunity',
  //     'apiURL': 'x_g_dis_atat_fair_opportunity',
  //     'action': 'POST',
  //   },
  // ]

  /** financialDetails */
  if (spec === "fundingplan"){
    acqPackageEndPoints =  acqPackageEndPoints.concat([
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_2',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_2',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'statusCode': 201,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingPlan_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/TC5_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'times': 1
      },
    ])
  }

  /** otherContractConsiderations */
  if (spec === "conflictofinterest"){
    acqPackageEndPoints =  acqPackageEndPoints.concat([
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
    acqPackageEndPoints =  acqPackageEndPoints.concat([
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
    acqPackageEndPoints =  acqPackageEndPoints.concat([
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
    acqPackageEndPoints =  acqPackageEndPoints.concat([
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

  acqPackageEndPoints.concat(
    contractDetailsEndPoints,
    
  ).forEach((ep)=>{
    /**
     * middleware needed for routes to executed in 
     * the order listed
     */

    const isAttachment = ep.apiURL.indexOf('attachment') > -1;
    const routeMatcher = {
      "method": ep.action,
      "url": isAttachment ? buildAttachmentApiPath(ep.apiURL): buildTableApiPath(ep.apiURL),
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
    debugger;
    cy.intercept(routeMatcher,(req)=>{
      req.reply(staticResponse)
    }).as(ep.fixture);

  });

}