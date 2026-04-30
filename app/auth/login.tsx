import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons, } from '@expo/vector-icons'

const Login = () => {
    const router = useRouter()

    return (
        <SafeAreaView style={{ padding: 16, }}>

            {/* Return to SignUp Nav */}
            <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Ionicons name='chevron-back-outline' size={20} color='dodgerblue' />
                <Text style={styles.returnNav}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Log In</Text>

            <Text style={styles.body}>Welcome back Username ! Let's get creative today</Text>


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

            {/* Sign Up Button */}
            <TouchableOpacity
                style={styles.btn}
                onPress={() => router.push('/home')}
            >
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#f9f9f9' }}>
                    Log In
                </Text>
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', color: 'grey', fontSize: 16, marginTop: 16 }}>
                Don't have an account?
                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                    <Text style={{ textDecorationLine: 'underline', color: 'dodgerblue', fontWeight: '600' }}> Sign Up</Text>
                </TouchableOpacity>
            </Text>



        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    returnNav: {
        color: 'dodgerblue',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 500,
    },

    header: {
        color: '#1e1e1e',
        fontSize: 28,
        lineHeight: 24,
        fontWeight: 700,
        marginTop: 80,
    },

    body: {
        color: '#88898b',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 400,
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
        flexDirection: 'row'
    },
    input1: {
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
        borderColor: '#adaeb0',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },


    btn: {
        width: '100%',
        padding: 16,
        backgroundColor: 'dodgerblue',
        marginTop: 44,
        borderRadius: 8,
    },
})