import { apiConfig, buildApiUrl } from './config';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiClientOptions {
    method?: RequestMethod
    body?: unknown
    headers?: HeadersInit
    timeout?: number
}

export async function apiClient<TResponse>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<TResponse> {
    const { method = 'GET', body, headers, timeout = apiConfig.timeout } = options

    // Build the full URL using the config
    const url = buildApiUrl(endpoint);

    let finalHeaders: HeadersInit = { ...(headers || {}) }
    let finalBody: BodyInit | undefined

    if (body instanceof FormData) {
        finalBody = body
    } else if (body) {
        finalBody = JSON.stringify(body)
        finalHeaders['Content-Type'] = 'application/json'
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
    const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: finalBody,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

    if (!res.ok) {
        const errorText = await res.text()
            throw new Error(`API Error ${res.status}: ${errorText}`)
    }

    return res.json() as Promise<TResponse>
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            throw error;
        }
        
        throw new Error('An unexpected error occurred');
    }
}

// Convenience methods for common HTTP operations
export const apiGet = <T>(endpoint: string, options?: Omit<ApiClientOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T>(endpoint: string, body?: unknown, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body });

export const apiPut = <T>(endpoint: string, body?: unknown, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body });

export const apiDelete = <T>(endpoint: string, options?: Omit<ApiClientOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' });
