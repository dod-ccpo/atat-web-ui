/* eslint-disable camelcase */
import { AlertDTO } from "@/api/models";
import { AxiosRequestConfig } from "axios";
import AlertService from "./alerts";

const mockAlerts: AlertDTO[] = [
  {
    clin: "",
    task_order: "tsk_12345678",
    active: "true",
    alert_type: "SPENDING_ACTUAL",
    threshold_violation_amount: "75",
    last_notification_date: "",
    portfolio: "",
  },
  {
    clin: "",
    task_order: "tsk_12345678919",
    active: "true",
    alert_type: "TIME_REMAINING",
    threshold_violation_amount: "60",
    last_notification_date: "",
    portfolio: "",
  },
];

jest.mock("@/api", () => ({
  ...jest.requireActual("@/api"),
  alertsTable: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getQuery: (config?: AxiosRequestConfig): Promise<AlertDTO[]> => {
      return new Promise((resolve) => resolve(mockAlerts));
    },
  },
}));

describe("alert service", () => {
  test("service exist", () => {
    expect(new AlertService()).toEqual({});
  });

  test("can get alerts", async () => {
    const alertService = new AlertService();
    const alerts = await alertService.getAlerts("");
    expect(alerts).toStrictEqual(mockAlerts);
  });
});
