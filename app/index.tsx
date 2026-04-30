import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import {ionicons} from '@expo/vector-icons'



const Index = () => {
    return (
        <View style={{ backgroundColor: '#ffffff',  flex: 1  }}>
            <SafeAreaView style={{ padding: 16,}}>

                <Image
                    source={require('../assets/images/blog2.jpg')}
                    style={{ width: '100%', height: 350, borderRadius: 10, }}
                />

                <Text style={styles.header}>Your Voice Deserves to Be Heard</Text>

                <Text style={styles.body}>Write, publish, and reach readers who care about what you have to say</Text>



                {/* Button */}

                <TouchableOpacity 
                style={styles.btn}
                onPress={()=>router.push('/auth/signup')}
                >
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#f9f9f9' }}>Continue to Sign Up</Text>
                </TouchableOpacity>

                <Text style={{textAlign: 'center', color: 'grey', fontSize: 16, fontWeight: 400, marginTop: 16,}}>Already have an account?

                    <Text style={{ textDecorationLine: 'underline', color: 'dodgerblue', fontSize: 16, fontWeight: 600, }}> Log In</Text>
                </Text>


            </SafeAreaView>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        fontWeight: 700,
        color: '#065291',
        marginTop:40,
        textAlign: 'center'
    },

    body: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 400,
        color: '#5a5b5c',
        marginTop:16,
        textAlign: 'center'
    },

    btn: {
        width: '100%',
        padding: 16,

        backgroundColor: 'dodgerblue',
        marginTop: 44,
        borderRadius: 8,
    }
})