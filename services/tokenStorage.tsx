// services/tokenStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

// ✅ Save tokens
export const saveTokens = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem('accessToken', accessToken)
    await AsyncStorage.setItem('refreshToken', refreshToken)
}

// ✅ Get access token
export const getAccessToken = async () => {
    return await AsyncStorage.getItem('accessToken')
}

// ✅ Clear tokens on logout
export const clearTokens = async () => {
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('refreshToken')
}