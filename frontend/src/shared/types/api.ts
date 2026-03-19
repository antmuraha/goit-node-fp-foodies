export type QueryValue = string | number | boolean | null | undefined;

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type RequestConfig<TBody = unknown> = {
  query?: Record<string, QueryValue>;
  body?: TBody | FormData;
  headers?: Record<string, string>;
};

export type ApiError = {
  message: string;
  status: number;
  details?: unknown;
};

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";
