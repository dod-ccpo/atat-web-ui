export interface Application {
  environments: Array<string>;
  name: string;
  description?: string;
}

export interface ApplicationDetail extends Application {
  administrators?: Array<string>;
  readOnlyOperators?: Array<string>;
}

export interface Environment {
  /**
   *
   * @type {string}
   * @memberof Environment
   */
  name: string;
}

export interface EnvironmentDetail extends Environment {
  /**
   *
   * @type {Array&lt;string&gt;}
   * @memberof EnvironmentDetail
   */
  administrators?: Array<string>;
  /**
   *
   * @type {Array&lt;string&gt;}
   * @memberof EnvironmentDetail
   */
  contributors?: Array<string>;
  /**
   *
   * @type {Array&lt;string&gt;}
   * @memberof EnvironmentDetail
   */
  readOnlyOperators?: Array<string>;
}
