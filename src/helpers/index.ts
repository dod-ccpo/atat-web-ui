interface ATATWindow extends Window {
  msCrypto: Crypto;
}

declare let window: ATATWindow;

export function generateUid(): string {
  const array = new Uint32Array(4);
  const crypto = window.crypto || window.msCrypto;
  const values = crypto
    ? crypto.getRandomValues(array).map((value) => value)
    : [""];

  return values.join("-").toString();
}

export const getEntityIndex = <TModel>(
  entities: TModel[],
  predicate: (value: TModel, index: number, obj: TModel[]) => unknown,
  thisArg?: any
): number => {
  return entities.findIndex(predicate);
};
