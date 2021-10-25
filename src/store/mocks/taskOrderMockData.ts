import { TaskOrderModel } from "../../../types/Wizard";

export const mockTaskOrders: TaskOrderModel[] = [
  {
    id: "task1",
    task_order_number: "TaskOrder_0001",
    clins: [
      {
        clin_number: "0001",
        idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
        total_clin_value: 200000,
        obligated_funds: 10000,
        pop_start_date: "2021-09-01",
        pop_end_date: "2022-09-01",
      },
      {
        clin_number: "0002",
        idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
        total_clin_value: 7500000,
        obligated_funds: 500000,
        pop_start_date: "2021-09-01",
        pop_end_date: "2022-09-01",
      },
    ],
    task_order_file: {
      name: "mock file",
      id: "fileid",
      created_at: "",
      updated_at: "",
      size: 0,
      status: "pending",
    },
    signed: true,
  },
  {
    id: "task2",
    task_order_number: "TaskOrder_0002",
    clins: [
      {
        clin_number: "0001",
        idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
        total_clin_value: 2000,
        obligated_funds: 1000,
        pop_start_date: "2021-09-01",
        pop_end_date: "2022-09-01",
      },
      {
        clin_number: "0002",
        idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
        total_clin_value: 7000,
        obligated_funds: 6600,
        pop_start_date: "2021-09-01",
        pop_end_date: "2022-09-01",
      },
      {
        clin_number: "0003",
        idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
        total_clin_value: 10000,
        obligated_funds: 2600,
        pop_start_date: "2021-09-01",
        pop_end_date: "2022-09-01",
      },
    ],
    task_order_file: {
      name: "mock file",
      id: "fileid2",
      created_at: "",
      updated_at: "",
      size: 0,
      status: "pending",
    },
    signed: true,
  },
];
