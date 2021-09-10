export function generateUid() {
  const array = new Uint32Array(10);
  const values = window.crypto.getRandomValues(array).map((value) => value);

  return values.toString();
}
