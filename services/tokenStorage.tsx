// services/tokenStorage.ts

import AsyncStorage from '@react-native-async-storage/async-storage'

// ✅ Save tokens after login/signup
export const saveTokens = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem('accessToken', accessToken)
    await AsyncStorage.setItem('refreshToken', refreshToken)
}

// ✅ Get access token — used by api.ts for protected routes
export const getAccessToken = async () => {
    return await AsyncStorage.getItem('accessToken')
}

// ✅ Get refresh token — used by logout and refresh endpoints
export const getRefreshToken = async () => {
    return await AsyncStorage.getItem('refreshToken')
}

// ✅ Clear all tokens on logout
export const clearTokens = async () => {
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('refreshToken')
}

// ✅ Mark onboarding as completed
export const setOnboardingCompleted = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true')
}

// ✅ Check if onboarding is completed
export const getOnboardingCompleted = async () => {
    return await AsyncStorage.getItem('onboardingCompleted')
}