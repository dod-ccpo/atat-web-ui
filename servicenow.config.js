/**
 * This is the prefix for this ServiceNow API.
 *   api/ - included by default for ServiceNow scripted REST APIs
 *   x_g_dis_atat/ - the scope of the ATAT application
 *   vue_app_container - the api_id of the Vue App Container scripted REST API
 */
const REST_API_PATH = `api/x_g_dis_atat/vue_app_container`;

const servicenowConfig = {
  /**
   * ServiceNow path to GET resource which serves javascript files
   * Current configuration does not produce CSS files
   * CSS code will be embedded into javascript files
   */
  JS_API_PATH: `${REST_API_PATH}/js/`,
  /**
   * ServiceNow path to GET resource which serves
   * Image files (png, jpg, gif)
   * SVG files will be embedded into javascript files
   */
  IMG_API_PATH: `${REST_API_PATH}/img/`,
  /**
   * ServiceNow path to GET resource which serves
   * other files, like fonts etc.
   */
  ASSETS_API_PATH: `${REST_API_PATH}/other_assets/`,
  /**
   * fonts and images below this size will be put inside
   * JS chunks, instead of being saved as separate files
   */
  ASSET_SIZE_LIMIT: 10000,
};

module.exports = servicenowConfig;
