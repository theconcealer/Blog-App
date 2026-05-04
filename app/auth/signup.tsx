import { StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {Ionicons} from '@expo/vector-icons'



const [isFocused, setIsFocused] = useState(false)

const Signup = () => {
  const router = useRouter()

  const [isFocused, setIsFocused] = useState(false)

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={styles.header}>Let's Create an Account To{'\n'}Get you started !</Text>

          {/* Username */}
          <Text style={styles.label}>Enter Username</Text>
          <View style={[
            styles.input,
            { borderColor: isFocused ? 'dodgerblue' : '#adaeb0' }
          ]}>
            <TextInput placeholder='e.g TheConcealer' placeholderTextColor={'grey'}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Enter Email</Text>
          <View style={styles.input}>
            <Ionicons name="mail-outline" size={20} color="#7a7a7a" />
            <TextInput placeholder='e.g hellomike@email.com' placeholderTextColor={'grey'} />
          </View>

          {/* Password */}
          <Text style={styles.label}>Enter Password</Text>
          <View style={styles.input1}>
            <TextInput placeholder='e.g ********' placeholderTextColor={'grey'} secureTextEntry />
            <TouchableOpacity>
              <Ionicons name="eye-off-outline" size={20} color="#7a7a7a" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.input1}>
            <TextInput placeholder='e.g ********' placeholderTextColor={'grey'} secureTextEntry />
            <TouchableOpacity>
              <Ionicons name="eye-off-outline" size={20} color="#7a7a7a" />
            </TouchableOpacity>
  
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push('/home')}
          >
            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#f9f9f9' }}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <Text style={{ textAlign: 'center', color: 'grey', fontSize: 16, marginTop: 16 }}>
            Already have an account?
            <TouchableOpacity onPress={()=> router.push('/auth/login')}>
              <Text style={{ textDecorationLine: 'underline', color: 'dodgerblue', fontWeight: '600' }}> Log In</Text>
            </TouchableOpacity>
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
    flexDirection:'row'
  },

  input1: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    borderColor: '#adaeb0',
    justifyContent: 'space-between',
    flexDirection:'row'
  },

  btn: {
    width: '100%',
    padding: 16,
    backgroundColor: 'dodgerblue',
    marginTop: 44,
    borderRadius: 8,
  },
})