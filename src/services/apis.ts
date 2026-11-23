// src/services/apis.ts
import { api, RequestOptions } from "./genericService";
import { supplier } from "./endpoints";

type Params = RequestOptions["params"];
type Id = string | number;

/* ---------------- Suppliers ---------------- */
export const getSuppliersApi = (tranId: Id, params?: Params, signal?: AbortSignal) =>
  api.get(supplier.replace("{tranId}", String(tranId)), { params, signal });