import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { loginUser } from '@/services/authService'
import { saveTokens } from '@/services/tokenStorage'

// ✅ Global state import
import { useUserStore } from '@/store/useUserStore'

const Login = () => {
    const router = useRouter()

    // ✅ Get setUser from global store
    const setUser = useUserStore((state) => state.setUser)

    // Form state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [focusedInput, setFocusedInput] = useState<string | null>(null)

    const handleLogin = async () => {

        // Basic validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        try {
            setLoading(true)

            // Call the API
            const response = await loginUser(email, password)

            // Save tokens to storage
            await saveTokens(response.accessToken, response.refreshToken)

            // ✅ Save user to global store — now available everywhere in the app
            setUser(response.user)

            // Navigate to home after successful login
            router.replace('/(tabs)/home')

        } catch (error: any) {
            Alert.alert('Login Failed', error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={{ padding: 16, flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Return Nav */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
                    >
                        <Ionicons name='chevron-back-outline' size={20} color='dodgerblue' />
                        <Text style={styles.returnNav}>Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.header}>Log In</Text>

                    <Text style={styles.body}>
                        Welcome back! Let's get creative today
                    </Text>

                    {/* Email */}
                    <Text style={styles.label}>Enter Email</Text>
                    <View style={[
                        styles.input,
                        { borderColor: focusedInput === 'email' ? 'dodgerblue' : '#adaeb0' }
                    ]}>
                        <Ionicons name="mail-outline" size={20} color="#7a7a7a" />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder='e.g hellomike@email.com'
                            placeholderTextColor='grey'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)}
                        />
                    </View>

                    {/* Password */}
                    <Text style={styles.label}>Enter Password</Text>
                    <View style={[
                        styles.input1,
                        { borderColor: focusedInput === 'password' ? 'dodgerblue' : '#adaeb0' }
                    ]}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder='e.g ********'
                            placeholderTextColor='grey'
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setFocusedInput('password')}
                            onBlur={() => setFocusedInput(null)}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#7a7a7a"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Log In Button */}
                    <TouchableOpacity
                        style={[styles.btn, { opacity: loading ? 0.7 : 1 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color='#fff' />
                            : <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#f9f9f9' }}>
                                Log In
                            </Text>
                        }
                    </TouchableOpacity>

                    <Text style={{ textAlign: 'center', color: 'grey', fontSize: 16, marginTop: 16 }}>
                        Don't have an account?{' '}
                        <Text
                            onPress={() => router.push('/auth/signup')}
                            style={{ textDecorationLine: 'underline', color: 'dodgerblue', fontWeight: '600' }}
                        >
                            Sign Up
                        </Text>
                    </Text>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    returnNav: {
        color: 'dodgerblue',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
    header: {
        color: '#1e1e1e',
        fontSize: 28,
        lineHeight: 24,
        fontWeight: '700',
        marginTop: 80,
    },
    body: {
        color: '#88898b',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        marginTop: 20,
    },
    label: {
        marginTop: 28,
        fontSize: 16,
        lineHeight: 21,
        color: '#1e1e1e',
    },
    input: {
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
        borderColor: '#adaeb0',
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input1: {
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
        borderColor: '#adaeb0',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        width: '100%',
        padding: 16,
        backgroundColor: 'dodgerblue',
        marginTop: 44,
        borderRadius: 8,
    },
})