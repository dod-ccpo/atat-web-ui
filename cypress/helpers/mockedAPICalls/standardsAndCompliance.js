
/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const standardsAndCompliance = (fixtureFolder) => {
  return {
    baa: [
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
     
    ],
    foia:  [
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
        'fixture': fixtureFolder + '/TC9_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
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

    ],
    pii: [
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
    ],
    section508standards: [
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
    ]
  }
}

export {
  standardsAndCompliance
};