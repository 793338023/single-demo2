import { AxiosResponse } from "axios";
import axios, { validationRespCode, Response } from "./http";

function makeWebAPI<ReqParams, Resp>(url: string) {
  return function webAPI(
    reqParams?: ReqParams,
    isGobalModal: boolean = true
  ): Promise<AxiosResponse<Response<Resp>>> {
    return new Promise(async (res, rej) => {
      try {
        const resp = await axios.post<Response<Resp>>(url, reqParams);
        const isFail = validationRespCode({
          code: resp.data.code,
          message: resp.data.message,
          isGobalModal
        });
        if (isFail) {
          rej({ message: isFail, code: resp.data.code });
        } else {
          res(resp);
        }
      } catch (err) {
        rej({ message: err.toString() });
      }
    });
  };
}

export default makeWebAPI;
