/* tslint:disable */
/* eslint-disable */
/**
 * ATAT Internal API
 */
 import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';

 export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface RequestArgs
 */
export interface RequestArgs {
    url: string;
    options: any;
}

/**
 *
 * @export
 * @class BaseAPI
 */
class BaseAPI {
    protected configuration: Configuration | undefined;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected axios: AxiosInstance = globalAxios) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
};

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
 export class RequiredError extends Error {
    name: "RequiredError" = "RequiredError";
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

 interface ConfigurationParameters {
    apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);
    username?: string;
    password?: string;
    accessToken?: string | Promise<string> | ((name?: string, scopes?: string[]) => string) | ((name?: string, scopes?: string[]) => Promise<string>);
    basePath?: string;
    baseOptions?: any;
}

class Configuration {
     /**
     * override base path
     *
     * @type {string}
     * @memberof Configuration
     */
    basePath?: string;
    /**
     * base options for axios calls
     *
     * @type {any}
     * @memberof Configuration
     */
    baseOptions?: any;

    constructor(param: ConfigurationParameters = {}) {
        this.basePath = param.basePath;
        this.baseOptions = param.baseOptions;
    }
}


 // Some imports not used depending on template conditions
 // @ts-ignore
 const BASE_PATH  ="/";

 import { Application, ApplicationDetail, Environment, EnvironmentDetail } from '../../../types/Application';
 import { TaskOrder, Clin } from '../../../types/TaskOrder';
 import { PortfolioBase, Portfolio, PortfolioSummary, PortfolioAccess, PortfolioDetail  } from '../../../types/Portfolio';
 import { ValidationError } from  '../../../types/Error';
 /**
  * DefaultApi - axios parameter creator
  * @export
  */
 export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
     return {
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {Application} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createApplication: async (portfolioId: string, body?: Application, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling createApplication.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {TaskOrder} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createClin: async (portfolioId: string, taskOrderId: string, body?: TaskOrder, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling createClin.');
             }
             // verify required parameter 'taskOrderId' is not null or undefined
             if (taskOrderId === null || taskOrderId === undefined) {
                 throw new RequiredError('taskOrderId','Required parameter taskOrderId was null or undefined when calling createClin.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders/{taskOrderId}/clins`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"taskOrderId"}}`, encodeURIComponent(String(taskOrderId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {Environment} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createEnvironment: async (portfolioId: string, applicationId: string, body?: Environment, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling createEnvironment.');
             }
             // verify required parameter 'applicationId' is not null or undefined
             if (applicationId === null || applicationId === undefined) {
                 throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling createEnvironment.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications/{applicationId}/environments`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"applicationId"}}`, encodeURIComponent(String(applicationId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {Portfolio} [body] Use an empty String to create an empty Portfolio or pass a complete object to create a complete version.
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createPortfolio: async (body?: Portfolio, options: any = {}): Promise<RequestArgs> => {
             const localVarPath = `/portfolios`;
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {TaskOrder} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createTaskOrder: async (portfolioId: string, body?: TaskOrder, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling createTaskOrder.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Deletes an Application (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deleteApplication: async (portfolioId: string, applicationId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling deleteApplication.');
             }
             // verify required parameter 'applicationId' is not null or undefined
             if (applicationId === null || applicationId === undefined) {
                 throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling deleteApplication.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications/{applicationId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"applicationId"}}`, encodeURIComponent(String(applicationId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Deletes a CLIN. Not allowed on provisioned portfolios, hard delete on draft Portfolios.
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deleteClin: async (portfolioId: string, taskOrderId: string, clin: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling deleteClin.');
             }
             // verify required parameter 'taskOrderId' is not null or undefined
             if (taskOrderId === null || taskOrderId === undefined) {
                 throw new RequiredError('taskOrderId','Required parameter taskOrderId was null or undefined when calling deleteClin.');
             }
             // verify required parameter 'clin' is not null or undefined
             if (clin === null || clin === undefined) {
                 throw new RequiredError('clin','Required parameter clin was null or undefined when calling deleteClin.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders/{taskOrderId}/clins/{clin}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"taskOrderId"}}`, encodeURIComponent(String(taskOrderId)))
                 .replace(`{${"clin"}}`, encodeURIComponent(String(clin)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Deletes an Environment (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deleteEnvironment: async (portfolioId: string, applicationId: string, environmentId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling deleteEnvironment.');
             }
             // verify required parameter 'applicationId' is not null or undefined
             if (applicationId === null || applicationId === undefined) {
                 throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling deleteEnvironment.');
             }
             // verify required parameter 'environmentId' is not null or undefined
             if (environmentId === null || environmentId === undefined) {
                 throw new RequiredError('environmentId','Required parameter environmentId was null or undefined when calling deleteEnvironment.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications/{applicationId}/environments/{environmentId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"applicationId"}}`, encodeURIComponent(String(applicationId)))
                 .replace(`{${"environmentId"}}`, encodeURIComponent(String(environmentId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Deletes a Portfolio (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deletePortfolio: async (portfolioId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling deletePortfolio.');
             }
             const localVarPath = `/portfolios/{portfolioId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Deletes a TaskOrder (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deleteTaskOrder: async (portfolioId: string, taskOrderId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling deleteTaskOrder.');
             }
             // verify required parameter 'taskOrderId' is not null or undefined
             if (taskOrderId === null || taskOrderId === undefined) {
                 throw new RequiredError('taskOrderId','Required parameter taskOrderId was null or undefined when calling deleteTaskOrder.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders/{taskOrderId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"taskOrderId"}}`, encodeURIComponent(String(taskOrderId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getApplication: async (portfolioId: string, applicationId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getApplication.');
             }
             // verify required parameter 'applicationId' is not null or undefined
             if (applicationId === null || applicationId === undefined) {
                 throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling getApplication.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications/{applicationId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"applicationId"}}`, encodeURIComponent(String(applicationId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of all Applications within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getApplications: async (portfolioId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getApplications.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getClin: async (portfolioId: string, taskOrderId: string, clin: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getClin.');
             }
             // verify required parameter 'taskOrderId' is not null or undefined
             if (taskOrderId === null || taskOrderId === undefined) {
                 throw new RequiredError('taskOrderId','Required parameter taskOrderId was null or undefined when calling getClin.');
             }
             // verify required parameter 'clin' is not null or undefined
             if (clin === null || clin === undefined) {
                 throw new RequiredError('clin','Required parameter clin was null or undefined when calling getClin.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders/{taskOrderId}/clins/{clin}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"taskOrderId"}}`, encodeURIComponent(String(taskOrderId)))
                 .replace(`{${"clin"}}`, encodeURIComponent(String(clin)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of all CLINs within a Task Order
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getClins: async (portfolioId: string, taskOrderId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getClins.');
             }
             // verify required parameter 'taskOrderId' is not null or undefined
             if (taskOrderId === null || taskOrderId === undefined) {
                 throw new RequiredError('taskOrderId','Required parameter taskOrderId was null or undefined when calling getClins.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders/{taskOrderId}/clins`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"taskOrderId"}}`, encodeURIComponent(String(taskOrderId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of an Environment within an Application
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getEnvironment: async (portfolioId: string, applicationId: string, environmentId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getEnvironment.');
             }
             // verify required parameter 'applicationId' is not null or undefined
             if (applicationId === null || applicationId === undefined) {
                 throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling getEnvironment.');
             }
             // verify required parameter 'environmentId' is not null or undefined
             if (environmentId === null || environmentId === undefined) {
                 throw new RequiredError('environmentId','Required parameter environmentId was null or undefined when calling getEnvironment.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications/{applicationId}/environments/{environmentId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"applicationId"}}`, encodeURIComponent(String(applicationId)))
                 .replace(`{${"environmentId"}}`, encodeURIComponent(String(environmentId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of all Environments within an Application
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getEnvironments: async (portfolioId: string, applicationId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getEnvironments.');
             }
             // verify required parameter 'applicationId' is not null or undefined
             if (applicationId === null || applicationId === undefined) {
                 throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling getEnvironments.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications/{applicationId}/environments`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"applicationId"}}`, encodeURIComponent(String(applicationId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getPortfolio: async (portfolioId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getPortfolio.');
             }
             const localVarPath = `/portfolios/{portfolioId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {number} [offset] The number of items to skip before starting to collect the result set.
          * @param {number} [limit] The numbers of items to return.
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getPortfolios: async (offset?: number, limit?: number, options: any = {}): Promise<RequestArgs> => {
             const localVarPath = `/portfolios`;
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             if (offset !== undefined) {
                 localVarQueryParameter['offset'] = offset;
             }
 
             if (limit !== undefined) {
                 localVarQueryParameter['limit'] = limit;
             }
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getTaskOrder: async (portfolioId: string, taskOrderId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getTaskOrder.');
             }
             // verify required parameter 'taskOrderId' is not null or undefined
             if (taskOrderId === null || taskOrderId === undefined) {
                 throw new RequiredError('taskOrderId','Required parameter taskOrderId was null or undefined when calling getTaskOrder.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders/{taskOrderId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"taskOrderId"}}`, encodeURIComponent(String(taskOrderId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Gets a detailed view of all Task Orders within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getTaskOrders: async (portfolioId: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling getTaskOrders.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Submits all pending resources within the given Portfolio for Provisioning
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         submitPortfolio: async (portfolioId: string, body?: string, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling submitPortfolio.');
             }
             const localVarPath = `/portfolios/{portfolioId}/submit`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {string} applicationId ID of the Application
          * @param {Application} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updateApplication: async (portfolioId: string, applicationId: string, body?: Application, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling updateApplication.');
             }
             // verify required parameter 'applicationId' is not null or undefined
             if (applicationId === null || applicationId === undefined) {
                 throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling updateApplication.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications/{applicationId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"applicationId"}}`, encodeURIComponent(String(applicationId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * Updates a CLIN. Not allowed on provisioned portfolios.
          * @param {string} portfolioId 
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {Clin} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updateClin: async (portfolioId: string, taskOrderId: string, clin: string, body?: Clin, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling updateClin.');
             }
             // verify required parameter 'taskOrderId' is not null or undefined
             if (taskOrderId === null || taskOrderId === undefined) {
                 throw new RequiredError('taskOrderId','Required parameter taskOrderId was null or undefined when calling updateClin.');
             }
             // verify required parameter 'clin' is not null or undefined
             if (clin === null || clin === undefined) {
                 throw new RequiredError('clin','Required parameter clin was null or undefined when calling updateClin.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders/{taskOrderId}/clins/{clin}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"taskOrderId"}}`, encodeURIComponent(String(taskOrderId)))
                 .replace(`{${"clin"}}`, encodeURIComponent(String(clin)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {Environment} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updateEnvironment: async (portfolioId: string, applicationId: string, environmentId: string, body?: Environment, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling updateEnvironment.');
             }
             // verify required parameter 'applicationId' is not null or undefined
             if (applicationId === null || applicationId === undefined) {
                 throw new RequiredError('applicationId','Required parameter applicationId was null or undefined when calling updateEnvironment.');
             }
             // verify required parameter 'environmentId' is not null or undefined
             if (environmentId === null || environmentId === undefined) {
                 throw new RequiredError('environmentId','Required parameter environmentId was null or undefined when calling updateEnvironment.');
             }
             const localVarPath = `/portfolios/{portfolioId}/applications/{applicationId}/environments/{environmentId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"applicationId"}}`, encodeURIComponent(String(applicationId)))
                 .replace(`{${"environmentId"}}`, encodeURIComponent(String(environmentId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {Portfolio} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updatePortfolio: async (portfolioId: string, body?: Portfolio, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling updatePortfolio.');
             }
             const localVarPath = `/portfolios/{portfolioId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {TaskOrder} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updateTaskOrder: async (portfolioId: string, taskOrderId: string, body?: TaskOrder, options: any = {}): Promise<RequestArgs> => {
             // verify required parameter 'portfolioId' is not null or undefined
             if (portfolioId === null || portfolioId === undefined) {
                 throw new RequiredError('portfolioId','Required parameter portfolioId was null or undefined when calling updateTaskOrder.');
             }
             // verify required parameter 'taskOrderId' is not null or undefined
             if (taskOrderId === null || taskOrderId === undefined) {
                 throw new RequiredError('taskOrderId','Required parameter taskOrderId was null or undefined when calling updateTaskOrder.');
             }
             const localVarPath = `/portfolios/{portfolioId}/taskOrders/{taskOrderId}`
                 .replace(`{${"portfolioId"}}`, encodeURIComponent(String(portfolioId)))
                 .replace(`{${"taskOrderId"}}`, encodeURIComponent(String(taskOrderId)));
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             localVarHeaderParameter['Content-Type'] = 'application/json';
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
     }
 };
 
 /**
  * DefaultApi - functional programming interface
  * @export
  */
 export const DefaultApiFp = function(configuration?: Configuration) {
     return {
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {Application} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async createApplication(portfolioId: string, body?: Application, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Application>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).createApplication(portfolioId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {TaskOrder} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async createClin(portfolioId: string, taskOrderId: string, body?: TaskOrder, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TaskOrder>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).createClin(portfolioId, taskOrderId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {Environment} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async createEnvironment(portfolioId: string, applicationId: string, body?: Environment, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Environment>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).createEnvironment(portfolioId, applicationId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {Portfolio} [body] Use an empty String to create an empty Portfolio or pass a complete object to create a complete version.
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async createPortfolio(body?: Portfolio, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Portfolio>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).createPortfolio(body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {TaskOrder} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async createTaskOrder(portfolioId: string, body?: TaskOrder, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TaskOrder>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).createTaskOrder(portfolioId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Deletes an Application (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async deleteApplication(portfolioId: string, applicationId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Application>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).deleteApplication(portfolioId, applicationId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Deletes a CLIN. Not allowed on provisioned portfolios, hard delete on draft Portfolios.
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async deleteClin(portfolioId: string, taskOrderId: string, clin: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Clin>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).deleteClin(portfolioId, taskOrderId, clin, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Deletes an Environment (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async deleteEnvironment(portfolioId: string, applicationId: string, environmentId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Environment>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).deleteEnvironment(portfolioId, applicationId, environmentId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Deletes a Portfolio (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async deletePortfolio(portfolioId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PortfolioDetail>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).deletePortfolio(portfolioId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Deletes a TaskOrder (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async deleteTaskOrder(portfolioId: string, taskOrderId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TaskOrder>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).deleteTaskOrder(portfolioId, taskOrderId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getApplication(portfolioId: string, applicationId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ApplicationDetail>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getApplication(portfolioId, applicationId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of all Applications within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getApplications(portfolioId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Application>>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getApplications(portfolioId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getClin(portfolioId: string, taskOrderId: string, clin: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Clin>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getClin(portfolioId, taskOrderId, clin, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of all CLINs within a Task Order
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getClins(portfolioId: string, taskOrderId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Clin>>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getClins(portfolioId, taskOrderId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of an Environment within an Application
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getEnvironment(portfolioId: string, applicationId: string, environmentId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<EnvironmentDetail>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getEnvironment(portfolioId, applicationId, environmentId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of all Environments within an Application
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getEnvironments(portfolioId: string, applicationId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Environment>>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getEnvironments(portfolioId, applicationId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getPortfolio(portfolioId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PortfolioDetail>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getPortfolio(portfolioId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {number} [offset] The number of items to skip before starting to collect the result set.
          * @param {number} [limit] The numbers of items to return.
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getPortfolios(offset?: number, limit?: number, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PortfolioSummary>>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getPortfolios(offset, limit, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getTaskOrder(portfolioId: string, taskOrderId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TaskOrder>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getTaskOrder(portfolioId, taskOrderId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Gets a detailed view of all Task Orders within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async getTaskOrders(portfolioId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TaskOrder>>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).getTaskOrders(portfolioId, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Submits all pending resources within the given Portfolio for Provisioning
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async submitPortfolio(portfolioId: string, body?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).submitPortfolio(portfolioId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {string} applicationId ID of the Application
          * @param {Application} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async updateApplication(portfolioId: string, applicationId: string, body?: Application, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Application>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).updateApplication(portfolioId, applicationId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * Updates a CLIN. Not allowed on provisioned portfolios.
          * @param {string} portfolioId 
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {Clin} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async updateClin(portfolioId: string, taskOrderId: string, clin: string, body?: Clin, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Clin>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).updateClin(portfolioId, taskOrderId, clin, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {Environment} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async updateEnvironment(portfolioId: string, applicationId: string, environmentId: string, body?: Environment, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Environment>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).updateEnvironment(portfolioId, applicationId, environmentId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {Portfolio} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async updatePortfolio(portfolioId: string, body?: Portfolio, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PortfolioBase>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).updatePortfolio(portfolioId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {TaskOrder} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async updateTaskOrder(portfolioId: string, taskOrderId: string, body?: TaskOrder, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TaskOrder>> {
             const localVarAxiosArgs = await DefaultApiAxiosParamCreator(configuration).updateTaskOrder(portfolioId, taskOrderId, body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
     }
 };
 
 /**
  * DefaultApi - factory interface
  * @export
  */
 export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
     return {
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {Application} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createApplication(portfolioId: string, body?: Application, options?: any): AxiosPromise<Application> {
             return DefaultApiFp(configuration).createApplication(portfolioId, body, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {TaskOrder} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createClin(portfolioId: string, taskOrderId: string, body?: TaskOrder, options?: any): AxiosPromise<TaskOrder> {
             return DefaultApiFp(configuration).createClin(portfolioId, taskOrderId, body, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {Environment} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createEnvironment(portfolioId: string, applicationId: string, body?: Environment, options?: any): AxiosPromise<Environment> {
             return DefaultApiFp(configuration).createEnvironment(portfolioId, applicationId, body, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {Portfolio} [body] Use an empty String to create an empty Portfolio or pass a complete object to create a complete version.
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createPortfolio(body?: Portfolio, options?: any): AxiosPromise<Portfolio> {
             return DefaultApiFp(configuration).createPortfolio(body, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {string} portfolioId ID of the Portfolio
          * @param {TaskOrder} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         createTaskOrder(portfolioId: string, body?: TaskOrder, options?: any): AxiosPromise<TaskOrder> {
             return DefaultApiFp(configuration).createTaskOrder(portfolioId, body, options).then((request) => request(axios, basePath));
         },
         /**
          * Deletes an Application (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deleteApplication(portfolioId: string, applicationId: string, options?: any): AxiosPromise<Application> {
             return DefaultApiFp(configuration).deleteApplication(portfolioId, applicationId, options).then((request) => request(axios, basePath));
         },
         /**
          * Deletes a CLIN. Not allowed on provisioned portfolios, hard delete on draft Portfolios.
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deleteClin(portfolioId: string, taskOrderId: string, clin: string, options?: any): AxiosPromise<Clin> {
             return DefaultApiFp(configuration).deleteClin(portfolioId, taskOrderId, clin, options).then((request) => request(axios, basePath));
         },
         /**
          * Deletes an Environment (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deleteEnvironment(portfolioId: string, applicationId: string, environmentId: string, options?: any): AxiosPromise<Environment> {
             return DefaultApiFp(configuration).deleteEnvironment(portfolioId, applicationId, environmentId, options).then((request) => request(axios, basePath));
         },
         /**
          * Deletes a Portfolio (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deletePortfolio(portfolioId: string, options?: any): AxiosPromise<PortfolioDetail> {
             return DefaultApiFp(configuration).deletePortfolio(portfolioId, options).then((request) => request(axios, basePath));
         },
         /**
          * Deletes a TaskOrder (hard delete if not provisioned, soft delete otherwise)
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         deleteTaskOrder(portfolioId: string, taskOrderId: string, options?: any): AxiosPromise<TaskOrder> {
             return DefaultApiFp(configuration).deleteTaskOrder(portfolioId, taskOrderId, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getApplication(portfolioId: string, applicationId: string, options?: any): AxiosPromise<ApplicationDetail> {
             return DefaultApiFp(configuration).getApplication(portfolioId, applicationId, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of all Applications within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getApplications(portfolioId: string, options?: any): AxiosPromise<Array<Application>> {
             return DefaultApiFp(configuration).getApplications(portfolioId, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getClin(portfolioId: string, taskOrderId: string, clin: string, options?: any): AxiosPromise<Clin> {
             return DefaultApiFp(configuration).getClin(portfolioId, taskOrderId, clin, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of all CLINs within a Task Order
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getClins(portfolioId: string, taskOrderId: string, options?: any): AxiosPromise<Array<Clin>> {
             return DefaultApiFp(configuration).getClins(portfolioId, taskOrderId, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of an Environment within an Application
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getEnvironment(portfolioId: string, applicationId: string, environmentId: string, options?: any): AxiosPromise<EnvironmentDetail> {
             return DefaultApiFp(configuration).getEnvironment(portfolioId, applicationId, environmentId, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of all Environments within an Application
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} applicationId ID of the Application
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getEnvironments(portfolioId: string, applicationId: string, options?: any): AxiosPromise<Array<Environment>> {
             return DefaultApiFp(configuration).getEnvironments(portfolioId, applicationId, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getPortfolio(portfolioId: string, options?: any): AxiosPromise<PortfolioDetail> {
             return DefaultApiFp(configuration).getPortfolio(portfolioId, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {number} [offset] The number of items to skip before starting to collect the result set.
          * @param {number} [limit] The numbers of items to return.
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getPortfolios(offset?: number, limit?: number, options?: any): AxiosPromise<Array<PortfolioSummary>> {
             return DefaultApiFp(configuration).getPortfolios(offset, limit, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of an Application within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getTaskOrder(portfolioId: string, taskOrderId: string, options?: any): AxiosPromise<TaskOrder> {
             return DefaultApiFp(configuration).getTaskOrder(portfolioId, taskOrderId, options).then((request) => request(axios, basePath));
         },
         /**
          * Gets a detailed view of all Task Orders within a Portfolio
          * @param {string} portfolioId ID of the Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         getTaskOrders(portfolioId: string, options?: any): AxiosPromise<Array<TaskOrder>> {
             return DefaultApiFp(configuration).getTaskOrders(portfolioId, options).then((request) => request(axios, basePath));
         },
         /**
          * Submits all pending resources within the given Portfolio for Provisioning
          * @param {string} portfolioId ID of the Portfolio
          * @param {string} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         submitPortfolio(portfolioId: string, body?: string, options?: any): AxiosPromise<void> {
             return DefaultApiFp(configuration).submitPortfolio(portfolioId, body, options).then((request) => request(axios, basePath));
         },

         /**
          * 
          * @param {string} portfolioId 
          * @param {string} applicationId ID of the Application
          * @param {Application} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updateApplication(portfolioId: string, applicationId: string, body?: Application, options?: any): AxiosPromise<Application> {
             return DefaultApiFp(configuration).updateApplication(portfolioId, applicationId, body, options).then((request) => request(axios, basePath));
         },
         /**
          * Updates a CLIN. Not allowed on provisioned portfolios.
          * @param {string} portfolioId 
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {string} clin Contract Line Item Number (CLIN)
          * @param {Clin} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updateClin(portfolioId: string, taskOrderId: string, clin: string, body?: Clin, options?: any): AxiosPromise<Clin> {
             return DefaultApiFp(configuration).updateClin(portfolioId, taskOrderId, clin, body, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {string} applicationId ID of the Application
          * @param {string} environmentId ID of the Environment
          * @param {Environment} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updateEnvironment(portfolioId: string, applicationId: string, environmentId: string, body?: Environment, options?: any): AxiosPromise<Environment> {
             return DefaultApiFp(configuration).updateEnvironment(portfolioId, applicationId, environmentId, body, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {Portfolio} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updatePortfolio(portfolioId: string, body?: Portfolio, options?: any): AxiosPromise<PortfolioBase> {
             return DefaultApiFp(configuration).updatePortfolio(portfolioId, body, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {string} portfolioId 
          * @param {string} taskOrderId ID of the TaskOrder
          * @param {TaskOrder} [body] Update an existing Portfolio
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         updateTaskOrder(portfolioId: string, taskOrderId: string, body?: TaskOrder, options?: any): AxiosPromise<TaskOrder> {
             return DefaultApiFp(configuration).updateTaskOrder(portfolioId, taskOrderId, body, options).then((request) => request(axios, basePath));
         },
     };
 };
 
 /**
  * DefaultApi - object-oriented interface
  * @export
  * @class DefaultApi
  * @extends {BaseAPI}
  */
 export class DefaultApi extends BaseAPI {
     /**
      * 
      * @param {string} portfolioId ID of the Portfolio
      * @param {Application} [body] 
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public createApplication(portfolioId: string, body?: Application, options?: any) {
         return DefaultApiFp(this.configuration).createApplication(portfolioId, body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} taskOrderId ID of the TaskOrder
      * @param {TaskOrder} [body] 
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public createClin(portfolioId: string, taskOrderId: string, body?: TaskOrder, options?: any) {
         return DefaultApiFp(this.configuration).createClin(portfolioId, taskOrderId, body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} applicationId ID of the Application
      * @param {Environment} [body] 
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public createEnvironment(portfolioId: string, applicationId: string, body?: Environment, options?: any) {
         return DefaultApiFp(this.configuration).createEnvironment(portfolioId, applicationId, body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {Portfolio} [body] Use an empty String to create an empty Portfolio or pass a complete object to create a complete version.
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public createPortfolio(body?: Portfolio, options?: any) {
         return DefaultApiFp(this.configuration).createPortfolio(body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {string} portfolioId ID of the Portfolio
      * @param {TaskOrder} [body] 
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public createTaskOrder(portfolioId: string, body?: TaskOrder, options?: any) {
         return DefaultApiFp(this.configuration).createTaskOrder(portfolioId, body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Deletes an Application (hard delete if not provisioned, soft delete otherwise)
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} applicationId ID of the Application
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public deleteApplication(portfolioId: string, applicationId: string, options?: any) {
         return DefaultApiFp(this.configuration).deleteApplication(portfolioId, applicationId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Deletes a CLIN. Not allowed on provisioned portfolios, hard delete on draft Portfolios.
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} taskOrderId ID of the TaskOrder
      * @param {string} clin Contract Line Item Number (CLIN)
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public deleteClin(portfolioId: string, taskOrderId: string, clin: string, options?: any) {
         return DefaultApiFp(this.configuration).deleteClin(portfolioId, taskOrderId, clin, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Deletes an Environment (hard delete if not provisioned, soft delete otherwise)
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} applicationId ID of the Application
      * @param {string} environmentId ID of the Environment
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public deleteEnvironment(portfolioId: string, applicationId: string, environmentId: string, options?: any) {
         return DefaultApiFp(this.configuration).deleteEnvironment(portfolioId, applicationId, environmentId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Deletes a Portfolio (hard delete if not provisioned, soft delete otherwise)
      * @param {string} portfolioId ID of the Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public deletePortfolio(portfolioId: string, options?: any) {
         return DefaultApiFp(this.configuration).deletePortfolio(portfolioId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Deletes a TaskOrder (hard delete if not provisioned, soft delete otherwise)
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} taskOrderId ID of the TaskOrder
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public deleteTaskOrder(portfolioId: string, taskOrderId: string, options?: any) {
         return DefaultApiFp(this.configuration).deleteTaskOrder(portfolioId, taskOrderId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of an Application within a Portfolio
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} applicationId ID of the Application
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getApplication(portfolioId: string, applicationId: string, options?: any) {
         return DefaultApiFp(this.configuration).getApplication(portfolioId, applicationId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of all Applications within a Portfolio
      * @param {string} portfolioId ID of the Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getApplications(portfolioId: string, options?: any) {
         return DefaultApiFp(this.configuration).getApplications(portfolioId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of an Application within a Portfolio
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} taskOrderId ID of the TaskOrder
      * @param {string} clin Contract Line Item Number (CLIN)
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getClin(portfolioId: string, taskOrderId: string, clin: string, options?: any) {
         return DefaultApiFp(this.configuration).getClin(portfolioId, taskOrderId, clin, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of all CLINs within a Task Order
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} taskOrderId ID of the TaskOrder
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getClins(portfolioId: string, taskOrderId: string, options?: any) {
         return DefaultApiFp(this.configuration).getClins(portfolioId, taskOrderId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of an Environment within an Application
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} applicationId ID of the Application
      * @param {string} environmentId ID of the Environment
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getEnvironment(portfolioId: string, applicationId: string, environmentId: string, options?: any) {
         return DefaultApiFp(this.configuration).getEnvironment(portfolioId, applicationId, environmentId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of all Environments within an Application
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} applicationId ID of the Application
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getEnvironments(portfolioId: string, applicationId: string, options?: any) {
         return DefaultApiFp(this.configuration).getEnvironments(portfolioId, applicationId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of a Portfolio
      * @param {string} portfolioId ID of the Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getPortfolio(portfolioId: string, options?: any) {
         return DefaultApiFp(this.configuration).getPortfolio(portfolioId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {number} [offset] The number of items to skip before starting to collect the result set.
      * @param {number} [limit] The numbers of items to return.
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getPortfolios(offset?: number, limit?: number, options?: any) {
         return DefaultApiFp(this.configuration).getPortfolios(offset, limit, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of an Application within a Portfolio
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} taskOrderId ID of the TaskOrder
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getTaskOrder(portfolioId: string, taskOrderId: string, options?: any) {
         return DefaultApiFp(this.configuration).getTaskOrder(portfolioId, taskOrderId, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Gets a detailed view of all Task Orders within a Portfolio
      * @param {string} portfolioId ID of the Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public getTaskOrders(portfolioId: string, options?: any) {
         return DefaultApiFp(this.configuration).getTaskOrders(portfolioId, options).then((request) => request(this.axios, this.basePath));
     }

     /**
      * Submits all pending resources within the given Portfolio for Provisioning
      * @param {string} portfolioId ID of the Portfolio
      * @param {string} [body] 
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public submitPortfolio(portfolioId: string, body?: string, options?: any) {
         return DefaultApiFp(this.configuration).submitPortfolio(portfolioId, body, options).then((request) => request(this.axios, this.basePath));
     }
 
     /**
      * 
      * @param {string} portfolioId 
      * @param {string} applicationId ID of the Application
      * @param {Application} [body] Update an existing Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public updateApplication(portfolioId: string, applicationId: string, body?: Application, options?: any) {
         return DefaultApiFp(this.configuration).updateApplication(portfolioId, applicationId, body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * Updates a CLIN. Not allowed on provisioned portfolios.
      * @param {string} portfolioId 
      * @param {string} taskOrderId ID of the TaskOrder
      * @param {string} clin Contract Line Item Number (CLIN)
      * @param {Clin} [body] Update an existing Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public updateClin(portfolioId: string, taskOrderId: string, clin: string, body?: Clin, options?: any) {
         return DefaultApiFp(this.configuration).updateClin(portfolioId, taskOrderId, clin, body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {string} portfolioId 
      * @param {string} applicationId ID of the Application
      * @param {string} environmentId ID of the Environment
      * @param {Environment} [body] Update an existing Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public updateEnvironment(portfolioId: string, applicationId: string, environmentId: string, body?: Environment, options?: any) {
         return DefaultApiFp(this.configuration).updateEnvironment(portfolioId, applicationId, environmentId, body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {string} portfolioId 
      * @param {Portfolio} [body] Update an existing Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public updatePortfolio(portfolioId: string, body?: Portfolio, options?: any) {
         return DefaultApiFp(this.configuration).updatePortfolio(portfolioId, body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {string} portfolioId 
      * @param {string} taskOrderId ID of the TaskOrder
      * @param {TaskOrder} [body] Update an existing Portfolio
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof DefaultApi
      */
     public updateTaskOrder(portfolioId: string, taskOrderId: string, body?: TaskOrder, options?: any) {
         return DefaultApiFp(this.configuration).updateTaskOrder(portfolioId, taskOrderId, body, options).then((request) => request(this.axios, this.basePath));
     }
 }
 