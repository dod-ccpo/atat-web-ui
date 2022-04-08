export interface SensitiveInformationDTO {
  sys_mod_count?: string;
  sys_updated_on?: string;
  sys_tags?: string;
  sys_id?: string;
  sys_updated_by?: string;
  sys_created_on?: string;
  sys_created_by?: string;

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
}
