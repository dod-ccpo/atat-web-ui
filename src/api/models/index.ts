/* eslint-disable camelcase */
import { Tracing } from "trace_events";
import { 
  EnvironmentInstanceLocation,
  EnvironmentInstanceUsage,
  EnvironmentLocation, 
  EnvironmentReplicateOptimized, 
  EvalPlanMethod, 
  EvalPlanSourceSelection, 
  PaymentArrangement, 
  PerformanceTier, 
  StorageType, 
  StorageUnit, 
  YesNo,
  SingleMultiple,
  EstimateOptionValue,
  TrainingEstimate,
  EstimateOptionValueObjectArray
} from "../../../types/Global";

export interface BaseTableDTO {
  sys_id?: string;
  sys_updated_by?: string;
  sys_created_on?: string;
  sys_mod_count?: string;
  sys_updated_on?: string;
  sys_tags?: string;
  sys_created_by?: string;
}

export interface AgencyDTO extends BaseTableDTO {
  label: string;
  title: string;
  acronym: string;
  css_id: number;
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
  project_overview: ReferenceColumn | string;
  organization: ReferenceColumn | string;
  fair_opportunity: ReferenceColumn | string;
  current_contract_and_recurring_information: ReferenceColumn | string;
  docusign_envelope_id: string;
  docgen_job_status: string;
  sensitive_information: ReferenceColumn | string;
  period_of_performance: ReferenceColumn | string;
  periods: string;
  gfe_overview: string;
  contract_type: ReferenceColumn | string;
  contract_considerations: ReferenceColumn | string;
  funding_plans: string;
  classification_level: ReferenceColumn | string;
  required_services: string;
  current_environment: ReferenceColumn | string;
  environment_instance: string;
  secondary_reviewers?: string;
  mission_owners?: string;
  contract_award: ReferenceColumn | string;
  package_status?: string;
  contributors?: string;
  evaluation_plan?: string;
  cor: ReferenceColumn | string;
  acor: ReferenceColumn | string;
  primary_contact: ReferenceColumn | string;
  funding_requirement: ReferenceColumn | string;
  contracting_shop?: string;
  funding_request?: ReferenceColumn | string;
}

export interface ClassificationLevelDTO extends BaseTableDTO {
  impact_level: string;
  classification: string;
  classification_level?: ReferenceColumn | string;
  display?: string;
}

export interface ClassifiedInformationTypeDTO extends BaseTableDTO {
  description: string;
  name: string;
  sequence: string;
}

export interface SelectedClassificationLevelDTO extends ClassificationLevelDTO {
  classification_level: ReferenceColumn | string; // sys id
  acquisition_package: ReferenceColumn | string; // sys id
  users_per_region?: string; // json stringified sys_id/count pairs
  increase_in_users?: YesNo;
  classified_information_types?: string;
  user_growth_estimate_type?: SingleMultiple
  user_growth_estimate_percentage?: string[];
  data_egress_monthly_amount?: number | null;
  data_egress_monthly_unit?: StorageUnit;
  data_increase?: YesNo;
  data_growth_estimate_type?: SingleMultiple;
  data_growth_estimate_percentage?: string[];
}

export interface CurrentContractDTO extends BaseTableDTO {
  current_contract_exists?: string;
  incumbent_contractor_name?: string;
  contract_number?: string;
  task_delivery_order_number?: string;
  contract_order_expiration_date?: string;
}

export interface CurrentEnvironmentDTO extends BaseTableDTO {
  current_environment_exists: YesNo;
  has_system_documentation: YesNo;
  system_documentation?: string[]; // List - sys_ids from sys_attachment table 
  has_migration_documentation: YesNo;
  migration_documentation?: string[]; // List - sys_ids from sys_attachment table 
  env_location: EnvironmentLocation;
  env_classifications_cloud: string[]; // array of classification level sys_ids
  env_classifications_onprem: string[]; // array of classification level sys_ids
  env_instances: string[]; // array of sys_ids
  current_environment_replicated_optimized: EnvironmentReplicateOptimized;
  statement_replicated_optimized: string;
  additional_growth: YesNo;
  anticipated_yearly_additional_capacity: number | null; 
  has_phased_approach: YesNo;
  phased_approach_schedule: string; 
  needs_architectural_design_services: YesNo;
  // EJY --- BELOW 4 ARE NOW IN THEIR OWN TABLE
  statement_architectural_design: string; 
  applications_need_architectural_design: string;
  data_classifications_impact_levels: string[];
  external_factors_architectural_design: string;          
}

