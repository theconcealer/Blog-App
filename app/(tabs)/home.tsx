// app/(tabs)/home.tsx

import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Alert, FlatList, Image, Platform, ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, Share, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useUserStore } from '@/store/useUserStore'
import { getPosts, Post, savePost, likePost, unlikePost, sharePost } from '@/services/postService'

const Explore = () => {
    const user = useUserStore((state) => state.user)
    const { height, width } = useWindowDimensions()
    const router = useRouter()

    const [posts, setPosts] = useState<Post[]>([])
    const [loadingPosts, setLoadingPosts] = useState(false)

    // ✅ Track saved post IDs
    const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set())

    // ✅ Track liked post IDs
    const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set())

    // ✅ Track like counts per post
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})

    const [showToast, setShowToast] = useState(false)
    const slideAnim = useRef(new Animated.Value(-100)).current

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            setLoadingPosts(true)
            const data = await getPosts()
            setPosts(data)

            // ✅ Pre-populate saved state from API
            const alreadySaved = new Set(
                data.filter(p => p.savedByMe).map(p => p.id)
            )
            setSavedPostIds(alreadySaved)

            // ✅ Pre-populate liked state from API
            const alreadyLiked = new Set(
                data.filter(p => p.likedByMe).map(p => p.id)
            )
            setLikedPostIds(alreadyLiked)

            // ✅ Pre-populate like counts from API
            const counts: Record<string, number> = {}
            data.forEach(p => { counts[p.id] = p.likeCount })
            setLikeCounts(counts)

        } catch (error: any) {
            console.log('❌ Error fetching posts:', error.message)
        } finally {
            setLoadingPosts(false)
        }
    }

    // ─── SAVE HANDLER ────────────────────────────────────────────────────────
    const handleSavePost = async (postId: string) => {
        try {
            const response = await savePost(postId)
            setSavedPostIds(prev => {
                const updated = new Set(prev)
                if (response.savedByMe) {
                    updated.add(postId)
                } else {
                    updated.delete(postId)
                }
                return updated
            })
            if (response.savedByMe) showSavedToast()
        } catch (error: any) {
            handleAuthError(error)
        }
    }

    // ─── LIKE HANDLER ────────────────────────────────────────────────────────
    const handleLikePost = async (postId: string) => {
        const isLiked = likedPostIds.has(postId)

        try {
            let response

            if (isLiked) {
                // ✅ Unlike the post
                response = await unlikePost(postId)
                setLikedPostIds(prev => {
                    const updated = new Set(prev)
                    updated.delete(postId)
                    return updated
                })
            } else {
                // ✅ Like the post
                response = await likePost(postId)
                setLikedPostIds(prev => {
                    const updated = new Set(prev)
                    updated.add(postId)
                    return updated
                })
            }

            // ✅ Update like count from API response
            setLikeCounts(prev => ({
                ...prev,
                [postId]: response.likeCount
            }))

        } catch (error: any) {
            handleAuthError(error)
        }
    }

    // ─── SHARE HANDLER ───────────────────────────────────────────────────────
    const handleSharePost = async (postId: string, postTitle: string) => {
        try {
            // ✅ Call the API to record the share
            await sharePost(postId, 'Loved this — had to share.')

            // ✅ Open native share sheet
            await Share.share({
                message: `Check out this post: "${postTitle}"`,
                title: postTitle,
            })

            // ✅ Update share count locally
            setPosts(prev =>
                prev.map(p =>
                    p.id === postId
                        ? { ...p, shareCount: p.shareCount + 1 }
                        : p
                )
            )

        } catch (error: any) {
            handleAuthError(error)
        }
    }

    // ─── AUTH ERROR HANDLER ──────────────────────────────────────────────────
    const handleAuthError = (error: any) => {
        if (error.message.includes('token') || error.message.includes('expired')) {
            Alert.alert('Session Expired', 'Please log in again', [
                { text: 'OK', onPress: () => router.replace('/auth/login') }
            ])
        } else {
            Alert.alert('Error', error.message)
        }
    }

    // ─── TOAST ───────────────────────────────────────────────────────────────
    const showSavedToast = () => {
        setShowToast(true)
        Animated.sequence([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(3000),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setShowToast(false))
    }

    // ─── POST CARD ───────────────────────────────────────────────────────────
    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.card}>
            <View style={styles.cont}>
                <View style={styles.username}>
                    <View style={{
                        width: 45, height: 45,
                        borderRadius: 100,
                        overflow: 'hidden',
                        backgroundColor: '#d1d1d1'
                    }}>
                        <Image
                            source={require('@/assets/images/Man Potrait Image.jpg')}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '600', lineHeight: 24, color: '#3e3f40' }}>
                        {item.authorName}
                    </Text>
                </View>

                {/* Bookmark */}
                <TouchableOpacity onPress={() => handleSavePost(item.id)}>
                    <Ionicons
                        name={savedPostIds.has(item.id) ? 'bookmark' : 'bookmark-outline'}
                        size={28}
                        color='dodgerblue'
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>
                {item.content.length > 120
                    ? item.content.substring(0, 120) + '.....'
                    : item.content
                }
            </Text>

            {item.imageUrl ? (
                <View style={{ height: height * 0.3, marginTop: 8 }}>
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={{ height: height * 0.3, width: width * 0.83, borderRadius: 4 }}
                        resizeMode='cover'
                    />
                </View>
            ) : null}

            {/* Engagements */}
            <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>

                {/* ✅ Views — read only, no tap action */}
                <View style={styles.views}>
                    <Ionicons name='eye-outline' size={24} color='dodgerblue' />
                    <Text>{item.viewCount}</Text>
                </View>

                {/* ✅ Likes — toggles like/unlike, icon fills on like */}
                <TouchableOpacity
                    style={styles.likes}
                    activeOpacity={0.7}
                    onPress={() => handleLikePost(item.id)}
                >
                    <Ionicons
                        name={likedPostIds.has(item.id) ? 'heart' : 'heart-outline'}
                        size={24}
                        color={likedPostIds.has(item.id) ? 'tomato' : 'dodgerblue'}   // ✅ tomato when liked
                    />
                    <Text>{likeCounts[item.id] ?? item.likeCount}</Text>
                </TouchableOpacity>

                {/* ✅ Share — calls API and opens native share sheet */}
                <TouchableOpacity
                    style={styles.share}
                    activeOpacity={0.7}
                    onPress={() => handleSharePost(item.id, item.title)}
                >
                    <Ionicons name='share-outline' size={24} color='dodgerblue' />
                    <Text>{item.shareCount}</Text>
                </TouchableOpacity>

            </View>
        </View>
    )

    return (
        <SafeAreaView style={{ padding: 16, flex: 1 }}>

            {/* Toast */}
            {showToast && (
                <Animated.View style={[styles.toast, { transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.toastText}>Post saved successfully</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/saved')}>
                        <Text style={styles.toastCTA}>View post</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.profileImage}>
                    <TouchableOpacity
                        style={{ width: 60, height: 60, borderRadius: 100, overflow: 'hidden' }}
                        onPress={() => router.push('/modal')}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require('@/assets/images/Man Potrait Image.jpg')}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </TouchableOpacity>

                    <View style={{ width: '72%', height: '100%', paddingVertical: 4, flexDirection: 'column', gap: 4 }}>
                        <Text style={styles.name}>{user?.username}</Text>
                        <Text style={styles.message}>Write magic today!</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={() => router.push('/createPost')}>
                    <View style={styles.iconContainer}>
                        <Ionicons name='add' size={24} color='#f9f9f9' />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.homeSearch}>
                <Ionicons name='search' size={20} color='#808289' />
                <TextInput
                    style={{ flex: 1, padding: 0, includeFontPadding: false }}
                    placeholder='search title here'
                    placeholderTextColor='#808289'
                />
            </View>

            {/* Posts */}
            {loadingPosts ? (
                <ActivityIndicator size='large' color='dodgerblue' style={{ marginTop: 48 }} />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    onRefresh={fetchPosts}
                    refreshing={loadingPosts}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 80, gap: 8 }}>
                            <Ionicons name='document-outline' size={48} color='#d1d1d1' />
                            <Text style={{ color: '#6a6a6a', fontSize: 16 }}>No posts yet</Text>
                            <Text style={{ color: '#a0a0a0', fontSize: 14 }}>Be the first to create a post!</Text>
                        </View>
                    }
                />
            )}

        </SafeAreaView>
    )
}

export default Explore

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: Platform.select({ ios: 60, android: 56 }),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    profileImage: {
        width: 250,
        height: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    iconContainer: {
        width: 52,
        height: 52,
        backgroundColor: 'dodgerblue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    message: {
        fontSize: 14,
        lineHeight: 21,
        color: '#6a6a6a',
        fontWeight: '500',
    },
    homeSearch: {
        borderWidth: 0.5,
        borderColor: '#b1b2b6',
        backgroundColor: '#edf1f6',
        width: '100%',
        height: 44,
        borderRadius: 10,
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    card: {
        width: '100%',
        padding: 20,
        borderRadius: 12,
        marginTop: 24,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 4,
    },
    username: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        overflow: 'hidden',
    },
    cont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '700',
        marginTop: 16,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        marginTop: 16,
        color: '#636567',
    },
    views: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    likes: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    share: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    toast: {
        position: 'absolute',
        top: 0,
        left: 16,
        right: 16,
        backgroundColor: 'green',
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    toastCTA: { color: '#f9f9f9', fontSize: 14, fontWeight: '700' },
})