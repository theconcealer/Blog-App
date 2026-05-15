import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'




const createPost = () => {

const router = useRouter()
    
    return (
        <SafeAreaView style={{
            padding: 16,
            flex: 1
        }}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=> router.back()}>
                    <Ionicons name='chevron-back-outline' size={24} color='dodgerblue' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create a Post</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Description */}
            <Text style={{
                marginTop: 16,
                fontSize: 16,
                color: '#706f75',
                lineHeight: 24,
            }}>Write and publish a post for others to discover and engage with.</Text>



            {/* Title */}
            <Text style={styles.label}>Enter Title</Text>
            <View style={[
                styles.input1,
                // { borderColor: focusedInput === 'password' ? 'dodgerblue' : '#adaeb0' }
            ]}>
                <TextInput
                    style={{
                        flex: 1,
                        padding: 0,                          //removes Android's extra padding
                        includeFontPadding: false,
                    }}
                    placeholder="e.g What's the title of your post?"
                    placeholderTextColor='grey'
                />
            </View>

            {/* Body */}
            <Text style={styles.label}>Enter Post Content</Text>
            <View style={[
                styles.input2,
                // { borderColor: focusedInput === 'password' ? 'dodgerblue' : '#adaeb0' }
            ]}>
                <TextInput
                    style={{
                        flex: 1,
                        padding: 0,                          //removes Android's extra padding
                        includeFontPadding: false,
                        
                    }}
                    placeholder="e.g Start typing your post here"
                    placeholderTextColor='grey'
                    multiline={true}
                />
            </View>


            {/* Create Post Button */}
            <TouchableOpacity
                style={{
                    width: '100%',
                    padding: 16,
                    backgroundColor: 'dodgerblue',
                    marginTop: 44,
                    borderRadius: 8,
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        color: '#f9f9f9',
                        fontSize: 16,
                        lineHeight: 24,
                        fontWeight: 600,
                    }}
                >Create Post</Text>
            </TouchableOpacity>






        </SafeAreaView>
    )
}

export default createPost

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e1e1e',
    },
    label: {
        marginTop: 28,
        fontSize: 16,
        lineHeight: 21,
        color: '#1e1e1e',
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

    input2: {
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 60,
        borderRadius: 8,
        marginTop: 8,
        borderColor: '#adaeb0',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
})