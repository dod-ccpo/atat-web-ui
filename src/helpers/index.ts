interface ATATWindow extends Window {
  msCrypto: Crypto;
}

declare let window: ATATWindow;

export function generateUid(): string {
  const array = new Uint32Array(10);
  const crypto = window.crypto || window.msCrypto;
  const values = crypto.getRandomValues(array).map((value) => value);

  return values.toString();
}
