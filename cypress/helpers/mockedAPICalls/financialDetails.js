/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const financialDetails = (fixtureFolder) => {
  return {
    financialpoc: [
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
    ],
    fundingplan: [
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
    ],
    ginvoicing: [
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
    ],
    ifpbaseperiod:  [
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
      
    ],
    incrementalfunding: [
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
    ],
    mipr: [
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
    ],
    requirementscostestimate: [
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
    ]
  }
}

export {
  financialDetails
};