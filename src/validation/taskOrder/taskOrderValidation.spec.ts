import { TaskOrderModel } from "types/Wizard";
import { validateTaskOrder, validateClin } from "./index";

const taskOrder: TaskOrderModel = {
  id: "33333",
  task_order_number: "0342345678987",
  signed: true,
  task_order_file: {
    name: "fileName",
    id: "12345",
    created_at: "",
    updated_at: "",
    size: 1234556,
    status: "",
  },
  clins: [
    {
      clin_number: "0002",
      idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
      total_clin_value: 7500000,
      obligated_funds: 500000,
      pop_start_date: "2021-09-01",
      pop_end_date: "2022-09-01",
    },
  ],
};

describe("Task Order Validation", () => {
  it("Valid clin should evaluate to true", async () => {
    const result = validateClin(taskOrder.clins[0]);
    expect(result).toBe(true);
  });

  it("Valid Task order Should evaluate to true", async () => {
    const result = validateTaskOrder(taskOrder);
    expect(result).toBe(true);
  });

  it("Should be false when task order number is less than 13 digits in length", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      task_order_number: "034",
    };

    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when task order number is greater than 17 digits in length", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      task_order_number: "243845059458063396",
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when unsigned", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      signed: false,
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when file name isn't present", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      task_order_file: {
        ...taskOrder.task_order_file,
        name: "",
      },
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when Clin length is zero", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      clins: [],
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when Clin number is greater than 4", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      clins: [
        {
          ...taskOrder.clins[0],
          clin_number: "00003",
        },
      ],
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when Clin number is empty", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      clins: [
        {
          ...taskOrder.clins[0],
          clin_number: "",
        },
      ],
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when IDIQ Clin is empty", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      clins: [
        {
          ...taskOrder.clins[0],
          idiq_clin: "",
        },
      ],
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when total clin value is zero", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      clins: [
        {
          ...taskOrder.clins[0],
          total_clin_value: 0,
        },
      ],
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when pop start date is empty", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      clins: [
        {
          ...taskOrder.clins[0],
          pop_start_date: "",
        },
      ],
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });

  it("Should be false when pop start end is empty", () => {
    const invalid_taskOrderNumber = {
      ...taskOrder,
      clins: [
        {
          ...taskOrder.clins[0],
          pop_end_date: "",
        },
      ],
    };
    const result = validateTaskOrder(invalid_taskOrderNumber);
    expect(result).toBe(false);
  });
});
