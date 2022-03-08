import AcquisitionPackage from "@/store/acquisitionPackage";
import { routeNames } from "../stepper";

export const AcorsRouteResolver = (current: string): string => {
  const hasAlternativeContactRep = AcquisitionPackage.hasAlternativeContactRep;

  //routing from alternate cor and the user does not have
  //and alternatative contact rep
  if (
    current === routeNames.Alternate_Cor &&
    hasAlternativeContactRep == false
  ) {
    return routeNames.Summary;
  }

  //routing from summary and user does not have
  if (current === routeNames.Summary && hasAlternativeContactRep == false) {
    return routeNames.Alternate_Cor;
  }

  return routeNames.Acor_Information;
};
