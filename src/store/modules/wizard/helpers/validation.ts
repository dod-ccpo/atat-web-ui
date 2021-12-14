export const isFormFieldValid = (
  validationRules: (() => string | boolean)[]
): boolean => {
  return validationRules.every((vr) => vr() === true);
};
