// utils/apiClient.ts

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiClientOptions {
    method?: RequestMethod
    body?: unknown
    headers?: HeadersInit
}

export async function apiClient<TResponse>(
    url: string,
    options: ApiClientOptions = {}
): Promise<TResponse> {
    const { method = 'GET', body, headers } = options

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error ${res.status}: ${errorText}`)
    }

    return res.json() as Promise<TResponse>
}
