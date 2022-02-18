import axios, { AxiosInstance } from "axios";

declare global {
  interface Window {
    servicenowUserToken: string;
  }
}


function configureDefaults(){

  // define ServiceNow authentication schema for REST calls
// set up axios defaults
if (process.env.NODE_ENV === "development") {
  // use username and password defined in a config file
  // for local development
  const username = process.env.VUE_APP_USER;
  const password = process.env.VUE_APP_PASSWORD;
  axios.defaults.auth = {
    username,
    password,
  };
} else {
  if (axios.defaults?.headers && axios.defaults.headers.common) {
    axios.defaults.headers.common["x-auth-token"] = window.servicenowUserToken;
  }
}
axios.defaults.headers.put["Content-Type"] = "application/json";
}

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;
// const BASE_API_URL = 'https://dev117675.service-now.com/api';

export default class {
  protected instance: AxiosInstance;

  constructor() {

    configureDefaults();

    console.log(BASE_API_URL);

    this.instance = axios.create({
      baseURL: BASE_API_URL,
    });
  }
}
