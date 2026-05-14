import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// Global state import
import { useUserStore } from '@/store/useUserStore'

const { height } = Dimensions.get('window')

const Modal = () => {
    const router = useRouter()

    // Get user and setUser from global store
    const user = useUserStore((state) => state.user)
    const setUser = useUserStore((state) => state.setUser)

    // Pre-fill fields with data from global store
    const [tempUsername, setTempUsername] = useState(user?.username || '')
    const [isEditing, setIsEditing] = useState(false)

    // Email comes from global store — not editable
    const email = user?.email || ''

    const handleEdit = () => setIsEditing(true)

    const handleUpdate = () => {
        if (tempUsername.trim() === '') {
            Alert.alert('Error', 'Username cannot be empty')
            return
        }

        // ✅ Update username in global store — reflects everywhere instantly
        setUser({ ...user!, username: tempUsername })

        setIsEditing(false)
        Alert.alert('Success', 'Profile updated successfully!')
    }

    const handleCancel = () => {
        // ✅ Reset to original username from store
        setTempUsername(user?.username || '')
        setIsEditing(false)
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
                        {/* ✅ Shows profile pic from API if available, fallback to local image */}
                        {user?.profilePicUrl ? (
                            <Image
                                source={{ uri: user.profilePicUrl }}
                                style={styles.avatar}
                            />
                        ) : (
                            <Image
                                source={require('@/assets/images/Man Potrait Image.jpg')}
                                style={styles.avatar}
                            />
                        )}
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name='camera' size={16} color='#ffffff' />
                        </TouchableOpacity>
                    </View>

                    {/* ✅ Shows username below avatar */}
                    <Text style={styles.displayUsername}>@{user?.username}</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>

                    {/* Username Field */}
                    <Text style={styles.label}>Username</Text>
                    <View style={[
                        styles.inputWrapper,
                        { borderColor: isEditing ? 'dodgerblue' : '#d1d1d1' }
                    ]}>
                        <TextInput
                            style={styles.input}
                            value={tempUsername}
                            onChangeText={setTempUsername}
                            editable={isEditing}
                            placeholder='Enter username'
                            placeholderTextColor='#a0a0a0'
                        />
                        <TouchableOpacity onPress={handleEdit}>
                            <Ionicons
                                name={isEditing ? 'create' : 'create-outline'}
                                size={20}
                                color={isEditing ? 'dodgerblue' : '#a0a0a0'}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Email Field — not editable */}
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: '#f0f0f0' }]}>
                        <TextInput
                            style={[styles.input, { color: '#a0a0a0' }]}
                            value={email}        // ✅ pulled from global store
                            editable={false}
                        />
                        <Ionicons name='lock-closed-outline' size={18} color='#a0a0a0' />
                    </View>
                    <Text style={styles.emailNote}>Email address cannot be changed</Text>

                </View>

                {/* Buttons */}
                <View style={styles.btnGroup}>
                    {isEditing && (
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.updateBtn, { opacity: isEditing ? 1 : 0.5 }]}
                        onPress={handleUpdate}
                        disabled={!isEditing}
                    >
                        <Text style={styles.updateText}>Update Profile</Text>
                    </TouchableOpacity>
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
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'dodgerblue',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },

    // ✅ Username displayed below avatar
    displayUsername: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#1e1e1e',
    },

    form: {
        gap: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1e1e1e',
        marginBottom: 4,
        marginTop: 12,
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
    btnGroup: {
        marginTop: 24,
        gap: 12,
    },
    updateBtn: {
        backgroundColor: 'dodgerblue',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    updateText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelBtn: {
        borderWidth: 1.5,
        borderColor: 'dodgerblue',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: 'dodgerblue',
        fontSize: 16,
        fontWeight: '600',
    },
})