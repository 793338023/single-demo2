import makeWebAPI from "../makeWebAPI";

export type Req = any;
export type Resp = any;

export default makeWebAPI<Req, Resp>("system/v1/qryInfo");
