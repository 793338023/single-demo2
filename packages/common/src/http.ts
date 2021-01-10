import axios, { AxiosResponse } from "axios";
import { Modal } from "antd";
// import history from "./history";

const RESPONSE_SUCCESS_CODE = "1";
const UNKNOW_ERROR = "未知错误";

const BASEURL = "portal";

let store_token: string | null = null;

// 创建axios实例
const instance = axios.create({
  baseURL: BASEURL,
  timeout: 1000 * 12
});

// 设置post请求头
instance.defaults.headers.post["Content-Type"] =
  "application/json;charset=utf-8";

// 拦截器
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token;
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码;
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    store_token && (config.headers.token = store_token);
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    return Promise.resolve(res);
  },
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      //   errorHandle(response.status, response.data.message);
      if (/^5\d{2}$/.test(response.status)) {
        error.message = "服务器内部出错";
      } else {
        error.message = "接口请求出错，请稍后再试";
      }
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
    }
    return Promise.reject(error);
  }
);

interface THeader {
  code: string;
  message: string;
}

export interface Response<P> extends THeader {
  body: P;
  [key: string]: any;
}

export function validationRespCode(
  res: THeader & {
    isGobalModal: boolean;
  }
) {
  if (res.code !== RESPONSE_SUCCESS_CODE) {
    const errMsg = res.message || "请求失败!";
    res.isGobalModal && handleRespErr({ message: errMsg });
    return errMsg;
  }
}

export function handleRespErr(e: any) {
  Modal.error({
    title: typeof e === "string" ? e : e.message ? e.message : UNKNOW_ERROR,
    content: "",
    okText: "确定",
    centered: true
  });
}

export interface AxiosRespWithWebAPI<T> extends AxiosResponse<Response<T>> {}

export default instance;
