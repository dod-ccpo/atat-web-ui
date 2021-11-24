import { Application } from "../Application";

export interface PortfolioBase {
  /**
   *
   * @type {string}
   * @memberof PortfolioBase
   */
  csp: string;
  /**
   *
   * @type {Array&lt;string&gt;}
   * @memberof PortfolioBase
   */
  dodComponents?: Array<string>;
  /**
   *
   * @type {string}
   * @memberof PortfolioBase
   */
  name: string;
}

export interface User {
  /**
   * 
   * @type {string}
   * @memberof User
   */
  email?: any;
  /**
   * 
   * @type {string}
   * @memberof User
   */
  firstName?: any;
  /**
   * 
   * @type {string}
   * @memberof User
   */
  lastName?: any;
}


export interface Portfolio extends PortfolioBase {
  /**
   * 
   * @type {Array&lt;string&gt;}
   * @memberof Portfolio
   */
  portfolioManagers: Array<string>;
  /**
   * 
   * @type {string}
   * @memberof Portfolio
   */
  description?: Array<string>;
  /**
   * 
   * @type {User}
   * @memberof Portfolio
   */
  owner?: User ;
  /**
   * 
   * @type {Array&lt;Application&gt;}
   * @memberof Portfolio
   */
  applications?: Array<Application>;
}


export interface PortfolioSummary extends PortfolioBase {
  /**
   *
   * @type {number}
   * @memberof PortfolioSummary
   */
  totalObligated?: number;
  /**
   *
   * @type {number}
   * @memberof PortfolioSummary
   */
  fundsSpent?: number;
  /**
   * Earliest popStartDate of all active CLINs in this Portfolio
   * @type {string}
   * @memberof PortfolioSummary
   */
  earliestPopStartDate?: string;
  /**
   * Latest popEndDate of all active CLINs in this Portfolio
   * @type {string}
   * @memberof PortfolioSummary
   */
  latestPopEndDate?: string;
  /**
   * Message displayed to the user regarding the imminence of PoP dates
   * @type {string}
   * @memberof PortfolioSummary
   */
  popMessage?: string;
  /**
   * Portfolio status relative to Period of Performance of active CLINs
   * @type {string}
   * @memberof PortfolioSummary
   */
  popStatus?: string;
  /**
   * Portfolio status relative to available funds in active CLINs
   * @type {string}
   * @memberof PortfolioSummary
   */
  fundingStatus?: string;
  /**
   * CSP Provisioning Status
   * @type {string}
   * @memberof PortfolioSummary
   */
  provisioningStatus?: string;
  /**
   * Portfolio status relative to the lifecycle of the object in ATAT and the CSP
   * @type {string}
   * @memberof PortfolioSummary
   */
  lifecycleStatus?: string;
}


export interface PortfolioAccess {
  /**
   * 
   * @type {Array&lt;string&gt;}
   * @memberof PortfolioAccess
   */
  portfolioAdministrators?: Array<string>;
}


export interface PortfolioDetail extends Portfolio {
  /**
   * 
   * @type {number}
   * @memberof PortfolioDetail
   */
  totalObligated?: number;
  /**
   * 
   * @type {number}
   * @memberof PortfolioDetail
   */
  fundsSpent?: number;
  /**
   * Earliest popStartDate of all active CLINs in this Portfolio
   * @type {string}
   * @memberof PortfolioDetail
   */
  earliestPopStartDate?: string ;
  /**
   * Latest popEndDate of all active CLINs in this Portfolio
   * @type {string}
   * @memberof PortfolioDetail
   */
  latestPopEndDate?: string;
  /**
   * Message displayed to the user regarding the imminence of PoP dates
   * @type {string}
   * @memberof PortfolioDetail
   */
  popMessage?: string;
  /**
   * Portfolio status relative to Period of Performance of active CLINs
   * @type {string}
   * @memberof PortfolioDetail
   */
  popStatus?: string;
  /**
   * Portfolio status relative to available funds in active CLINs
   * @type {string}
   * @memberof PortfolioDetail
   */
  fundingStatus?: string;
  /**
   * CSP Provisioning Status
   * @type {string}
   * @memberof PortfolioDetail
   */
  provisioningStatus?: string;
  /**
   * Portfolio status relative to the lifecycle of the object in ATAT and the CSP
   * @type {string}
   * @memberof PortfolioDetail
   */
  lifecycleStatus?: string;
  /**
   * 
   * @type {Array&lt;string&gt;}
   * @memberof PortfolioDetail
   */
  portfolioAdministrators?: Array<string>;
}