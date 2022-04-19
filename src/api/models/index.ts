/* eslint-disable camelcase */
export interface BaseTableDTO {
  sys_id?: string;
  sys_updated_by?: string;
  sys_created_on?: string;
  sys_mod_count?: string;
  sys_updated_on?: string;
  sys_tags?: string;
  sys_created_by?: string;
}

export interface AcquisitionPackageDTO extends BaseTableDTO {
  status: string;
  number: string;
  project_overview: string;
  organization: string;
  contact: string;
  fair_opportunity: string;
  current_contract: string;
  docusign_envelope_id: string;
}

export interface CurrentContractDTO extends BaseTableDTO {
  current_contract_exists?: string;
  incumbent_contractor_name?: string;
  contract_number?: string;
  task_delivery_order_number?: string;
  contract_order_expiration_date?: string;
}

export interface ContactDTO extends BaseTableDTO {

  grade_civ: string;
  role: string;
  dodaac: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  type: string;
  can_access_package: string;
  phone: string;
  rank_components: string;
  salutation: string;
  first_name: string;
  email: string;
  title: string;
}

export interface FairOpportunityDTO extends BaseTableDTO {
  exception_to_fair_opportunity: string;
}

export interface OrganizationDTO extends BaseTableDTO {
  street_address_1: string;
  street_address_2: string;
  organization_name: string;
  disa_organization: string;
  service_agency: string;
  state: string;
  zip_code: string;
  country: string;
  address_type: string;
  city: string;
  dodaac: string;
}

export interface ProjectOverviewDTO extends BaseTableDTO {
  title: string;
  scope: string;
  emergency_declaration: string;
}

export interface MilitaryRankDTO extends BaseTableDTO {
  name: string;
  grade: string;
  branch: string;
}

export interface SystemChoiceDTO extends BaseTableDTO{
    name: string;
    label: string;
    value: string;
}
