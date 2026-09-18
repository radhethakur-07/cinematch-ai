const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      const directToken = localStorage.getItem("cinematch_auth_token");
      if (directToken) return directToken;
      try {
        const storeStr = localStorage.getItem("cinematch_auth_store");
        if (storeStr) {
          const parsed = JSON.parse(storeStr);
          if (parsed?.state?.token) return parsed.state.token;
        }
      } catch {}
    }
    return null;
  }

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options;

    let url = `${this.baseUrl}/api/v1${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const queryStr = searchParams.toString();
      if (queryStr) {
        url += `?${queryStr}`;
      }
    }

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, {
        headers: requestHeaders,
        ...restOptions,
      });

      if (!res.ok) {
        let errorData: any = {};
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: res.statusText };
        }

        const errorMessage =
          errorData?.error?.message ||
          errorData?.message ||
          errorData?.detail ||
          `API Error: ${res.status} ${res.statusText}`;

        throw new Error(errorMessage);
      }

      // Handle 204 No Content
      if (res.status === 204) {
        return null as unknown as T;
      }

      return await res.json();
    } catch (err: any) {
      console.error(`[API Client Error] [${options.method || "GET"}] ${url}:`, err);
      throw err;
    }
  }

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  post<T>(endpoint: string, body?: any, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      params,
    });
  }

  put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(BASE_URL);
