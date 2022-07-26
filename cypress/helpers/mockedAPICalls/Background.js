
/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const background = (fixtureFolder) => {
  return {
    background: [{
      'fixture': fixtureFolder + 'TC1_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
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
      'fixture': fixtureFolder + 'TC3_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase' : 3
    },
    {
      'fixture': fixtureFolder + 'TC3_currentContractAndRecurringInformation_POST_1',
      'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
      'action': 'POST',
      'times': 1,
      'testCase' : 3
    },
    {
      'fixture': fixtureFolder + 'TC3_currentContractAndRecurringInformation_GET_1',
      'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
      'action': 'GET',
      'times': 1,
      'statusCode': 200,
      'testCase' : 3,
    },
    {
      'fixture': fixtureFolder + 'TC4_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase' : 4
    },
    {
      'fixture': fixtureFolder + 'TC4_currentContractAndRecurringInformation_POST_1',
      'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
      'action': 'POST',
      'times': 1,
      'testCase' : 4
    },
    {
      'fixture': fixtureFolder + 'TC4_currentContractAndRecurringInformation_GET_1',
      'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information/**',
      'action': 'GET',
      'times': 1,
      'statusCode': 200,
      'testCase' : 4,
    },
    {
      'fixture': fixtureFolder + 'TC5_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase' : 5
    },
    {
      'fixture': fixtureFolder + 'TC5_currentContractAndRecurringInformation_POST_1',
      'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
      'action': 'POST',
      'times': 1,
      'testCase' : 5
    },
    {
      'fixture': fixtureFolder + 'TC5_currentContractAndRecurringInformation_GET_1',
      'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information/**',
      'action': 'GET',
      'times': 1,
      'statusCode': 200,
      'testCase' : 5,
    },
    {
      'fixture': fixtureFolder + 'TC6_taskOrder_POST_1',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'times': 1,
      'testCase' : 6
    },
    {
      'fixture': fixtureFolder + 'TC6_currentContractAndRecurringInformation_POST_1',
      'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
      'action': 'POST',
      'times': 1,
      'testCase' : 6
    }]
  };
}

export {
  background
};