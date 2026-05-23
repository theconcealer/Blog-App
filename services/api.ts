// services/api.ts

import { getAccessToken, clearTokens, saveTokens, getRefreshToken } from './tokenStorage'

const BASE_URL = 'https://blog-api-ten-eosin.vercel.app'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
    method: Method
    body?: Record<string, any>
    requiresAuth?: boolean
}

// ✅ Separate function to attempt token refresh
const attemptTokenRefresh = async (): Promise<string | null> => {
    try {
        const refreshToken = await getRefreshToken()
        if (!refreshToken) return null

        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        })

        const data = await response.json()

        if (!response.ok) return null

        // ✅ Save new tokens
        await saveTokens(data.accessToken, data.refreshToken)
        return data.accessToken

    } catch {
        return null
    }
}

export const apiRequest = async <T>(
    endpoint: string,
    options: RequestOptions,
    isRetry = false       // ✅ prevents infinite retry loop
): Promise<T> => {

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (options.requiresAuth) {
        const token = await getAccessToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
    }

    const config: RequestInit = {
        method: options.method,
        headers,
    }

    if (options.body) {
        config.body = JSON.stringify(options.body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    const data = await response.json()

    // ✅ If token expired — try to refresh once and retry the request
    if (response.status === 401 && !isRetry) {
        console.log('🔄 Token expired — attempting refresh...')

        const newToken = await attemptTokenRefresh()

        if (newToken) {
            console.log('✅ Token refreshed — retrying request...')
            // ✅ Retry the original request with the new token
            return apiRequest<T>(endpoint, options, true)
        } else {
            // ✅ Refresh failed — clear tokens and throw
            await clearTokens()
            throw new Error('Session expired. Please log in again.')
        }
    }

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
    }

    return data
}