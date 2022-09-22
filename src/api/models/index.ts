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

export interface AlertDTO extends BaseTableDTO {
  active: string;
  alert_type: string;
  clin: string;
  last_notification_date: string;
  portfolio: string;
  task_order: string;
  threshold_violation_amount: string;
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
  funding_request: string;
  classification_level: string;
  required_services: string;
  current_environment: string;
  environment_instance: string;
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

export interface CurrentEnvironmentDTO extends BaseTableDTO {
  current_environment_exists?: string;
  environment_instances?: string;
  additional_information?: string;
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
  other?: string;
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
    surge_capabilities?: string;
    estimatedTaskOrderValue?: string;
}

export interface RequiredServicesDTO extends BaseTableDTO {
  usage_description: string;
  applicable_classification_levels: string;
  need_for_entire_to_duration: string;
  applicable_periods: string;
  select_service_offerings: string;
  other_service_offering: string;
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
  initial_amount: string;
  estimated_task_order_value?: string;
  remaining_amount_increments: string;
}

export interface FundingRequestFSFormDTO extends BaseTableDTO {

      fs_form_7600a_filename: string;
      fs_form_7600a_attachment: string;
      fs_form_7600b_attachment: string;
      fs_form_7600b_filename: string;
      use_g_invoicing: string;
      order_number: string;
      gt_c_number: string;
}

export interface FundingRequestMIPRFormDTO extends BaseTableDTO {
      mipr_number: string;
      mipr_filename: string;
      mipr_attachment: string;
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

export interface SelectedServiceOfferingDTO extends BaseTableDTO {
  classification_instances: string;
  other_service_offering: string;
  service_offering: string;
}

export interface ClassificationInstanceDTO extends BaseTableDTO {
  selected_periods: string;
  classification_level: string;
  usage_description: string;
  need_for_entire_task_order_duration: string;
}

export interface FundingRequestDTO extends BaseTableDTO {
  fs_form: string;
  funding_request_type: string;
  mipr: string;
}

export interface FundingIncrementDTO extends BaseTableDTO{
  amount: string;
  description: string;
  order: string;
}
export interface TaskOrderDTO extends BaseTableDTO {
    clins: string;
    incrementally_funded: string;
    funds_obligated: string;
    acquisition_package: string;
    task_order_number: string;
    task_order_status: string;
    portfolio: string;
    funding_plan: string;
    pop_end_date: string;
    pop_start_date: string;
    funds_total: string;
}

export interface CostsDTO extends BaseTableDTO {
  clin: string;
  csp: string;
  "csp.name"?:string;
  year_month: string;
  task_order_number: string;
  portfolio: string;
  organization: string;
  service_agency: string;
  is_actual: string;
  value: string;
}

export interface CostGroupDTO {
  totalActual: number;
  totalProjected: number;
  yearMonth: string;
  costs: CostsDTO[];
}

export interface ClinDTO extends BaseTableDTO {
  funds_obligated: string;
  clin_number: string;
  idiq_clin: string;
  idiq_clin_label?: string;
  pop_end_date: string;
  pop_start_date: string;
  clin_status: string;
  funds_total: string;
}

export interface EDAResponse {
  success: boolean;
  message: string;
}

export interface EnvironmentInstanceDTO extends BaseTableDTO {
  storage_amount: string;
  storage_type: string;
  instance_name: string;
  classification_level: string | ReferenceColumn;
  number_of_vcpus: string;
  data_egress_monthly_amount: string;
  performance_tier: string;
  pricing_model_expiration: string;
  csp_region: string;
  memory_unit: string;
  storage_unit: string;
  pricing_model: string;
  instance_location: string;
  memory_amount: string;
  operating_system_licensing: string;
  data_egress_monthly_unit: string;
}
