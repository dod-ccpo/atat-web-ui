
/**
 * 
 * @param {} fixtureFolder -- folder containing necessary fixtures 
 * @returns js objects with mocked data specs
 */

const background = (fixtureFolder) => {
  return {
    currentcontract: [
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
        'fixture': fixtureFolder + '/TC3_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 3,
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 4,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5,
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      }
    ],
    currentenvironment: [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'statusCode': 201,
        'testCase' : 1
      },      
      {
        'fixture': fixtureFolder + '/TC1_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'statusCode': 201,
        'testCase' :1
      },
      {
        'fixture': fixtureFolder + '/TC1_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1,
      },
      {
        'fixture': fixtureFolder + '/TC1_currentContractAndRecurringInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information/**',
        'action': 'PATCH',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_currentEnvironment_POST_1',
        'apiURL': 'x_g_dis_atat_current_environment',
        'action': 'POST',
        'times': 1,
        'statusCode': 201,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_currentEnvironment_GET_1',
        'apiURL': 'x_g_dis_atat_current_environment/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_currentEnvironment_PATCH_1',
        'apiURL': 'x_g_dis_atat_current_environment/**',
        'action': 'PATCH',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_classificationLevel_GET_1',
        'apiURL': 'x_g_dis_atat_classification_level',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_environmentInstance_GET_1',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_environmentInstance_GET_2',
        'apiURL': 'x_g_dis_atat_environment_instance',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_currentEnvironmentInstance_PATCH_1',
        'apiURL': 'x_g_dis_atat_environment_instance/**',
        'action': 'PATCH',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC1_currentEnvironmentInstance_PATCH_2',
        'apiURL': 'x_g_dis_atat_environment_instance/**',
        'action': 'PATCH',
        'times': 1,
        'statusCode': 200,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'statusCode': 201,
        'testCase' : 2
      },      
      {
        'fixture': fixtureFolder + '/TC2_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'statusCode': 201,
        'testCase' :2
      },
      {
        'fixture': fixtureFolder + '/TC2_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information/**',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 2,
      },
      {
        'fixture': fixtureFolder + '/TC2_currentContractAndRecurringInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information/**',
        'action': 'PATCH',
        'times': 1,
        'statusCode': 200,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_currentEnvironment_POST_1',
        'apiURL': 'x_g_dis_atat_current_environment',
        'action': 'POST',
        'times': 1,
        'statusCode': 201,
        'testCase' :2
      },
    ]

  };
}

export {
  background
};