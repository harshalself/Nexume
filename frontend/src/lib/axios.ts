import axios from "axios";
import appConfig from "../config/appConfig";

const axiosInstance = axios.create({
  baseURL: appConfig.API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
