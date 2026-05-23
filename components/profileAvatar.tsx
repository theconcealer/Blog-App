// components/ProfileAvatar.tsx

import { Image, View, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

type Props = {
    uri?: string | null        // ✅ profile pic URL from API
    size?: number              // ✅ size of the avatar — default 45
}

const ProfileAvatar = ({ uri, size = 45 }: Props) => {

    const styles = StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            backgroundColor: '#e0e0e0',  // ✅ grey background for default icon
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
        },
    })

    // ✅ If no profile pic URL — show default user icon
    if (!uri) {
        return (
            <View style={styles.container}>
                <Ionicons
                    name='person'
                    size={size * 0.55}   // ✅ icon scales with size
                    color='#9a9a9a'
                />
            </View>
        )
    }

    // ✅ If profile pic URL exists — show the image
    return (
        <View style={styles.container}>
            <Image
                source={{ uri }}
                style={styles.image}
                resizeMode='cover'
                onError={() => console.log('❌ Profile pic failed to load')}
            />
        </View>
    )
}

export default ProfileAvatar