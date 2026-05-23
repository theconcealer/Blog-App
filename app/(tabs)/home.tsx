// app/(tabs)/home.tsx

import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Alert, FlatList, Platform, ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, Share, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useUserStore } from '@/store/useUserStore'
import { getPosts, Post, savePost, unsavePost, likePost, unlikePost, sharePost, deletePost } from '@/services/postService'

// ✅ ProfileAvatar import
import ProfileAvatar from '@/components/profileAvatar'
import { Image } from 'react-native'

const Explore = () => {
    const user = useUserStore((state) => state.user)
    const { height } = useWindowDimensions()
    const router = useRouter()

    const [posts, setPosts] = useState<Post[]>([])
    const [loadingPosts, setLoadingPosts] = useState(false)
    const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set())
    const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set())
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
    const [searchQuery, setSearchQuery] = useState('')
    const [showSaveToast, setShowSaveToast] = useState(false)
    const [showDeleteToast, setShowDeleteToast] = useState(false)
    const saveSlideAnim = useRef(new Animated.Value(-100)).current
    const deleteSlideAnim = useRef(new Animated.Value(-100)).current

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            setLoadingPosts(true)
            const data = await getPosts()
            setPosts(data)

            const alreadySaved = new Set(data.filter(p => p.savedByMe).map(p => p.id))
            setSavedPostIds(alreadySaved)

            const alreadyLiked = new Set(data.filter(p => p.likedByMe).map(p => p.id))
            setLikedPostIds(alreadyLiked)

            const counts: Record<string, number> = {}
            data.forEach(p => { counts[p.id] = p.likeCount })
            setLikeCounts(counts)

        } catch (error: any) {
            console.log('❌ Error fetching posts:', error.message)
        } finally {
            setLoadingPosts(false)
        }
    }

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSavePost = async (postId: string) => {
        const isSaved = savedPostIds.has(postId)
        try {
            if (isSaved) {
                await unsavePost(postId)
                setSavedPostIds(prev => {
                    const updated = new Set(prev)
                    updated.delete(postId)
                    return updated
                })
            } else {
                await savePost(postId)
                setSavedPostIds(prev => {
                    const updated = new Set(prev)
                    updated.add(postId)
                    return updated
                })
                triggerSaveToast()
            }
        } catch (error: any) {
            handleAuthError(error)
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
                            setPosts(prev => prev.filter(p => p.id !== postId))
                            triggerDeleteToast()
                        } catch (error: any) {
                            handleAuthError(error)
                        }
                    }
                }
            ]
        )
    }

    const handleLikePost = async (postId: string) => {
        const isLiked = likedPostIds.has(postId)
        try {
            let response
            if (isLiked) {
                response = await unlikePost(postId)
                setLikedPostIds(prev => {
                    const updated = new Set(prev)
                    updated.delete(postId)
                    return updated
                })
            } else {
                response = await likePost(postId)
                setLikedPostIds(prev => {
                    const updated = new Set(prev)
                    updated.add(postId)
                    return updated
                })
            }
            setLikeCounts(prev => ({ ...prev, [postId]: response.likeCount }))
        } catch (error: any) {
            handleAuthError(error)
        }
    }

    const handleSharePost = async (postId: string, postTitle: string) => {
        try {
            await sharePost(postId, 'Loved this — had to share.')
            await Share.share({
                message: `Check out this post: "${postTitle}"`,
                title: postTitle,
            })
            setPosts(prev =>
                prev.map(p => p.id === postId ? { ...p, shareCount: p.shareCount + 1 } : p)
            )
        } catch (error: any) {
            handleAuthError(error)
        }
    }

    const handleAuthError = (error: any) => {
        if (error.message.includes('token') || error.message.includes('expired')) {
            Alert.alert('Session Expired', 'Please log in again', [
                { text: 'OK', onPress: () => router.replace('/auth/login') }
            ])
        } else {
            Alert.alert('Error', error.message)
        }
    }

    const triggerSaveToast = () => {
        setShowSaveToast(true)
        Animated.sequence([
            Animated.timing(saveSlideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.delay(3000),
            Animated.timing(saveSlideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowSaveToast(false))
    }

    const triggerDeleteToast = () => {
        setShowDeleteToast(true)
        Animated.sequence([
            Animated.timing(deleteSlideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.delay(3000),
            Animated.timing(deleteSlideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowDeleteToast(false))
    }

    const renderPost = ({ item }: { item: Post }) => {
        const isMyPost = item.authorId === user?.id

        return (
            <TouchableOpacity
                onPress={() => router.push(`/postPreview?id=${item.id}`)}
                activeOpacity={0.95}
            >
                <View style={styles.card}>
                    <View style={styles.cont}>
                        <View style={styles.username}>

                            {/* ✅ Show MY profile pic on MY posts, default icon on others */}
                            <ProfileAvatar
                                uri={isMyPost ? user?.profilePicUrl : null}
                                size={45}
                            />

                            <Text style={{ fontSize: 16, fontWeight: '600', lineHeight: 24, color: '#3e3f40' }}>
                                {item.authorName}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation()
                                    handleSavePost(item.id)
                                }}
                            >
                                <Ionicons
                                    name={savedPostIds.has(item.id) ? 'bookmark' : 'bookmark-outline'}
                                    size={24}
                                    color='dodgerblue'
                                />
                            </TouchableOpacity>

                            {isMyPost && (
                                <TouchableOpacity
                                    onPress={(e) => {
                                        e.stopPropagation()
                                        handleDeletePost(item.id)
                                    }}
                                >
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
                            height: height * 0.3,
                            width: '100%',
                            marginTop: 12,
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}>
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode='cover'
                                onError={(e) => console.log('❌ Image failed to load:', e.nativeEvent.error)}
                            />
                        </View>
                    ) : null}

                    <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                        <View style={styles.views}>
                            <Ionicons name='eye-outline' size={24} color='dodgerblue' />
                            <Text>{item.viewCount}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.likes}
                            activeOpacity={0.7}
                            onPress={(e) => {
                                e.stopPropagation()
                                handleLikePost(item.id)
                            }}
                        >
                            <Ionicons
                                name={likedPostIds.has(item.id) ? 'heart' : 'heart-outline'}
                                size={24}
                                color={likedPostIds.has(item.id) ? 'tomato' : 'dodgerblue'}
                            />
                            <Text>{likeCounts[item.id] ?? item.likeCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.share}
                            activeOpacity={0.7}
                            onPress={(e) => {
                                e.stopPropagation()
                                handleSharePost(item.id, item.title)
                            }}
                        >
                            <Ionicons name='share-outline' size={24} color='dodgerblue' />
                            <Text>{item.shareCount}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ padding: 16, flex: 1 }}>

            {/* Save Toast */}
            {showSaveToast && (
                <Animated.View style={[styles.toast, styles.saveToast, { transform: [{ translateY: saveSlideAnim }] }]}>
                    <Text style={styles.toastText}>Post saved successfully</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/saved')}>
                        <Text style={styles.toastCTA}>View post</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Delete Toast */}
            {showDeleteToast && (
                <Animated.View style={[styles.toast, styles.deleteToast, { transform: [{ translateY: deleteSlideAnim }] }]}>
                    <Text style={styles.toastText}>Post deleted successfully</Text>
                </Animated.View>
            )}

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.profileImage}>

                    {/* ✅ Logged in user's profile pic in header */}
                    <TouchableOpacity onPress={() => router.push('/modal')} activeOpacity={0.8}>
                        <ProfileAvatar uri={user?.profilePicUrl} size={60} />
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
                    placeholder='search by title or username...'
                    placeholderTextColor='#808289'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name='close-circle' size={18} color='#808289' />
                    </TouchableOpacity>
                )}
            </View>

            {searchQuery.length > 0 && (
                <Text style={{ color: '#6a6a6a', fontSize: 13, marginBottom: 8, marginTop: 4 }}>
                    {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                </Text>
            )}

            {loadingPosts ? (
                <ActivityIndicator size='large' color='dodgerblue' style={{ marginTop: 48 }} />
            ) : (
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    onRefresh={fetchPosts}
                    refreshing={loadingPosts}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 80, gap: 8 }}>
                            <Ionicons name='search-outline' size={48} color='#d1d1d1' />
                            <Text style={{ color: '#6a6a6a', fontSize: 16 }}>
                                {searchQuery.length > 0 ? `No results for "${searchQuery}"` : 'No posts yet'}
                            </Text>
                            <Text style={{ color: '#a0a0a0', fontSize: 14 }}>
                                {searchQuery.length > 0 ? 'Try a different title or username' : 'Be the first to create a post!'}
                            </Text>
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
        alignItems: 'center',
    },
    iconContainer: {
        width: 52,
        height: 52,
        backgroundColor: 'dodgerblue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    name: { fontSize: 16, fontWeight: 'bold', lineHeight: 24 },
    message: { fontSize: 14, lineHeight: 21, color: '#6a6a6a', fontWeight: '500' },
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
    username: { flexDirection: 'row', gap: 12, alignItems: 'center', overflow: 'hidden' },
    cont: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16, lineHeight: 24, fontWeight: '700', marginTop: 16 },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400', marginTop: 16, color: '#636567' },
    views: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    likes: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    share: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    toast: {
        position: 'absolute',
        top: 0,
        left: 16,
        right: 16,
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
        marginTop: 52,
    },
    saveToast: { backgroundColor: 'green', justifyContent: 'space-between' },
    deleteToast: { backgroundColor: 'tomato', justifyContent: 'center' },
    toastText: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
    toastCTA: { color: '#f9f9f9', fontSize: 14, fontWeight: '700' },
})