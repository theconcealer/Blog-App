// app/modal.tsx

import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useUserStore } from '@/store/useUserStore'
import { updateProfilePic } from '@/services/authService'

// ✅ ProfileAvatar import
import ProfileAvatar from '@/components/profileAvatar'

const { height } = Dimensions.get('window')

const Modal = () => {
    const router = useRouter()
    const user = useUserStore((state) => state.user)
    const setUser = useUserStore((state) => state.setUser)
    const email = user?.email || ''

    const [uploadingPic, setUploadingPic] = useState(false)
    const [localPicUri, setLocalPicUri] = useState<string | null>(null)

    const compressImage = async (uri: string): Promise<string> => {
        const manipulated = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        )
        return manipulated.uri
    }

    const handlePickProfilePic = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow access to your photo library.')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: false,
        })

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0]
            try {
                setUploadingPic(true)
                setLocalPicUri(asset.uri)   // ✅ instant local preview

                const compressedUri = await compressImage(asset.uri)
                const response = await updateProfilePic(compressedUri)

                setUser(response.user)      // ✅ updates global store — reflects everywhere
                setLocalPicUri(null)        // ✅ clear local preview — use API URL now

                console.log('✅ Profile pic updated:', response.user.profilePicUrl)
                Alert.alert('Success', 'Profile picture updated successfully!')

            } catch (error: any) {
                setLocalPicUri(null)
                Alert.alert('Error', error.message)
            } finally {
                setUploadingPic(false)
            }
        }
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.modalBox}>

                {/* Drag Handle */}
                <View style={styles.dragHandle} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='chevron-back-outline' size={24} color='dodgerblue' />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Profile Image */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>

                        {/* ✅ ProfileAvatar handles local preview → API URL → default icon */}
                        <ProfileAvatar
                            uri={localPicUri ?? user?.profilePicUrl ?? null}
                            size={90}
                        />

                        {/* Uploading spinner overlay */}
                        {uploadingPic && (
                            <View style={styles.uploadingOverlay}>
                                <ActivityIndicator size='small' color='#ffffff' />
                            </View>
                        )}

                        {/* Camera button */}
                        <TouchableOpacity
                            style={styles.cameraBtn}
                            onPress={handlePickProfilePic}
                            disabled={uploadingPic}
                        >
                            <Ionicons name='camera' size={16} color='#ffffff' />
                        </TouchableOpacity>

                    </View>

                    <Text style={styles.displayUsername}>@{user?.username}</Text>

                    {uploadingPic && (
                        <Text style={{ color: '#9a9a9a', fontSize: 12, marginTop: 6 }}>
                            Updating profile picture...
                        </Text>
                    )}
                </View>

                {/* Form */}
                <View style={styles.form}>

                    {/* Username — locked */}
                    <Text style={styles.label}>Username</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: '#f0f0f0' }]}>
                        <TextInput
                            style={[styles.input, { color: '#a0a0a0' }]}
                            value={user?.username || ''}
                            editable={false}
                        />
                        <Ionicons name='lock-closed-outline' size={18} color='#a0a0a0' />
                    </View>
                    <Text style={styles.emailNote}>Username cannot be changed</Text>

                    {/* Email — locked */}
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: '#f0f0f0' }]}>
                        <TextInput
                            style={[styles.input, { color: '#a0a0a0' }]}
                            value={email}
                            editable={false}
                        />
                        <Ionicons name='lock-closed-outline' size={18} color='#a0a0a0' />
                    </View>
                    <Text style={styles.emailNote}>Email address cannot be changed</Text>

                </View>

            </View>
        </View>
    )
}

export default Modal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        height: height * 0.75,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#d1d1d1',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
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
    avatarSection: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    avatarWrapper: {
        position: 'relative',
    },
    uploadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'dodgerblue',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    displayUsername: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#1e1e1e',
    },
    form: { gap: 4 },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1e1e1e',
        marginBottom: 4,
        marginTop: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#d1d1d1',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1e1e1e',
    },
    emailNote: {
        fontSize: 12,
        color: '#a0a0a0',
        marginTop: 4,
    },
})