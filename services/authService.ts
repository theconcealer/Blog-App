// services/authService.ts

import { apiRequest } from './api'

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

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
export const registerUser = async (
    username: string,
    email: string,
    password: string
): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: { username, email, password },
        requiresAuth: false,    // ✅ no token needed for signup
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
        requiresAuth: false,    // ✅ no token needed for login
    })
}