export interface CurrentEnvironmentInstanceDTO extends BaseTableDTO {
  acquisition_package: ReferenceColumn | string;
  instance_location: EnvironmentInstanceLocation;
  instance_number: number,
  instance_name: string,
  deployed_regions?: string[] | string;
  classification_level: string; // classification level sys_id
  current_usage_description: EnvironmentInstanceUsage;
  is_traffic_spike_event_based: YesNo;
  is_traffic_spike_period_based: YesNo;
  traffic_spike_event_description?: string;
  traffic_spike_period_description?: string;
  users_per_region: string; // json stringified sys_id/count pairs
  operating_system: string;
  licensing: string;
  number_of_vcpus: number | null;
  processor_speed: number | null; 
  memory_amount: number | null;
  memory_unit: StorageUnit;
  storage_type: StorageType;
  storage_amount: number | null;
  storage_unit: StorageUnit;
  performance_tier: PerformanceTier;
  number_of_instances: number | null; 
  data_egress_monthly_amount: number | null;    
  data_egress_monthly_unit: StorageUnit;
  pricing_model: PaymentArrangement;
  pricing_model_expiration?: string;
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
  formal_name?: string;
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

export interface CrossDomainSolutionDTO extends BaseTableDTO {
  acquisition_package: ReferenceColumn | string;
  anticipated_need_or_usage: string;
  cross_domain_solution_required: string;
  need_for_entire_task_order_duration: string;
  projected_file_stream_type: string;
  selected_periods: string;
  traffic_per_domain_pair: string;
}

export interface FairOpportunityDTO extends BaseTableDTO {
  exception_to_fair_opportunity: string;
}

export interface OrganizationDTO extends BaseTableDTO {
  street_address_1?: string;
  street_address_2?: string;
  organization_name?: string;
  disa_organization?: string;
  agency?: string;
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
  hint?: string;
}

export interface SystemPropertiesDTO extends BaseTableDTO {
  sys_id?: string
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
  base_period?: ReferenceColumn | string;
}

export interface ContractTypeDTO extends BaseTableDTO {
  firm_fixed_price: string;
  time_and_materials: string;
  contract_type_justification: string;
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

export interface FundingRequirementDTO extends BaseTableDTO {
  acquisition_package: string;
  funding_plan: string;
  funding_request: string;
  funds_obligated: string;
  funds_total: string;
  incrementally_funded: string;
  pop_start_date: string;
  pop_end_date: string;
  task_order_number: string;
  financial_poc?: string;
}

export interface PeriodDTO extends BaseTableDTO {
  period_unit: string;
  period_unit_count: string;
  period_type: string;
  option_order: string;
}

export interface ReferenceColumn {
  link?: string;
  value?: string;
}

export interface DisplayColumn {
  display_value: string;
  value: string;
}

export interface SelectedServiceOfferingDTO extends BaseTableDTO {
  acquisition_package: ReferenceColumn | string;
  architectural_design_requirement?: ReferenceColumn | string;
  classification_instances: string;
  other_service_offering: string;
  service_offering: ReferenceColumn | string;
}

export interface ClassificationInstanceDTO extends BaseTableDTO {
  acquisition_package: ReferenceColumn | string;
  selected_periods: string;
  classification_level: string;
  usage_description: string;
  need_for_entire_task_order_duration: string;
  classified_information_types?: string;
  type_of_delivery?: "" | "SHIPPED" | "PICK_UP";
  type_of_mobility?: "" | "MAN_PORTABLE" | "MODULAR" | "OTHER" | "NO_PREFERENCE";
  type_of_mobility_other?: string;
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
    clin_records?: ClinDTO[],
   /**
   * @deprecated Will be deprecated: use the prop from funding_requirement
   */
    incrementally_funded: string; // will be deprecated: use the prop from funding_requirement
  /**
   * @deprecated Will be deprecated: use the prop from funding_requirement
   */
    funds_obligated: string; // do not delete. for portfolio sum, not in api call but calculated
  /**
   * @deprecated Will be deprecated: use the prop from funding_requirement
   */
    acquisition_package: string; // will be deprecated: use the prop from funding_requirement
  /**
   * @deprecated Will be deprecated: use the prop from funding_requirement
   */
    funding_plan: string; // will be deprecated: use the prop from funding_requirement
  /**
   * @deprecated Will be deprecated: use the prop from funding_requirement
   */
    funds_total: string; // do not delete. for portfolio sum, not in api call but calculated

