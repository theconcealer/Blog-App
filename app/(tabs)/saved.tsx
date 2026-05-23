// app/(tabs)/saved.tsx

import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { getSavedPosts, Post, unsavePost, deletePost } from '@/services/postService'
import { useUserStore } from '@/store/useUserStore'

// ✅ ProfileAvatar import
import ProfileAvatar from '@/components/profileAvatar'

const Saved = () => {
    const router = useRouter()
    const { height } = useWindowDimensions()
    const user = useUserStore((state) => state.user)

    const [savedPosts, setSavedPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(false)
    const [showDeleteToast, setShowDeleteToast] = useState(false)
    const deleteSlideAnim = useRef(new Animated.Value(-100)).current

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

    const handleUnsavePost = async (postId: string) => {
        try {
            await unsavePost(postId)
            setSavedPosts(prev => prev.filter(p => p.id !== postId))
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }

    const handleDeletePost = (postId: string) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePost(postId)
                            setSavedPosts(prev => prev.filter(p => p.id !== postId))
                            triggerDeleteToast()
                        } catch (error: any) {
                            Alert.alert('Error', error.message)
                        }
                    }
                }
            ]
        )
    }

    const triggerDeleteToast = () => {
        setShowDeleteToast(true)
        Animated.sequence([
            Animated.timing(deleteSlideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.delay(3000),
            Animated.timing(deleteSlideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowDeleteToast(false))
    }

    const renderSavedPost = ({ item }: { item: Post }) => {
        const isMyPost = item.authorId === user?.id

        return (
            <View style={styles.card}>
                <View style={styles.cont}>
                    <View style={styles.authorRow}>

                        {/* ✅ Show MY profile pic on MY saved posts, default icon on others */}
                        <ProfileAvatar
                            uri={isMyPost ? user?.profilePicUrl : null}
                            size={40}
                        />

                        <Text style={styles.authorName}>{item.authorName}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity onPress={() => handleUnsavePost(item.id)}>
                            <Ionicons name='bookmark' size={24} color='dodgerblue' />
                        </TouchableOpacity>

                        {isMyPost && (
                            <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
                                <Ionicons name='trash-outline' size={24} color='tomato' />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>
                    {item.content.length > 120
                        ? item.content.substring(0, 120) + '.....'
                        : item.content
                    }
                </Text>

                {item.imageUrl ? (
                    <View style={{
                        height: height * 0.25,
                        width: '100%',
                        marginTop: 8,
                        borderRadius: 8,
                        overflow: 'hidden',
                    }}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={{ width: '100%', height: '100%' }}
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
    }

    return (
        <SafeAreaView style={styles.container}>

            {/* Delete Toast */}
            {showDeleteToast && (
                <Animated.View style={[styles.toast, { transform: [{ translateY: deleteSlideAnim }] }]}>
                    <Text style={styles.toastText}>Post deleted successfully</Text>
                </Animated.View>
            )}

            <Text style={styles.header}>Saved Posts</Text>
            <Text style={styles.subHeader}>Posts you've bookmarked</Text>

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
    container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
    header: { fontSize: 24, fontWeight: '700', color: '#1e1e1e', marginBottom: 4 },
    subHeader: { fontSize: 14, color: '#6a6a6a', marginBottom: 16 },
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
    cont: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    authorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    authorName: { fontSize: 15, fontWeight: '600', color: '#3e3f40' },
    title: { fontSize: 16, lineHeight: 24, fontWeight: '700', marginTop: 16, color: '#1e1e1e' },
    body: { fontSize: 15, lineHeight: 24, fontWeight: '400', marginTop: 8, color: '#636567' },
    engagements: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginTop: 16 },
    engagementItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    engagementText: { fontSize: 14, color: '#636567' },
    emptyState: { flex: 1, alignItems: 'center', marginTop: 120, gap: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e1e1e' },
    emptySubTitle: { fontSize: 14, color: '#6a6a6a', textAlign: 'center', paddingHorizontal: 32 },
    browseBtn: { marginTop: 8, backgroundColor: 'dodgerblue', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    browseBtnText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
    toast: {
        position: 'absolute',
        top: 0, left: 16, right: 16,
        backgroundColor: 'tomato',
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
        marginTop: 52,
    },
    toastText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
})