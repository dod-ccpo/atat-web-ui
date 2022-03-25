import AcquisitionPackage from "@/store/acquisitionPackage";
import GovtFurnishedEquipment from "@/store/govtFurnishedEquipment";

import { routeNames } from "../stepper";

export const AcorsRouteResolver = (current: string): string => {
  const hasAlternativeContactRep = AcquisitionPackage.hasAlternativeContactRep;

  //routing from alternate cor and the user does not have
  //and alternatative contact rep
  if (current === routeNames.Alternate_Cor && hasAlternativeContactRep == false) {
    return routeNames.Summary;
  }

  //routing from summary and user does not have
  if (current === routeNames.Summary && hasAlternativeContactRep == false) {
    return routeNames.Alternate_Cor;
  }

  return routeNames.Acor_Information;
};

export const CustodianRouteResolver = (current: string): string => {
  const needsPropertyCustodian = GovtFurnishedEquipment.needsPropertyCustodian;
  // if government equipment will be furnished, route to Property Custodian page
  if (current === routeNames.Will_Govt_Equip_Be_Furnished && needsPropertyCustodian) {
    return routeNames.Property_Custodian;
  }
  // else stay on same page until next step after Property Custodian is completed
  alert("Business rule is to skip Property Custodian page if answer is \"No\" (or unanswered) here. " +
    "Navigation will temporarily stay on this page until the substep after Property " +
    "Custodian has been completed. Select \"Yes\" to continue to Property Custodian page.");
  // todo - change this routeName when page after Property Custodian is completed
  return routeNames.Will_Govt_Equip_Be_Furnished; 
};