
/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const performanceRequirements = (fixtureFolder) => {
  return {
    dowflows: [
      {
        'fixture': fixtureFolder + 'TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_classification_level_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_POST_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_DELETE_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_POST_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_DELETE_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_POST_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_DELETE_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_POST_4',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_DELETE_4',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_POST_5',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_7',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_GET_6',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_DELETE_5',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_POST_6',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_8',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_GET_7',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_DELETE_6',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_selected_service_offering_POST_7',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_of_performance_GET_9',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC1_period_GET_8',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + 'TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_classification_level_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_POST_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_DELETE_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_POST_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_DELETE_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_POST_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_DELETE_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_POST_4',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_DELETE_4',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_POST_5',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_GET_7',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_GET_6',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_DELETE_5',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_selected_service_offering_POST_6',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_of_performance_GET_8',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC2_period_GET_7',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + 'TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_of_performance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_of_performance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_classification_level_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_of_performance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_selected_service_offering_POST_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_of_performance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_selected_service_offering_DELETE_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_selected_service_offering_POST_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_of_performance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_selected_service_offering_DELETE_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_selected_service_offering_POST_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_of_performance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC3_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + 'TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_of_performance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_of_performance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_classification_level_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_of_performance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_selected_service_offering_POST_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_of_performance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_selected_service_offering_DELETE_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_selected_service_offering_POST_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_of_performance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_selected_service_offering_DELETE_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_selected_service_offering_POST_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_of_performance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_selected_service_offering_DELETE_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_selected_service_offering_POST_4',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_of_performance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC4_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + 'TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_of_performance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_of_performance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_classification_level_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_of_performance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_selected_service_offering_POST_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_of_performance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_selected_service_offering_DELETE_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_selected_service_offering_POST_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_of_performance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_selected_service_offering_DELETE_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_selected_service_offering_POST_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_of_performance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_selected_service_offering_DELETE_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_selected_service_offering_POST_4',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_of_performance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC5_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + 'TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_POST_1',
        'apiURL': 'x_g_dis_atat_period',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_POST_1',
        'apiURL': 'x_g_dis_atat_period_of_performance',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_1',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_classification_level_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_2',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_1',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_selected_service_offering_POST_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_3',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_2',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_4',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_3',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_selected_service_offering_DELETE_1',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_selected_service_offering_POST_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_5',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_4',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_6',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_5',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_selected_service_offering_DELETE_2',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_selected_service_offering_POST_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_7',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_6',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_8',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_7',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_selected_service_offering_DELETE_3',
        'apiURL': 'x_g_dis_atat_selected_service_offering/**',
        'action': 'DELETE',
        'times': 1,
        'statusCode': 204,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_selected_service_offering_POST_4',
        'apiURL': 'x_g_dis_atat_selected_service_offering',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_9',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_8',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 2,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_of_performance_GET_10',
        'apiURL': 'x_g_dis_atat_period_of_performance/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + 'TC6_period_GET_9',
        'apiURL': 'x_g_dis_atat_period/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 6
      },
    ]
  };
}

export {
  performanceRequirements
};