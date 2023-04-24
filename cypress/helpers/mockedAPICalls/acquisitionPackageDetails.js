/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const acquisitionPackageDetails = (fixtureFolder) => {
  return {
    acor: [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
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
        'fixture': fixtureFolder + '/TC1_contacts_POST_2',
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
        'fixture': fixtureFolder + '/TC2_contacts_POST_1',
        'apiURL': 'x_g_dis_atat_contacts',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_contacts_POST_2',
        'apiURL': 'x_g_dis_atat_contacts',
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
        'fixture': fixtureFolder + '/TC3_contacts_POST_1',
        'apiURL': 'x_g_dis_atat_contacts',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_contacts_POST_2',
        'apiURL': 'x_g_dis_atat_contacts',
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
        'fixture': fixtureFolder + '/TC4_contacts_POST_1',
        'apiURL': 'x_g_dis_atat_contacts',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_contacts_POST_2',
        'apiURL': 'x_g_dis_atat_contacts',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
    ],
    contactinformation:[
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
        'fixture': fixtureFolder + '/TC2_projOverview_POST_1',
        'apiURL': 'x_g_dis_atat_project_overview',
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
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC7_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 7
      },
    ],
    cor: [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
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
        'fixture': fixtureFolder + '/TC2_contacts_POST_1',
        'apiURL': 'x_g_dis_atat_contacts',
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
        'fixture': fixtureFolder + '/TC3_contacts_POST_1',
        'apiURL': 'x_g_dis_atat_contacts',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_contacts_POST_1',
        'apiURL': 'x_g_dis_atat_contacts',
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
        'fixture': fixtureFolder + '/TC4_contacts_POST_1',
        'apiURL': 'x_g_dis_atat_contacts',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 4
      },
    ],
    organization: [
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
        'fixture': fixtureFolder + '/TC2_projOverview_POST_1',
        'apiURL': 'x_g_dis_atat_project_overview',
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
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC7_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 7
      },
      {
        'fixture': fixtureFolder + '/TC8_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 8
      },
     
    ],
    projectoverview: [
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
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
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
    ],
  }
}


export {
  acquisitionPackageDetails
};