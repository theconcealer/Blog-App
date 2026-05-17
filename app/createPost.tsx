// app/createPost.tsx

import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// ✅ Import the createPost service
import { createPost } from '@/services/postService'

const CreatePost = () => {
    const router = useRouter()

    // ✅ Form state
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [focusedInput, setFocusedInput] = useState<string | null>(null)

    const handleCreatePost = async () => {

        // ✅ Basic validation
        if (!title || !content) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        try {
            setLoading(true)

            // ✅ Call the API
            const response = await createPost(title, content)

            console.log('✅ Post created:', response)

            Alert.alert('Success', 'Post created successfully!', [
                {
                    text: 'OK',
                    // ✅ Navigate back to home after post is created
                    onPress: () => router.replace('/(tabs)/home')
                }
            ])

        } catch (error: any) {
            // ✅ Handle specific error types
            if (error.message.includes('token') || error.message.includes('expired')) {
                Alert.alert('Session Expired', 'Please log in again', [
                    { text: 'OK', onPress: () => router.replace('/auth/login') }
                ])
            } else if (error.message.includes('image too large')) {
                Alert.alert('Error', 'Image is too large. Please use a smaller image.')
            } else {
                Alert.alert('Error', error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={{ padding: 16, flex: 1 }}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='chevron-back-outline' size={24} color='dodgerblue' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create a Post</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Description */}
            <Text style={styles.description}>
                Write and publish a post for others to discover and engage with.
            </Text>

            {/* Title */}
            <Text style={styles.label}>Enter Title</Text>
            <View style={[
                styles.input1,
                { borderColor: focusedInput === 'title' ? 'dodgerblue' : '#adaeb0' }
            ]}>
                <TextInput
                    style={{
                        flex: 1,
                        padding: 0,
                        includeFontPadding: false,
                    }}
                    placeholder="e.g What's the title of your post?"
                    placeholderTextColor='grey'
                    value={title}
                    onChangeText={setTitle}
                    onFocus={() => setFocusedInput('title')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>

            {/* Body */}
            <Text style={styles.label}>Enter Post Content</Text>
            <View style={[
                styles.input2,
                { borderColor: focusedInput === 'content' ? 'dodgerblue' : '#adaeb0' }
            ]}>
                <TextInput
                    style={{
                        flex: 1,
                        padding: 0,
                        includeFontPadding: false,
                        textAlignVertical: 'top',   // ✅ text starts from top on Android
                    }}
                    placeholder="e.g Start typing your post here"
                    placeholderTextColor='grey'
                    multiline={true}
                    value={content}
                    onChangeText={setContent}
                    onFocus={() => setFocusedInput('content')}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>

            {/* Create Post Button */}
            <TouchableOpacity
                style={[styles.btn, { opacity: loading ? 0.7 : 1 }]}
                onPress={handleCreatePost}
                disabled={loading}
            >
                {/* ✅ Shows spinner while API call is running */}
                {loading
                    ? <ActivityIndicator color='#fff' />
                    : <Text style={styles.btnText}>Create Post</Text>
                }
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default CreatePost

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
    description: {
        marginTop: 16,
        fontSize: 16,
        color: '#706f75',
        lineHeight: 24,
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
        flexDirection: 'row',
        alignItems: 'flex-start',   // ✅ aligns text to top for multiline
    },
    btn: {
        width: '100%',
        padding: 16,
        backgroundColor: 'dodgerblue',
        marginTop: 44,
        borderRadius: 8,
    },
    btnText: {
        textAlign: 'center',
        color: '#f9f9f9',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
})