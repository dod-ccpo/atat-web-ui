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
  sensitive_information: string;
  period_of_performance: string;
  periods: string;
  gfe_overview: string;
  contract_type: string;
  requirements_const_estimate: string;
  contract_considerations: string;
  funding_plans: string;
  classification_level: string;
}

export interface ClassificationLevelDTO extends BaseTableDTO {
  impact_level: string;
  classification: string;
}

export interface CurrentContractDTO extends BaseTableDTO {
  current_contract_exists?: string;
  incumbent_contractor_name?: string;
  contract_number?: string;
  task_delivery_order_number?: string;
  contract_order_expiration_date?: string;
}

export interface ContactDTO extends BaseTableDTO {
  type: string; // Mission Owner, COR, ACOR
  role: string; // Military, Civilian, Contractor
  rank_components: string;
  salutation: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  title: string;
  phone: string;
  phone_extension: string;
  email: string;
  grade_civ: string;
  dodaac: string;
  can_access_package: string;
  manually_entered: string;
}

export interface ContractConsiderationsDTO extends BaseTableDTO{
  packaging_shipping_other?: string;
  contractor_required_training?: string;
  packaging_shipping_other_explanation?: string;
  conflict_of_interest_explanation?: string;
  potential_conflict_of_interest?: string;
  required_training_courses?: string;
  packaging_shipping_none_apply?: string;
  contractor_provided_transfer?: string;
}

export interface FairOpportunityDTO extends BaseTableDTO {
  exception_to_fair_opportunity: string;
}

export interface OrganizationDTO extends BaseTableDTO {
  street_address_1?: string;
  street_address_2?: string;
  organization_name?: string;
  disa_organization?: string;
  service_agency?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  address_type?: string;
  city?: string;
  dodaac?: string;
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

export interface SystemChoiceDTO extends BaseTableDTO {
  name: string;
  label: string;
  value: string;
  sequence?: number;
}

export interface SensitiveInformationDTO extends BaseTableDTO {
  pii_present?: string;
  system_of_record_name?: string;
  work_to_be_performed?: string;

  baa_required?: string;

  potential_to_be_harmful?: string;

  foia_full_name?: string;
  foia_email?: string;
  foia_address_type?: string;
  foia_city_apo_fpo?: string;
  foia_street_address_1?: string;
  foia_street_address_2?: string;
  foia_state_province_state_code?: string;
  foia_zip_postal_code?: string;
  foia_country?: string;
  section_508_sufficient?: string;
  accessibility_reqs_508?: string;

}

export interface ServiceOfferingDTO extends BaseTableDTO {
  description: string;
  name: string;
  service_offering_group: string;
  sequence: string;
}

export interface PeriodOfPerformanceDTO extends BaseTableDTO {
  pop_start_request?: string;
  requested_pop_start_date?: string;
  time_frame?: string;
  recurring_requirement?: string;
  base_and_options?: string; //deprecated
  option_periods?: string;
  base_period?: string;
}

export interface ContractTypeDTO extends BaseTableDTO {
  firm_fixed_price: string;
  time_and_materials: string;
  contract_type_justification: string;
}

export interface RequirementsCostEstimateDTO extends BaseTableDTO {
    surge_capabilities: string;
}
export interface GFEOverviewDTO extends BaseTableDTO {
  dpas_unit_identification_code?: string;
  gfe_gfp_furnished?: string;
  dpas_custodian_number?: string;
  property_accountable?: string;
  property_custodian_name?: string;
}

export interface StateDTO extends BaseTableDTO {
   name: string;
   key: string;
}

export interface CountryDTO extends BaseTableDTO {
  name: string;
  iso3166_2: string;
}
export interface AttachmentDTO extends BaseTableDTO {
  size_bytes?: string;
  file_name: string;
  average_image_color?: string;
  image_width?: string;
  table_name?: string;
  image_height?: string;
  download_link?: string;
  content_type?: string;
  size_compressed?: string;
  compressed?: string;
  state?: string;
  table_sys_id: string;
  chunk_size_bytes?: string;
  hash?: string;
}


export interface AttachableDTO extends BaseTableDTO {
  attachment: string;
  extension: string;
  file_name: string;
}

export interface FundingPlanDTO extends BaseTableDTO {
  //file attachment id from sys attachments table
  attachment: string;
  extension: string;
  file_name: string;
}

export interface PeriodDTO extends BaseTableDTO {
    period_unit: string;
    period_unit_count: string;
    period_type: string;
    option_order: string;
}

export interface ReferenceColumn {
  link: string;
  value: string;
}