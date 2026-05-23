import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import UsernameEmail from '@/components/UsernameEmail'
import SettingsCategory from '@/components/SettingsCategory'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// ✅ Imports for logout
import { logoutUser } from '@/services/authService'
import { clearTokens } from '@/services/tokenStorage'
import { useUserStore } from '@/store/useUserStore'

const Settings = () => {
    const router = useRouter()
    const clearUser = useUserStore((state) => state.clearUser)
    const user = useUserStore((state) => state.user)

    // ✅ Loading state for logout button
    const [loggingOut, setLoggingOut] = useState(false)

    // ─── LOGOUT HANDLER ───────────────────────────────────────────────────────
    const handleLogout = async () => {

        // ✅ Confirm before logging out
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoggingOut(true)

                            // ✅ Call logout API
                            await logoutUser()
                            console.log('✅ Logged out successfully')

                        } catch (error: any) {
                            // ✅ Even if API fails, still clear local data
                            console.log('❌ Logout API error:', error.message)
                        } finally {
                            // ✅ Always clear tokens and user — no matter what
                            await clearTokens()
                            clearUser()
                            setLoggingOut(false)

                            // ✅ Navigate to login
                            router.replace('/auth/login')
                        }
                    }
                }
            ]
        )
    }

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity>
                        {/* <Ionicons name='chevron-back-outline' size={24} color='dodgerblue' /> */}
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Profile Image */}
                <View style={styles.profileImg}>
                    <Image
                        source={require('@/assets/images/Man Potrait Image.jpg')}
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 100,
                        }}
                    />
                </View>

                {/* ✅ Username & Email from global store */}
                <UsernameEmail
                    username={user?.username || 'mikee'}
                    email={user?.email || 'mndubuisi1000@gmail.com'}
                />

                <SettingsCategory
                    category='Personal Details'
                    icon='person-outline'
                    name1='Personal Information'
                    name2='Language Preference'
                />

                <SettingsCategory
                    category='General Settings'
                    icon='settings-outline'
                    name1='Languages'
                    name2='Text size'
                />

                <SettingsCategory
                    category='Help & Support'
                    icon='chatbubble-ellipses-outline'
                    name1='Contact Support'
                    name2='FAQs'
                />

                {/* ✅ Logout Button */}
                <TouchableOpacity
                    style={styles.btnLogout}
                    onPress={handleLogout}
                    disabled={loggingOut}   // ✅ disabled while logging out
                    activeOpacity={0.7}
                >
                    {loggingOut ? (
                        // ✅ Shows spinner while logout API call is running
                        <ActivityIndicator color='tomato' size='small' />
                    ) : (
                        <>
                            <Text style={styles.logoutText}>Log Out</Text>
                            <Ionicons name='log-out-outline' size={24} color={'#e68383'} />
                        </>
                    )}
                </TouchableOpacity>

            </SafeAreaView>
        </ScrollView>
    )
}

export default Settings

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e1e1e',
    },
    profileImg: {
        width: 72,
        height: 72,
        shadowColor: '#030c25',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
        borderRadius: 100,
    },
    container: {
        padding: 16,
        flex: 1,
    },
    btnLogout: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        padding: 16,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#ffcccc',
        backgroundColor: '#fff5f5',
    },
    logoutText: {
        color: 'tomato',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
})