// app/createPost.tsx

import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { createPost, uploadImage, deleteImage } from '@/services/postService'

const CreatePost = () => {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [compressing, setCompressing] = useState(false)
    const [uploading, setUploading] = useState(false)   // ✅ tracks image upload state
    const [focusedInput, setFocusedInput] = useState<string | null>(null)

    const [imageUri, setImageUri] = useState<string | null>(null)       // ✅ local compressed URI
    const [imagePreview, setImagePreview] = useState<string | null>(null)  // ✅ for UI preview
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)  // ✅ URL from API
    const [uploadedImageKey, setUploadedImageKey] = useState<string | null>(null)  // ✅ key from API for delete

    // ─── COMPRESS IMAGE ───────────────────────────────────────────────────────
    const compressImage = async (uri: string): Promise<string> => {
        const manipulated = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1200 } }],
            {
                compress: 0.7,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        )
        return manipulated.uri      // ✅ return URI not base64
    }

    // ─── IMAGE PICKER ─────────────────────────────────────────────────────────
    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow access to your photo library.')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: false,
        })

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0]
            setImagePreview(asset.uri)  // ✅ show preview immediately

            try {
                // ✅ Step 1 — Compress
                setCompressing(true)
                const compressedUri = await compressImage(asset.uri)
                setImageUri(compressedUri)
                setCompressing(false)

                // ✅ Step 2 — Upload to API immediately after compression
                setUploading(true)
                const uploadResponse = await uploadImage(compressedUri)

                // ✅ Save the URL and key from upload response
                setUploadedImageUrl(uploadResponse.url)
                setUploadedImageKey(uploadResponse.key)

                console.log('✅ Image uploaded:', uploadResponse.url)

            } catch (error: any) {
                Alert.alert('Error', error.message)
                setImagePreview(null)
                setImageUri(null)
            } finally {
                setCompressing(false)
                setUploading(false)
            }
        }
    }

    // ─── REMOVE IMAGE ─────────────────────────────────────────────────────────
    const handleRemoveImage = async () => {
        // ✅ Delete from API if already uploaded
        if (uploadedImageUrl && uploadedImageKey) {
            try {
                await deleteImage(uploadedImageUrl, uploadedImageKey)
                console.log('✅ Image deleted from storage')
            } catch (error: any) {
                console.log('❌ Failed to delete image:', error.message)
            }
        }

        // ✅ Clear all image state
        setImagePreview(null)
        setImageUri(null)
        setUploadedImageUrl(null)
        setUploadedImageKey(null)
    }

    // ─── CREATE POST ──────────────────────────────────────────────────────────
    const handleCreatePost = async () => {
        if (!title || !content) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        if (compressing || uploading) {
            Alert.alert('Please wait', 'Image is still being processed')
            return
        }

        try {
            setLoading(true)

            console.log('📤 Creating post with imageUrl:', uploadedImageUrl)

            // ✅ Step 3 — Create post with the uploaded image URL
            const response = await createPost(
                title,
                content,
                uploadedImageUrl ?? undefined    // ✅ pass the URL from upload response
            )

            console.log('✅ Post created:', response)

            Alert.alert('Success', 'Post created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/home') }
            ])

        } catch (error: any) {
            if (error.message.includes('token') || error.message.includes('expired')) {
                Alert.alert('Session Expired', 'Please log in again', [
                    { text: 'OK', onPress: () => router.replace('/auth/login') }
                ])
            } else {
                Alert.alert('Error', error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
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
                            style={{ flex: 1, padding: 0, includeFontPadding: false }}
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
                                textAlignVertical: 'top',
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

                    {/* Image Picker */}
                    {imagePreview ? (
                        <View style={styles.previewContainer}>
                            <Image
                                source={{ uri: imagePreview }}
                                style={styles.previewImage}
                                resizeMode='cover'
                            />

                            {/* ✅ Compression overlay */}
                            {compressing && (
                                <View style={styles.overlay}>
                                    <ActivityIndicator size='small' color='#ffffff' />
                                    <Text style={styles.overlayText}>Compressing...</Text>
                                </View>
                            )}

                            {/* ✅ Upload overlay */}
                            {uploading && (
                                <View style={styles.overlay}>
                                    <ActivityIndicator size='small' color='#ffffff' />
                                    <Text style={styles.overlayText}>Uploading...</Text>
                                </View>
                            )}

                            {/* ✅ Remove button — only shows when not processing */}
                            {!compressing && !uploading && (
                                <TouchableOpacity
                                    style={styles.removeImageBtn}
                                    onPress={handleRemoveImage}
                                >
                                    <Ionicons name='close-circle' size={28} color='tomato' />
                                </TouchableOpacity>
                            )}

                            {/* ✅ Upload success indicator */}
                            {!compressing && !uploading && uploadedImageUrl && (
                                <View style={styles.uploadSuccessBadge}>
                                    <Ionicons name='checkmark-circle' size={16} color='#ffffff' />
                                    <Text style={styles.uploadSuccessText}>Uploaded</Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handlePickImage}>
                            <View style={styles.uploadArea}>
                                <Ionicons name='cloud-upload-outline' size={32} color='#77797b' />
                                <Text style={styles.uploadText}>Add image</Text>
                                <Text style={styles.uploadSubText}>JPEG, PNG, WEBP or GIF — Max 10MB</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Create Post Button */}
                    <TouchableOpacity
                        style={[
                            styles.btn,
                            { opacity: loading || compressing || uploading ? 0.7 : 1 }
                        ]}
                        onPress={handleCreatePost}
                        disabled={loading || compressing || uploading}
                    >
                        {loading
                            ? <ActivityIndicator color='#fff' />
                            : <Text style={styles.btnText}>Create Post</Text>
                        }
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
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
        alignItems: 'flex-start',
    },
    uploadArea: {
        width: '100%',
        backgroundColor: '#d6dfe4',
        height: 100,
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#9da3aa',
        marginTop: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    uploadText: {
        color: '#717275',
        fontSize: 14,
        fontWeight: '500',
    },
    uploadSubText: {
        color: '#9da3aa',
        fontSize: 12,
    },
    previewContainer: {
        marginTop: 24,
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    overlayText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ffffff',
        borderRadius: 14,
    },

    // ✅ Upload success badge
    uploadSuccessBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'green',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    uploadSuccessText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '600',
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