// services/authService.ts

import { apiRequest } from './api'
import { getRefreshToken, saveTokens, clearTokens } from './tokenStorage'

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface AuthResponse {
    message: string
    accessToken: string
    refreshToken: string
    user: {
        id: string
        username: string
        email: string
        profilePicUrl: string
    }
}

export interface LogoutResponse {
    message: string
}

export interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
}

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
export const registerUser = async (
    username: string,
    email: string,
    password: string
): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: { username, email, password },
        requiresAuth: false,
    })
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const loginUser = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        requiresAuth: false,
    })
}

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
export const logoutUser = async (): Promise<LogoutResponse> => {

    // ✅ Get refresh token from storage to send in request body
    const refreshToken = await getRefreshToken()

    if (!refreshToken) {
        throw new Error('No refresh token found')
    }

    return apiRequest<LogoutResponse>('/api/auth/logout', {
        method: 'POST',
        body: { refreshToken },
        requiresAuth: true,     // ✅ protected — needs access token too
    })
}

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {

    // ✅ Get refresh token from storage
    const refreshToken = await getRefreshToken()

    if (!refreshToken) {
        throw new Error('No refresh token found')
    }

    const response = await apiRequest<RefreshTokenResponse>('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
        requiresAuth: false,    // ✅ not protected — this IS the token rotation endpoint
    })

    // ✅ Save new tokens automatically after rotation
    await saveTokens(response.accessToken, response.refreshToken)

    return response
}