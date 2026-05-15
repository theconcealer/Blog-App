import { StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { registerUser } from '@/services/authService'
import { saveTokens } from '@/services/tokenStorage'

// ✅ Global state import
import { useUserStore } from '@/store/useUserStore'

const Signup = () => {
  const router = useRouter()

  // ✅ Get setUser from global store
  const setUser = useUserStore((state) => state.setUser)

  // Form state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  const handleSignup = async () => {

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    try {
      setLoading(true)

      // Call the API
      const response = await registerUser(username, email, password)

      // Save tokens to storage
      await saveTokens(response.accessToken, response.refreshToken)

      // ✅ Save user to global store — now available everywhere in the app
      setUser(response.user)

      // Navigate to login after signup
      router.replace('/auth/login')

    } catch (error: any) {
      Alert.alert('Signup Failed', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={styles.header}>Let's Create an Account To{'\n'}Get you started!</Text>

          {/* Username */}
          <Text style={styles.label}>Enter Username</Text>
          <View style={[
            styles.input,
            { borderColor: focusedInput === 'username' ? 'dodgerblue' : '#adaeb0' }
          ]}>
            <Ionicons name="person-outline" size={20} color="#7a7a7a" />
            <TextInput
              style={{
                flex: 1,
                padding: 0,                          //removes Android's extra padding
                includeFontPadding: false,
              }}
              placeholder='e.g TheConcealer'
              placeholderTextColor='grey'
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Enter Email</Text>
          <View style={[
            styles.input,
            { borderColor: focusedInput === 'email' ? 'dodgerblue' : '#adaeb0' }
          ]}>
            <Ionicons name="mail-outline" size={20} color="#7a7a7a" />
            <TextInput
              style={{
                flex: 1,
                padding: 0,                          //removes Android's extra padding
                includeFontPadding: false,
              }}
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
              style={{
                flex: 1,
                padding: 0,                          //removes Android's extra padding
                includeFontPadding: false,
              }}
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

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[
            styles.input1,
            { borderColor: focusedInput === 'confirmPassword' ? 'dodgerblue' : '#adaeb0' }
          ]}>
            <TextInput
              style={{
                flex: 1,
                padding: 0,                          //removes Android's extra padding
                includeFontPadding: false,
              }}
              placeholder='e.g ********'
              placeholderTextColor='grey'
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#7a7a7a"
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.btn, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color='#fff' />
              : <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#f9f9f9' }}>
                Sign Up
              </Text>
            }
          </TouchableOpacity>

          <Text style={{ textAlign: 'center', color: 'grey', fontSize: 16, marginTop: 16 }}>
            Already have an account?{' '}
            <Text
              onPress={() => router.push('/auth/login')}
              style={{ textDecorationLine: 'underline', color: 'dodgerblue', fontWeight: '600' }}
            >
              Log In
            </Text>
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Signup

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    lineHeight: 36,
    color: '#1e1e1e'
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