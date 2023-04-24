
/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const fairOpportunityProcess = (fixtureFolder) => {
  return {
    fairopportunityprocess: [
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
    ]
  };
}

export {
  fairOpportunityProcess
};