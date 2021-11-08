import { CLINModel, TaskOrderModel } from "types/Wizard";
import { validateNumber } from "..";

export const validTaskOrderNumberLength = (
  taskOrderNumber: string
): boolean => {
  return taskOrderNumber.length >= 13 && taskOrderNumber.length <= 17;
};

export const validClinNumber = (clinNumber: string): boolean => {
  return (
    clinNumber !== "" && /^\d+$/.test(clinNumber) && clinNumber.length === 4
  );
};

export const isValidNumber = (value: string | number): boolean => {
  const result = validateNumber(value.toString());
  return typeof result !== "string" && result !== false;
};

const validClinValues = (clin: CLINModel): boolean => {
  return (
    validClinNumber(clin.idiq_clin) &&
    isValidNumber(clin.obligated_funds) &&
    isValidNumber(clin.total_clin_value) &&
    clin.obligated_funds < clin.total_clin_value
  );
};

const isValidDate = (date: string): boolean => {
  return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(date);
};

export const validateClin = (clin: CLINModel): boolean => {
  return (
    validClinNumber(clin.clin_number) &&
    clin.idiq_clin != "" &&
    isValidNumber(clin.total_clin_value) &&
    isValidNumber(clin.obligated_funds) &&
    clin.obligated_funds < clin.total_clin_value &&
    isValidDate(clin.pop_start_date) &&
    isValidDate(clin.pop_end_date)
  );
};

export function validateTaskOrder(taskOrder: TaskOrderModel): boolean {
  const taskOrderNumberValid =
    taskOrder.task_order_number != "" &&
    /^\d+$/.test(taskOrder.task_order_number) &&
    validTaskOrderNumberLength(taskOrder.task_order_number);

  const hasTaskOrderFile =
    taskOrder.signed && taskOrder.task_order_file.name != "";

  const clinsValid =
    taskOrder.clins.length > 0 &&
    taskOrder.clins.every((clin) => validateClin(clin));

  return taskOrderNumberValid && hasTaskOrderFile && clinsValid;
}
