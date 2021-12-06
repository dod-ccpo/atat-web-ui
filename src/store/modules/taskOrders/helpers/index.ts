import moment from "moment";
import { TaskOrder } from "types/Portfolios";
import { TaskOrderModel } from "types/Wizard";

export const parseNumber = (value: string) => {
  value = value.replace(",", "");
  const num = parseFloat(value);

  return num;
};

export const mapTaskOrders = (
  taskOrderModels: TaskOrderModel[]
): TaskOrder[] => {
  return taskOrderModels.map((model: TaskOrderModel) => {
    //extract all properties except the id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, signed, ...baseModel } = model;

    const taskOrders: TaskOrder = {
      ...baseModel,
      task_order_file: {
        id: model.task_order_file.id,
        name: model.task_order_file.name,
      },
      clins: model.clins.map((clin) => {
        return {
          ...clin,
          total_clin_value: parseNumber(clin.total_clin_value.toString()),
          obligated_funds: parseNumber(clin.obligated_funds.toString()),
          pop_start_date: moment(clin.pop_start_date).format("YYYY-MM-DD"),
          pop_end_date: moment(clin.pop_end_date).format("YYYY-MM-DD"),
        };
      }),
    };

    return taskOrders;
  });
};