    task_order_number: string;
    task_order_status: string;
    portfolio: string;
    pop_end_date: string;
    pop_start_date: string;
    total_task_order_value?: number; // total clin values that don't have expired/ option pending
    total_lifecycle_amount?: number; // total clin values irrespective of status
    funds_spent_task_order?: number; // total of is_actual=true costs across all clins of task order
    funding_requirement?: FundingRequirementDTO; //
}

export interface CostsDTO extends BaseTableDTO {
  clin: string;
  csp: string;
  "csp.name"?:string;
  year_month: string;
  task_order_number: string;
  portfolio: string;
  organization: string;
  "agency.title"?: string;
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
  sys_id: string;
  clin_number: string;
  idiq_clin: string;
  idiq_clin_label?: string;
  idiq_clin_display?: DisplayColumn;
  pop_end_date: string;
  pop_start_date: string;
  clin_status: string;
  clin_status_display?: DisplayColumn;
  funds_obligated: number;
  funds_total: number;
  cost_records?: CostsDTO[]
  funds_spent_clin?: number; // total of all is_actual=true costs of the clin
  clin_title?: string;
}

export interface ClinDisplayDTO {
  sys_id: DisplayColumn;
  clin_number: DisplayColumn;
  idiq_clin: DisplayColumn;
  pop_start_date: DisplayColumn;
  pop_end_date: DisplayColumn;
  clin_status: DisplayColumn;
  funds_obligated: DisplayColumn;
  funds_total: DisplayColumn;
}

export interface EDAResponse {
  success?: boolean;
  // if 400 error, will have code and message
  code?: string;
  message?: string;
  // if 200 success, will have data below
  taskOrderNumber?: string;
  contractor?: string; // "Microsoft Corporation",
  csp?: string; // "Azure",
  cspLong?: string; // "Microsoft Azure"
  contractIssuingOffice?: string; // "DITCO",
  totalObligatedAmount?: number | null;
  totalAmount?: number | null;
  popStartDate?: string; // "2021-07-01",
  popEndDate?: string; // "2026-07-01",
  classificationLevels?: string[]; //  ["Unclassified", "Secret"] or sysIds?

}


export interface GInvoicingResponse {
  valid: boolean;
  message: string;
}

export interface EnvironmentInstanceDTO extends BaseTableDTO {
  acquisition_package: ReferenceColumn | string;
  anticipated_need_or_usage: string;
  classification_level: ReferenceColumn | string;
  classified_information_types: string;
  data_egress_monthly_amount: string;
  data_egress_monthly_unit: string;
  instance_location: string;
  instance_name: string;
  licensing?: string;
  memory_amount: string;
  memory_unit: string;
  need_for_entire_task_order_duration: string;
  number_of_instances: string;
  number_of_vcpus: string;
  operating_system?: string;
  operating_system_licensing: string;
  performance_tier: string;
  pricing_model: string;
  pricing_model_expiration: string;
  processor_speed?: string;
  region?: ReferenceColumn | string;
  selected_periods?: string;
  storage_amount: string;
  storage_type: string;
  storage_unit: string;
}

export interface ComputeEnvironmentInstanceDTO extends EnvironmentInstanceDTO {
  environment_type?: string;
  operating_environment?: string;
}

export interface DatabaseEnvironmentInstanceDTO extends EnvironmentInstanceDTO {
  database_licensing?: string;
  database_type?: string;
  database_type_other?: string;
  network_performance?: string;
}

export type StorageEnvironmentInstanceDTO = EnvironmentInstanceDTO

export type XaasEnvironmentInstanceDTO = EnvironmentInstanceDTO

export interface CloudSupportEnvironmentInstanceDTO extends EnvironmentInstanceDTO {
  can_train_in_unclass_env?: string;
  personnel_onsite_access?: string;
  personnel_requiring_training?: string;
  service_type?: string;
  training_facility_type?: string;
  training_format?: string;
  training_location?: string;
  training_requirement_title?: string;
  training_time_zone?: string;
  ts_contractor_clearance_type?: string;
}

export interface ArchitecturalDesignRequirementDTO extends BaseTableDTO {
  acquisition_package: ReferenceColumn | string;
  source: "" | "CURRENT_ENVIRONMENT" | "DOW";
  applications_needing_design: string;
  data_classification_levels: string | string[];
  external_factors: string;
  statement: string;
  needs_architectural_design_services: string;
}

export interface TravelRequirementDTO extends BaseTableDTO {
  acquisition_package: ReferenceColumn | string;
  trip_location: string;
  selected_periods: string;
  number_of_trips: string;
  number_of_travelers: string;
  duration_in_days: string;
}

export interface PortfolioSummaryDTO extends BaseTableDTO{
  name: string; // "Porfolio Name << portfolio.name >>",
  csp: string;
  csp_display: string; // "<<cloud_service_package.name >>"
  vendor: string;
  active_task_order: string;
  agency: string;
  agency_display?: string;
  task_order_number: string; // "1000000001234  << portfolio.active_task_order >>",
  sys_updated_on: string; // "2022-09-26 15:50:20 << portfolio.sys_updated_on >>",
  task_order_status: string; // "EXPIRED << task_order.task_order_status >>",
  pop_end_date: string; // "2022-12-31 << task_order.pop_end_date >>",
  pop_start_date: string; // "2022-01-01 << task_order.pop_start_date >>",
  funds_obligated: number; // "<< sum of obligated values in all qualifying clins >>",
  portfolio_status: string; // "PROCESSING << portfolio.portfolio_status >>",
  portfolio_funding_status: string;
  portfolio_managers: string; // "a8f98bb0e1a5115206fe3a << portfolio.portfolio_managers>>",
  portfolio_managers_detail?: UserManagementDTO[];
  portfolio_viewers?: string;
  portfolio_viewers_detail?: UserManagementDTO[];
  funds_spent: number; // "<< sum of value in cost table queried with task order number >>"
  task_orders: TaskOrderDTO[];
  alerts: AlertDTO[];
  title?: string;
  description?: string;
  environments?: EnvironmentDTO[];
}

export interface PortfolioSummaryMetadataAndDataDTO {
  total_count: number;
  portfolioSummaryList: PortfolioSummaryDTO[];
}

export interface EnvironmentDTO extends BaseTableDTO {
  csp: string;
  csp_id: string;
  csp_display: string;
  name: string;
  dashboard_link: string;
  pending_operators: string[];
  portfolio: string;
  provisioned: YesNo;
  provisioned_date: string;
  provisioning_failure_cause: string;
  provisioning_request_date: string;
  csp_admins?: OperatorDTO[]
}

export interface CloudServiceProviderDTO extends BaseTableDTO{
  name:string;
  // other columns as needed
}

export interface PortfolioSummarySearchDTO {
  role: "ALL" | "MANAGED"; // one of these two values should always exist
  fundingStatuses: ('ON_TRACK' | 'EXPIRING_SOON' | 'AT_RISK' | 'DELINQUENT' | 'FUNDING_AT_RISK')[];
  csps: string[]; // to not search for specific csps, send empty array
  portfolioStatus: "ACTIVE" | "PROCESSING" | ""; // empty string for both statuses
  sort: "name" | "DESCsys_updated_on"; // one of these two values should always exist
  searchString?: string;
  limit?: number;
  offset?: number;
}

export interface PackageSummaryDTO { // TODO: delete this interface after acq package summary impl
  
