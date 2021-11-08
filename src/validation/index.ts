export function validateNumber(v: string): boolean | string {
  const message = "Please enter a valid number";

  v = v.toString();

  if (!v) {
    return message;
  }

  const numberValue = parseFloat(v.replace(/,/g, ""));
  const isNumber = /^([0-9]+(\.?[0-9]?[0-9]?)?)/.test(numberValue.toString());

  if (v !== "" && !isNumber) {
    return message;
  }

  return true;
}
