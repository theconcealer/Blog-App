import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const Profile = () => {
    const router = useRouter()

    //  State for username and edit mode
    const [username, setUsername] = useState('GhostWriter')
    const [tempUsername, setTempUsername] = useState(username)
    const [isEditing, setIsEditing] = useState(false)
    const email = 'mndubuisi1000@gmail.com'  // email is fixed, no state needed

    const handleEdit = () => {
        setIsEditing(true)  //  enables editing
    }

    const handleUpdate = () => {
        if (tempUsername.trim() === '') {
            Alert.alert('Error', 'Username cannot be empty')
            return
        }
        setUsername(tempUsername)   //  saves the new username
        setIsEditing(false)         //  exits edit mode
        Alert.alert('Success', 'Profile updated successfully!')
    }

    const handleCancel = () => {
        setTempUsername(username)   //  resets to original if cancelled
        setIsEditing(false)
    }

    return (
        <SafeAreaView style={styles.container}>

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
                    <Image
                        source={require('@/assets/images/Man Potrait Image.jpg')}
                        style={styles.avatar}
                    />
                    {/* Camera icon to change photo */}
                    <TouchableOpacity style={styles.cameraBtn}>
                        <Ionicons name='camera' size={16} color='#ffffff' />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Form */}
            <View style={styles.form}>

                {/* Username Field */}
                <Text style={styles.label}>Username</Text>
                <View style={[
                    styles.inputWrapper,
                    { borderColor: isEditing ? 'dodgerblue' : '#d1d1d1' }  // highlights when editing
                ]}>
                    <TextInput
                        style={styles.input}
                        value={tempUsername}
                        onChangeText={setTempUsername}
                        editable={isEditing}        //  only editable when edit icon is tapped
                        placeholder='Enter username'
                        placeholderTextColor='#a0a0a0'
                    />
                    {/* Edit Icon */}
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
                        value={email}
                        editable={false}    //  always locked
                    />
                    <Ionicons name='lock-closed-outline' size={18} color='#a0a0a0' />
                </View>
                <Text style={styles.emailNote}>Email address cannot be changed</Text>

            </View>

            {/* Buttons */}
            <View style={styles.btnGroup}>

                {/* Cancel — only shows when editing */}
                {isEditing && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                )}

                {/* Update Button */}
                <TouchableOpacity
                    style={[
                        styles.updateBtn,
                        { opacity: isEditing ? 1 : 0.5 }   // dims when not in edit mode
                    ]}
                    onPress={handleUpdate}
                    disabled={!isEditing}   // ✅ disabled unless editing
                >
                    <Text style={styles.updateText}>Update Profile</Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e1e1e',
    },

    // Avatar
    avatarSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
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

    // Form
    form: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1e1e1e',
        marginBottom: 6,
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
        marginTop: 6,
    },

    // Buttons
    btnGroup: {
        marginTop: 44,
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