    project_overview?: ReferenceColumn["value"]
    title?: string, //proj overview
    secondary_reviewers?: string[],
    package_status?: string,
    sys_updated_on?: string,
    sys_created_by?: string,
    mission_owners?: string,
    contract_award?: ReferenceColumn["value"],
    contributors?: string[],
    sys_id?: string,
  }

export interface AcquisitionPackageSummarySearchDTO {
  acquisitionPackageStatus: "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER" | // open
  "TASK_ORDER_AWARDED" | "ARCHIVED" | "WAITING_FOR_TASK_ORDER" |
  "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER,TASK_ORDER_AWARDED,ARCHIVED";
  sort: "project_overview" | "DESCsys_updated_on"; // one of these two values should always exist
  searchString?: string;
  limit?: number;
  offset?: number;
}

export interface AcquisitionPackageSummaryDisplay{
  sys_id?: DisplayColumn;
  sys_created_by?: DisplayColumn;
  sys_updated_on?: DisplayColumn;
  project_overview?: DisplayColumn; // no need for a title property since the title is inside this
  secondary_reviewers?: DisplayColumn;
  package_status?: DisplayColumn | string;
  mission_owners?: DisplayColumn;
  contract_award?: DisplayColumn;
  contributors?: DisplayColumn;
}

export interface AcquisitionPackageSummaryDTO extends BaseTableDTO{
  project_overview?: DisplayColumn; // no need for a title property since the title is inside this
  secondary_reviewers?: DisplayColumn;
  package_status?: DisplayColumn;
  mission_owners?: DisplayColumn;
  contract_award?: DisplayColumn;
  contributors?: DisplayColumn;
}

export interface AcquisitionPackageSummaryMetadataAndDataDTO {
  total_count: number;
  acquisitionPackageSummaryList: AcquisitionPackageSummaryDTO[];
}

export interface EvalPlanAssessmentAreaDTO extends BaseTableDTO {
  name: string;
  description: string;
  sequence: string;
}

export interface EvalPlanDifferentiatorDTO extends BaseTableDTO {
  name: string;
  description: string;
  sequence: string;
}

export interface EvaluationPlanDTO extends BaseTableDTO {
  source_selection: EvalPlanSourceSelection;
  method?: EvalPlanMethod;
  has_custom_specifications?: string;
  standard_specifications?: string;
  custom_specifications?: string;
  standard_differentiators?: string;
  custom_differentiators?: string;
}

export interface UserDTO extends BaseTableDTO {
  last_login_time?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  user_name?: string;
  email?: string;
}

export interface UserManagementDTO extends BaseTableDTO {
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: DisplayColumn;
}

export interface OperatorDTO extends BaseTableDTO{
  environment?: string;
  email?: string;
  dod_id?: string;
  added_by?: string;
  provisioned_date?: string;
  provisioned?: string;
  provisioning_failure_cause?: string;
  provisioning_request_date?: string;
}

export interface TrainingEstimateDTO extends BaseTableDTO{
  acquisition_package: string;
  estimated_price_per_training_unit: string;
  training_estimated_values?: string;
  training_option: string; //SINGLE or MULTIPLE
  training_unit: string; //PER_PERSON, PER_SESSION, or SUBSCRIPTION
  cloud_support_environment_instance: ReferenceColumn | string;
}

export interface EstimateOptionValueDTO {
  option: SingleMultiple;
  estimated_values: string[];
}

export interface RequirementsCostEstimateDTO extends BaseTableDTO{
  acquisition_package: ReferenceColumn | string;
  has_DOW_and_PoP: YesNo;
  optimize_replicate: EstimateOptionValue;
  architectural_design_current_environment: EstimateOptionValue;
  architectural_design_performance_requirements: EstimateOptionValueDTO;
  training: TrainingEstimateDTO[];
  travel: EstimateOptionValueObjectArray;
  surge_requirements: {
    capabilities: YesNo;
    capacity: number | null;
  }
  fee_specs: {
    is_charged: YesNo;
    percentage: number | null;
  };
  how_estimates_developed: {
    // csv list Eg: "AWS,GOOGLE_CLOUD,MICROSOFT_AZURE,ORACLE_CLOUD,PREVIOUSLY_PAID_PRICES,OTHER"
    tools_used: string
    other_tools_used: string
    cost_estimate_description: string;
    previous_cost_estimate_comparison:{
      options: "" | "MORE_THAN" | "LESS_THAN" | "SAME";
      percentage: number | null;
    };
  }
}

export interface RequirementsCostEstimateFlat extends BaseTableDTO{
  acquisition_package: ReferenceColumn | string;
  architectural_design_current_environment_option?: SingleMultiple;
  architectural_design_current_environment_estimated_values: string;// csv
  architectural_design_performance_requirements_option?: SingleMultiple;
  architectural_design_performance_requirements_estimated_values: string; //csv
  contracting_office_other_charges_fee: YesNo; // fee_spec
  contracting_office_other_fee_percentage: number | null; // fee_spec
  has_dow_and_pop: YesNo;
  optimize_replicate_option?: SingleMultiple;
  optimize_replicate_estimated_values: string; // csv
  surge_requirement_capabilities: YesNo
  surge_requirement_capacity: number | null;

