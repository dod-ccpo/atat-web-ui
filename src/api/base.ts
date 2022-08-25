import axios, { AxiosInstance } from "axios";

declare global {
  interface Window {
    sessionToken: string;
  }
}


function configureDefaults(){

  // define ServiceNow authentication schema for REST calls
  // set up axios defaults
  if (process.env.NODE_ENV === "development") {
  // use username and password defined in .env file
  // for local development
    const username = process.env.VUE_APP_SNOWUSER || "";
    const password = process.env.VUE_APP_SNOWPASS || "";

    axios.defaults.auth = {
      username,
      password,
    };
    if(axios.defaults?.headers && axios.defaults.headers.common){
      axios.defaults.headers.common['Access-Control-Allow-Methods'] = '*';
    }
  } else {
    if (axios.defaults?.headers && axios.defaults.headers.common) {
      axios.defaults.headers.common['X-UserToken'] = window.sessionToken;
    }
  }
  axios.defaults.headers.put["Content-Type"] = "application/json";
}

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default class {
  protected instance: AxiosInstance;

  constructor() {

    configureDefaults();

    this.instance = axios.create({
      baseURL: BASE_API_URL,
    });
  }
}

