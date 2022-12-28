import { VuexModule } from "vuex-module-decorators";

export function nameofProperty<T>(obj: T, expression: 
    (x: { [Property in keyof T]: () => string }) => () => string): string
{
  const res: { [Property in keyof T]: 
      () => string } = {} as { [Property in keyof T]: () => string };
    
  Object.getOwnPropertyNames(obj).forEach(k => res[k as keyof T] = () => k);
    
  return expression(res)();
}


export const storeDataToSession = (
  store: VuexModule,
  sessionProperties: string[],
  sessionKey: string
): void => {
  const data = store as unknown as Record<string, string>;
  const sessionData = sessionProperties.reduce(
    (map, current) => ({
      ...map,
      [current]: data[`${current}`],
    }),
    {}
  );

  sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
};

export const retrieveSession = (sessionKey: string): string | null=> {
  const sessionData = sessionStorage.getItem(sessionKey);
  return sessionData;
};

/**
 * Converts a given period's unit to months, based on a period's unit and the
 * count of number of units.
 * @param numberOfUnits
 * @param unit
 */
export const convertPeriodUnitQuantityToMonths = (numberOfUnits: number, unit:string): number => {
  switch(unit) {
  case "YEAR":
    return numberOfUnits * 12
  case "MONTH":
    return numberOfUnits
  case "WEEK":
    return Math.ceil(numberOfUnits/4.345)
  case "DAY":
    return Math.ceil(numberOfUnits/30.4167)
  default:
    return 0
  }
}

const storeHelperFunctions = {
  retrieveSession
};
export default storeHelperFunctions;