  // TODO: double check the below properties for name matching with SNOW column names.
  //  Because properties are being defined based on consensus with platform team instead of actual.
  how_est_dev_tools_used: string; // csv list Eg: "AWS,GOOGLE_CLOUD,MICROSOFT_AZURE,OTHER..."
  how_est_dev_other_tools_used: string;
  how_est_dev_cost_estimate_description: string;
  how_est_dev_prev_cost_estimate_comp_option: "" | "MORE_THAN" | "LESS_THAN" | "SAME";
  how_est_dev_prev_cost_estimate_comp_percentage: number | null;
  how_est_dev_contracting_office_other_charges_fee: YesNo,
  how_est_dev_contracting_office_other_fee_percentage: number | null;
  travel_option?: SingleMultiple;
  travel_estimated_values: string;// csv
  training: string // json of TrainingEstimateDTO
  // training_cost_estimate: "" | "PER_PERSON" | "PER_CLASS" | "SUBSCRIPTION";
  // training_subscription_estimate: "" | "ANNUAL" | "MONTHLY";
  // training_estimated_price: number | null;
  // training_estimate_option: SingleMultiple;
  // training_estimated_values: string; // csv

  // TODO: not sure what the below 4 properties map to on the UI side RceDTO
  // contracting_office_fee_pct?: number | null; // does this map to "fee_specs" percentage?
  // cost_estimate_description?: // should this prefix "how_est_dev_"?

