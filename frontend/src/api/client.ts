import type { ApiError, HttpMethod, QueryValue, RequestConfig } from "../shared/types/api";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const buildQueryString = (params?: Record<string, QueryValue>): string => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    searchParams.append(key, String(value));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const TOKEN_EXPIRED_CODE = "TOKEN_EXPIRED";

const normalizeError = async (response: Response): Promise<ApiError> => {
  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const body = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const messageFromBody = typeof body?.message === "string" ? body.message : null;
  const codeFromBody = typeof body?.code === "string" ? body.code : undefined;

  return {
    message: messageFromBody ?? `Request failed with status ${response.status}`,
    status: response.status,
    code: codeFromBody,
    details: data,
  };
};

const request = async <TResponse, TBody = unknown>(
  method: HttpMethod,
  path: string,
  config?: RequestConfig<TBody>,
): Promise<TResponse> => {
  const queryString = buildQueryString(config?.query);
  const url = `${API_URL}/api${path}${queryString}`;

  const headers = new Headers(config?.headers);
  const hasBody = config?.body !== undefined;
  const isFormDataBody = hasBody && config?.body instanceof FormData;

  if (hasBody && !isFormDataBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const requestBody: BodyInit | undefined = hasBody
    ? isFormDataBody
      ? (config?.body as FormData)
      : JSON.stringify(config?.body)
    : undefined;

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const error = await normalizeError(response);
    if (error.status === 401 && error.code === TOKEN_EXPIRED_CODE) {
      window.dispatchEvent(new CustomEvent("session:expired"));
    }
    throw error;
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
};

export const apiClient = {
  baseUrl: API_URL,
  get: <TResponse>(path: string, config?: RequestConfig) => request<TResponse>("GET", path, config),
  post: <TResponse, TBody = unknown>(path: string, config?: RequestConfig<TBody>) =>
    request<TResponse, TBody>("POST", path, config),
  patch: <TResponse, TBody = unknown>(path: string, config?: RequestConfig<TBody>) =>
    request<TResponse, TBody>("PATCH", path, config),
  put: <TResponse, TBody = unknown>(path: string, config?: RequestConfig<TBody>) =>
    request<TResponse, TBody>("PUT", path, config),
  delete: <TResponse>(path: string, config?: RequestConfig) => request<TResponse>("DELETE", path, config),
};
