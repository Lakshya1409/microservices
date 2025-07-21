import { StatusCodes } from "http-status-codes";

export const HTTP_STATUS = {
  OK: StatusCodes.OK,
  CREATED: StatusCodes.CREATED,
  NO_CONTENT: StatusCodes.NO_CONTENT,
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,
  FORBIDDEN: StatusCodes.FORBIDDEN,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  CONFLICT: StatusCodes.CONFLICT,
  TOO_MANY_REQUESTS: StatusCodes.TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE: StatusCodes.SERVICE_UNAVAILABLE,
} as const;

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

export const HTTP_HEADERS = {
  AUTHORIZATION: "Authorization",
  CONTENT_TYPE: "Content-Type",
  USER_AGENT: "User-Agent",
  X_REQUESTED_WITH: "X-Requested-With",
  X_API_KEY: "X-API-Key",
} as const;

export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  MULTIPART_FORM_DATA: "multipart/form-data",
  TEXT_PLAIN: "text/plain",
} as const;
