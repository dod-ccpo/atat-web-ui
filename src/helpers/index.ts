export const hasChanges = <TData>(argOne: TData, argTwo: TData): boolean =>
  JSON.stringify(argOne) !== JSON.stringify(argTwo);