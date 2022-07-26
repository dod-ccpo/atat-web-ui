/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const contractDetails = (fixtureFolder) => {
  return {
    classificationrequirements: [{
      "fixture": fixtureFolder + "/TC1_taskOrder_POST_1",
      "apiURL": "x_g_dis_atat_task_order",
      "action": "POST",
      "times": 1,
      "testCase": 1
    },
    {
      "fixture": fixtureFolder + "/TC1_classificationLevel_GET_1",
      "apiURL": "x_g_dis_atat_classification_level",
      "action": "GET",
      "statusCode": 200,
      "times": 1,
      "testCase": 1
    },
    {
      "fixture": fixtureFolder + "/TC2_taskOrder_POST_1",
      "apiURL": "x_g_dis_atat_task_order",
      "action": "POST",
      "times": 1,
      "testCase": 2
    },
    {
      "fixture": fixtureFolder + "/TC2_classificationLevel_GET_1",
      "apiURL": "x_g_dis_atat_classification_level",
      "action": "GET",
      "statusCode": 200,
      "times": 1,
      "testCase": 2
    },
    {
      "fixture": fixtureFolder + "/TC3_taskOrder_POST_1",
      "apiURL": "x_g_dis_atat_task_order",
      "action": "POST",
      "times": 1,
      "testCase": 3
    },
    {
      "fixture": fixtureFolder + "/TC3_classificationLevel_GET_1",
      "apiURL": "x_g_dis_atat_classification_level",
      "action": "GET",
      "statusCode": 200,
      "times": 1,
      "testCase": 3
    },
    {
      "fixture": fixtureFolder + "/TC4_taskOrder_POST_1",
      "apiURL": "x_g_dis_atat_task_order",
      "action": "POST",
      "times": 1,
      "testCase": 4
    },
    {
      "fixture": fixtureFolder + "/TC4_classificationLevel_GET_1",
      "apiURL": "x_g_dis_atat_classification_level",
      "action": "GET",
      "statusCode": 200,
      "times": 1,
      "testCase": 4
    },
    {
      "fixture": fixtureFolder + "/TC5_taskOrder_POST_1",
      "apiURL": "x_g_dis_atat_task_order",
      "action": "POST",
      "times": 1,
      "testCase": 5
    },
    {
      "fixture": fixtureFolder + "/TC5_classificationLevel_GET_1",
      "apiURL": "x_g_dis_atat_classification_level",
      "action": "GET",
      "statusCode": 200,
      "times": 1,
      "testCase": 5
    }
    ],
    contracttype: [{
      'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 2
    },
    {
      'fixture': fixtureFolder + '/TC2_periodOfPerformance_POST_1',
      'apiURL': 'x_g_dis_atat_period_of_performance',
      'action': 'POST',
      'times': 1,
      'testCase': 2
    },
    {
      'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 3
    },
    {
      'fixture': fixtureFolder + '/TC3_periodOfPerformance_POST_1',
      'apiURL': 'x_g_dis_atat_period_of_performance',
      'action': 'POST',
      'statusCode': 200,
      'times': 1,
      'testCase': 3
    },
    {
      'fixture': fixtureFolder + '/TC3_contractType_POST_1',
      'apiURL': 'x_g_dis_atat_contract_type',
      'action': 'POST',
      'statusCode': 200,
      'times': 1,
      'testCase': 3
    },
    {
      'fixture': fixtureFolder + '/TC3_classificationLevel_GET_1',
      'apiURL': 'x_g_dis_atat_classification_level',
      'action': 'GET',
      'statusCode': 200,
      'times': 1,
      'testCase': 3
    }
    ],
    pop: [{
      'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 2
    },
    {
      'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 3
    },
    {
      'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 4
    },
    {
      'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 5
    },
    {
      'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 6
    },
    {
      'fixture': fixtureFolder + '/TC7_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 7
    },
    {
      'fixture': fixtureFolder + '/TC8_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 8
    },
    {
      'fixture': fixtureFolder + '/TC9_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 9
    },
    {
      'fixture': fixtureFolder + '/TC10_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 10
    },
    {
      'fixture': fixtureFolder + '/TC11_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 11
    }
    ],
    workflow: [{
      'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_period_POST_1',
      'apiURL': 'x_g_dis_atat_period',
      'action': 'POST',
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_periodOfPerformance_POST_1',
      'apiURL': 'x_g_dis_atat_period_of_performance',
      'action': 'POST',
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_1',
      'apiURL': 'x_g_dis_atat_period_of_performance/**',
      'action': 'GET',
      'statusCode': 200,
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_periodOfPerformance_PATCH_1',
      'apiURL': 'x_g_dis_atat_period_of_performance/**',
      'action': 'PATCH',
      'statusCode': 200,
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_2',
      'apiURL': 'x_g_dis_atat_period_of_performance/**',
      'action': 'GET',
      'statusCode': 200,
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_periodOfPerformance_PATCH_2',
      'apiURL': 'x_g_dis_atat_period_of_performance/**',
      'action': 'PATCH',
      'statusCode': 200,
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_contractType_POST_1',
      'apiURL': 'x_g_dis_atat_contract_type',
      'action': 'POST',
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_classificationLevel_GET_1',
      'apiURL': 'x__g_dis_atat_classification_level',
      'action': 'GET',
      'statusCode': 200,
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_3',
      'apiURL': 'x_g_dis_atat_period_of_performance/**',
      'action': 'GET',
      'statusCode': 200,
      'times': 1,
      'testCase': 1
    },
    {
      'fixture': fixtureFolder + '/TC1_period_GET_1',
      'apiURL': 'x_g_dis_atat_period/**',
      'action': 'GET',
      'statusCode': 200,
      'times': 1,
      'testCase': 1
    }
    ]
  }
}

export {
  contractDetails
};