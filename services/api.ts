// services/api.ts

import { getAccessToken } from './tokenStorage'

const BASE_URL = 'https://blog-api-ten-eosin.vercel.app'

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
    method: Method
    body?: Record<string, any>
    requiresAuth?: boolean      // set to true for protected routes
}

// ─── CORE REQUEST FUNCTION ───────────────────────────────────────────────────
export const apiRequest = async <T>(
    endpoint: string,
    options: RequestOptions
): Promise<T> => {

    // ✅ Build headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    // ✅ Attach token for protected routes
    if (options.requiresAuth) {
        const token = await getAccessToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
    }

    // ✅ Build the request
    const config: RequestInit = {
        method: options.method,
        headers,
    }

    // ✅ Attach body for POST/PUT/PATCH requests
    if (options.body) {
        config.body = JSON.stringify(options.body)
    }

    // ✅ Make the request
    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    const data = await response.json()

    // ✅ Throw error from API if request failed
    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
    }

    return data
}