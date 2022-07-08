
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

export function saveToSNOW(testCase){
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
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_fundingPlan_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'PATCH',
        'statusCode': 200,
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
    acqPackageEndPoints =  acqPackageEndPoints.concat(fundingPlan);
  }
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
        'fixture': fixtureFolder + '/TC5_period_GET_1',
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
    acqPackageEndPoints =  acqPackageEndPoints.concat(incrementalFunding);
  };
  if (spec === "mipr"){
    const mipr = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_fundingPlan_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'PATCH',
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
        'fixture': fixtureFolder + '/TC3_fundingPlan_POST_1',
        'apiURL': 'x_g_dis_atat_funding_plan',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_attachment_POST_1',
        'apiURL': 'attachment/file**',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fundingPlan_PATCH_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
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
        'fixture': fixtureFolder + '/TC3_fundingPlan_DELETE_1',
        'apiURL': 'x_g_dis_atat_funding_plan/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 3
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    acqPackageEndPoints =  acqPackageEndPoints.concat(mipr);
  };
  if (spec === "requirementscostestimate"){
    const requirementsCostEstimate = [
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
        'fixture': fixtureFolder + '/TC2_requirementsCostEstimate_POST_1',
        'apiURL': 'x_g_dis_atat_requirements_cost_estimate',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    acqPackageEndPoints =  acqPackageEndPoints.concat(requirementsCostEstimate);
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
    acqPackageEndPoints =  acqPackageEndPoints.concat(baa);
  }



  acqPackageEndPoints.concat(
    contractDetailsEndPoints,
    
  ).forEach((ep)=>{
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