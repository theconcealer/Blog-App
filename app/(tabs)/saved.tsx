// app/(tabs)/saved.tsx

import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { getSavedPosts, Post } from '@/services/postService'

const Saved = () => {
    const router = useRouter()
    const { height, width } = useWindowDimensions()

    const [savedPosts, setSavedPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(false)

    // ✅ Refetch every time the saved tab is opened
    useFocusEffect(
        useCallback(() => {
            fetchSavedPosts()
        }, [])
    )

    const fetchSavedPosts = async () => {
        try {
            setLoading(true)
            const data = await getSavedPosts()
            setSavedPosts(data)
        } catch (error: any) {
            console.log('❌ Error fetching saved posts:', error.message)
        } finally {
            setLoading(false)
        }
    }

    const renderSavedPost = ({ item }: { item: Post }) => (
        <View style={styles.card}>
            <View style={styles.cont}>
                <View style={styles.authorRow}>
                    <View style={styles.avatarCircle}>
                        <Image
                            source={require('@/assets/images/Man Potrait Image.jpg')}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                    <Text style={styles.authorName}>{item.authorName}</Text>
                </View>

                {/* ✅ Bookmark icon filled since all posts here are saved */}
                <Ionicons name='bookmark' size={24} color='dodgerblue' />
            </View>

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.body}>
                {item.content.length > 120
                    ? item.content.substring(0, 120) + '.....'
                    : item.content
                }
            </Text>

            {item.imageUrl ? (
                <View style={{ height: height * 0.25, marginTop: 8 }}>
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={{ height: height * 0.25, width: width * 0.83, borderRadius: 4 }}
                        resizeMode='cover'
                    />
                </View>
            ) : null}

            <View style={styles.engagements}>
                <View style={styles.engagementItem}>
                    <Ionicons name='eye-outline' size={20} color='dodgerblue' />
                    <Text style={styles.engagementText}>{item.viewCount}</Text>
                </View>

                <View style={styles.engagementItem}>
                    <Ionicons name='heart-outline' size={20} color='dodgerblue' />
                    <Text style={styles.engagementText}>{item.likeCount}</Text>
                </View>

                <View style={styles.engagementItem}>
                    <Ionicons name='share-outline' size={20} color='dodgerblue' />
                    <Text style={styles.engagementText}>{item.shareCount}</Text>
                </View>
            </View>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <Text style={styles.header}>Saved Posts</Text>
            <Text style={styles.subHeader}>Posts you've bookmarked</Text>

            {/* Posts */}
            {loading ? (
                <ActivityIndicator size='large' color='dodgerblue' style={{ marginTop: 48 }} />
            ) : (
                <FlatList
                    data={savedPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSavedPost}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    onRefresh={fetchSavedPosts}
                    refreshing={loading}

                    // ✅ Empty state
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name='bookmark-outline' size={56} color='#d1d1d1' />
                            <Text style={styles.emptyTitle}>No saved posts yet</Text>
                            <Text style={styles.emptySubTitle}>
                                Tap the bookmark icon on any post to save it here
                            </Text>
                            <TouchableOpacity
                                style={styles.browseBtn}
                                onPress={() => router.push('/(tabs)/home')}
                            >
                                <Text style={styles.browseBtnText}>Browse Posts</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

        </SafeAreaView>
    )
}

export default Saved

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 4,
    },
    subHeader: {
        fontSize: 14,
        color: '#6a6a6a',
        marginBottom: 16,
    },
    card: {
        width: '100%',
        padding: 20,
        borderRadius: 12,
        marginTop: 16,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 4,
    },
    cont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: '#d1d1d1',
    },
    authorName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#3e3f40',
    },
    title: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '700',
        marginTop: 16,
        color: '#1e1e1e',
    },
    body: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '400',
        marginTop: 8,
        color: '#636567',
    },
    engagements: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        marginTop: 16,
    },
    engagementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    engagementText: {
        fontSize: 14,
        color: '#636567',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        marginTop: 120,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e1e1e',
    },
    emptySubTitle: {
        fontSize: 14,
        color: '#6a6a6a',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    browseBtn: {
        marginTop: 8,
        backgroundColor: 'dodgerblue',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    browseBtnText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 14,
    },
})