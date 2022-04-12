export const hasChanges = <TData>(argOne: TData, argTwo: TData): boolean =>
  JSON.stringify(argOne) !== JSON.stringify(argTwo);

export const getIdText = (string: string): string => {
  return string.replace(/[^A-Z0-9]/ig, "");
}