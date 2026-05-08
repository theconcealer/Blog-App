import { StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import React, { useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

const Otp = () => {
    const router = useRouter()

    const [otp, setOtp] = useState(['', '', '', ''])
    const inputRefs = useRef<(TextInput | null)[]>([null, null, null, null])

    const handleChange = (text: string, index: number) => {
        const digit = text.replace(/[^0-9]/g, '').slice(-1)

        const newOtp = [...otp]
        newOtp[index] = digit
        setOtp(newOtp)

        // Jump to next input
        if (digit && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }

        
        if (digit && index === 3) {
            Keyboard.dismiss()
        }
    }

    const handleKeyPress = (e: any, index: number) => {
        // Jump back to previous input on backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    return (
        <SafeAreaView style={{ padding: 16 }}>

            {/* Return Nav */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
            >
                <Ionicons name='chevron-back-outline' size={20} color='dodgerblue' />
                <Text style={styles.returnNav}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Email Verification</Text>

            <Text style={styles.body}>
                We've just sent a 4-digit code to{' '}
                <Text style={{ fontWeight: '500' }}>mndubuisi1000@gmail.com</Text>,
                please enter the code below
            </Text>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <View
                        key={index}
                        style={[
                            styles.otpInput,
                            { borderColor: digit ? 'dodgerblue' : '#b2b3b4' }
                        ]}
                    >
                        <TextInput
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={{
                                flex: 1,
                                fontSize: 28,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                color: '#1e1e1e',
                            }}
                            keyboardType='number-pad'
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                    </View>
                ))}
            </View>

            <Text style={{ marginTop: 24, color: '#6a6a6a', textAlign: 'right' }}>
                00:59s
            </Text>

            {/* Verify Button */}
            <TouchableOpacity
                style={styles.btn}
                onPress={() => router.push('/home')}
            >
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#f9f9f9' }}>
                    Verify Email
                </Text>
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', color: 'grey', fontSize: 16, marginTop: 16, lineHeight: 24 }}>
                Didn't receive code?{' '}
                <Text
                    onPress={() => router.push('/')}
                    style={{ textDecorationLine: 'underline', color: 'dodgerblue', fontWeight: '600' }}
                >
                    Resend Code
                </Text>
            </Text>

        </SafeAreaView>
    )
}

export default Otp

const styles = StyleSheet.create({
    returnNav: {
        color: 'dodgerblue',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
    header: {
        marginTop: 90,
        fontSize: 28,
        fontWeight: '700',
        color: '#1e1e1e'
    },
    body: {
        marginTop: 28,
        fontSize: 16,
        fontWeight: '400',
        color: '#6e6e6e',
        lineHeight: 24,
    },
    otpContainer: {
        marginTop: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    otpInput: {
        borderWidth: 2,
        borderColor: '#b2b3b4',
        width: 64,
        height: 64,
        borderRadius: 8,
    },
    btn: {
        width: '100%',
        padding: 16,
        backgroundColor: 'dodgerblue',
        marginTop: 44,
        borderRadius: 8,
    },
})