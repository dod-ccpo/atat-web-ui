/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const performanceRequirements = (fixtureFolder) => {
  return {    
    computegatheringdetails: [
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
        'fixture': fixtureFolder + '/TC1_classificationLevel_GET_1',
        'apiURL': 'x__g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
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
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' :2
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
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },      
      {
        'fixture': fixtureFolder + '/TC2_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_7',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_8',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_9',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_6',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_7',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' :3
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
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_classificationLevel_GET_1',
        'apiURL': 'x__g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },      
      {
        'fixture': fixtureFolder + '/TC3_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase':3
      },
      {
        'fixture': fixtureFolder + '/TC3_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
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
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_classificationLevel_GET_1',
        'apiURL': 'x__g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },      
      {
        'fixture': fixtureFolder + '/TC4_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase':4
      },
      {
        'fixture': fixtureFolder + '/TC4_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
      },
      {
        'fixture': fixtureFolder + '/TC4_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 4
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
        'fixture': fixtureFolder + '/TC5_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_classificationLevel_GET_1',
        'apiURL': 'x__g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },      
      {
        'fixture': fixtureFolder + '/TC5_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase':5
      },
      {
        'fixture': fixtureFolder + '/TC5_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_periodOfPerformance_GET_7',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC5_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 5
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_periodOfPerformance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_periodOfPerformance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      },
      {
        'fixture': fixtureFolder + '/TC6_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      },
      {
        'fixture': fixtureFolder + '/TC6_classificationLevel_GET_1',
        'apiURL': 'x__g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      },
      {
        'fixture': fixtureFolder + '/TC6_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      },
      {
        'fixture': fixtureFolder + '/TC6_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      },      
      {
        'fixture': fixtureFolder + '/TC6_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      },
      {
        'fixture': fixtureFolder + '/TC6_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      },
      {
        'fixture': fixtureFolder + '/TC6_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      },
      {
        'fixture': fixtureFolder + '/TC6_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase':6
      },
      {
        'fixture': fixtureFolder + '/TC6_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 6
      }
    ],
    computerequirement: [
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
        'fixture': fixtureFolder + '/TC1_classificationLevel_GET_1',
        'apiURL': 'x__g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
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
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_periodOfPerformance_GET_7',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC1_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 1
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
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },      
      {
        'fixture': fixtureFolder + '/TC2_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },      
      {
        'fixture': fixtureFolder + '/TC2_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_periodOfPerformance_GET_7',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC2_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 2
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
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
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
      },
      {
        'fixture': fixtureFolder + '/TC3_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },      
      {
        'fixture': fixtureFolder + '/TC3_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },      
      {
        'fixture': fixtureFolder + '/TC3_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_periodOfPerformance_GET_7',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase': 3
      },
    ]
    
  }
}

export {
  performanceRequirements
};