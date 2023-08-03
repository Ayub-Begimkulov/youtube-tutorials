interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, any>;
  params?: Record<string, string | number>;
}

const baseURL = "https://jsonplaceholder.typicode.com";

export function request<Data = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<Data> {
  const { method = "GET", headers, params, ...rest } = options;

  const normalizedParams = params
    ? // in reality the browser will convert numbers to strings
      // so we can safely pass `Record<string, string | number>`
      // to the `URLSearchParams` constructor
      new URLSearchParams(params as Record<string, string>).toString()
    : undefined;

  const queryString = normalizedParams ? `?${normalizedParams}` : "";

  return fetch(`${baseURL}${url}${queryString}`, {
    ...rest,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());
}