  // TODO: below 2 need suffix "how_estimates_developed" shortened to;
  //  "how_est_dev_prev_cost_estimate_comp_option
  // previous_cost_estimate_comparison_option: "" | "MORE_THAN" | "LESS_THAN" | "SAME";
  // previous_cost_estimate_comparison_percentage: number | null;

  // TODO: is below column needed? Looks like we can delete
  // surge_capabilities

  // TODO: REMAINING UI DTO properties that do not have a place in the RCE SNOW table
  // training: TrainingEstimateDTO[]; // as already covered earlier today in IGCE group chat
  // travel: EstimateOptionValueDTO; / should be flattened similar to "optimize_replicate_"
  // fee_specs: { // flatten it similar to how " surge_requirement_" are flattened
  //   is_charged: YesNo;
  //   percentage: number | null;
  // };
  // how_estimates_developed: { // prefix below 3 with "how_est_dev_" to find home for DTO on UI?
  //   tools_used: string; // csv list Eg: "AWS,GOOGLE_CLOUD,MICROSOFT_AZURE,OTHER..."
  //   other_tools_used: string;
  //   cost_estimate_description: string;
  // }
}

export interface IgceEstimateDTO extends BaseTableDTO {
  acquisition_package?: ReferenceColumn | string;
  classification_level?: ReferenceColumn | string;
  classification_instance?: ReferenceColumn | string;
  environment_instance?: ReferenceColumn | string;
  cross_domain_solution?: ReferenceColumn | string;
  cross_domain_pair?: string; // "U_TO_S", "S_TO_U". Only these are stored in CDS table not sys_ids
  contract_type?: "" | "FFP" | "T&M" | "TBD";
  title?: string;
  description?: string;
  unit?: string;
  unit_price?: number | null;
  unit_quantity?: string;
  dow_task_number?: string;
  classification_display?: string;
  idiq_clin_type?: string
}

export interface RegionsDTO extends BaseTableDTO {
  sequence: string
  sys_id: string
  sys_updated_by: string
  sys_created_on: string
  name: string
  sys_mod_count: string
  description: string
  sys_updated_on: string
  sys_tags: string
  sys_created_by: string
  group: string
}
export interface PackageDocumentsSignedDTO extends BaseTableDTO {
  sys_id?: string
  sys_updated_by?: string
  sys_created_on?: string
  sys_mod_count?: string
  acquisition_package?: string
  sys_updated_on?: string
  sys_tags?: string
  sys_created_by?: string
}

export interface PackageDocumentsUnsignedDTO extends BaseTableDTO {
  sys_id?: string
  sys_updated_by?: string
  sys_created_on?: string
  sys_mod_count?: string
  acquisition_package?: string
  sys_updated_on?: string
  sys_tags?: string
  sys_created_by?: string
}
