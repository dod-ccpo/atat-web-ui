import { VuexModule } from "vuex-module-decorators";

export function nameofProperty<T>(obj: T, expression: 
    (x: { [Property in keyof T]: () => string }) => () => string): string
{
  const res: { [Property in keyof T]: 
      () => string } = {} as { [Property in keyof T]: () => string };
    
  Object.getOwnPropertyNames(obj).map(k => res[k as keyof T] = () => k);
    
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
