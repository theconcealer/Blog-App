// app/postPreview.tsx

import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Share, Modal, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { getPost, Post, savePost, unsavePost, likePost, unlikePost, sharePost } from '@/services/postService'

const PostPreview = () => {
    const router = useRouter()
    const { height, width } = useWindowDimensions()

    // ✅ Get post id passed from home screen
    const { id } = useLocalSearchParams<{ id: string }>()

    // ✅ Post state
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(false)

    // ✅ Engagement state
    const [isSaved, setIsSaved] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [shareCount, setShareCount] = useState(0)

    // ✅ Full screen image state
    const [imageModalVisible, setImageModalVisible] = useState(false)

    useEffect(() => {
        if (id) fetchPost()
    }, [id])

    // ─── FETCH SINGLE POST ────────────────────────────────────────────────────
    const fetchPost = async () => {
        try {
            setLoading(true)
            const data = await getPost(id)
            setPost(data)

            // ✅ Pre-populate engagement state from API
            setIsSaved(data.savedByMe)
            setIsLiked(data.likedByMe)
            setLikeCount(data.likeCount)
            setShareCount(data.shareCount)

        } catch (error: any) {
            Alert.alert('Error', error.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── SAVE / UNSAVE ────────────────────────────────────────────────────────
    const handleSave = async () => {
        try {
            if (isSaved) {
                await unsavePost(id)
                setIsSaved(false)
            } else {
                await savePost(id)
                setIsSaved(true)
            }
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }

    // ─── LIKE / UNLIKE ────────────────────────────────────────────────────────
    const handleLike = async () => {
        try {
            if (isLiked) {
                const response = await unlikePost(id)
                setIsLiked(false)
                setLikeCount(response.likeCount)
            } else {
                const response = await likePost(id)
                setIsLiked(true)
                setLikeCount(response.likeCount)
            }
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }

    // ─── SHARE ────────────────────────────────────────────────────────────────
    const handleShare = async () => {
        try {
            await sharePost(id, 'Loved this — had to share.')
            await Share.share({
                message: `Check out this post: "${post?.title}"`,
                title: post?.title,
            })
            setShareCount(prev => prev + 1)
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }

    // ─── LOADING STATE ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='dodgerblue' />
            </SafeAreaView>
        )
    }

    // ─── NO POST FOUND ────────────────────────────────────────────────────────
    if (!post) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={{ color: '#6a6a6a' }}>Post not found</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='chevron-back-outline' size={24} color='dodgerblue' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post</Text>

                {/* ✅ Bookmark in header */}
                <TouchableOpacity onPress={handleSave}>
                    <Ionicons
                        name={isSaved ? 'bookmark' : 'bookmark-outline'}
                        size={24}
                        color='dodgerblue'
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
            >

                {/* Author row */}
                <View style={styles.authorRow}>
                    <View style={styles.avatarCircle}>
                        <Image
                            source={require('@/assets/images/Man Potrait Image.jpg')}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                    <View style={{ gap: 2 }}>
                        <Text style={styles.authorName}>{post.authorName}</Text>
                        {/* ✅ Show formatted date */}
                        <Text style={styles.date}>
                            {new Date(post.createdAt).toDateString()}
                        </Text>
                    </View>
                </View>

                {/* Title — full, no truncation */}
                <Text style={styles.title}>{post.title}</Text>

                {/* ✅ Post image — tapping opens full screen */}
                {post.imageUrl ? (
                    <TouchableOpacity
                        onPress={() => setImageModalVisible(true)}
                        activeOpacity={0.9}
                    >
                        <View style={{
                            width: '100%',
                            height: height * 0.3,
                            borderRadius: 12,
                            overflow: 'hidden',
                            marginTop: 16,
                        }}>
                            <Image
                                source={{ uri: post.imageUrl }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode='cover'
                            />
                            {/* ✅ Tap hint */}
                            <View style={styles.tapHint}>
                                <Ionicons name='expand-outline' size={14} color='#ffffff' />
                                <Text style={styles.tapHintText}>Tap to expand</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : null}

                {/* Content — full, no truncation */}
                <Text style={styles.body}>{post.content}</Text>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Engagements */}
                <View style={styles.engagements}>

                    {/* Views — read only */}
                    <View style={styles.engagementItem}>
                        <Ionicons name='eye-outline' size={22} color='dodgerblue' />
                        <Text style={styles.engagementText}>{post.viewCount}</Text>
                    </View>

                    {/* ✅ Likes — toggles */}
                    <TouchableOpacity
                        style={styles.engagementItem}
                        onPress={handleLike}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            size={22}
                            color={isLiked ? 'tomato' : 'dodgerblue'}
                        />
                        <Text style={styles.engagementText}>{likeCount}</Text>
                    </TouchableOpacity>

                    {/* ✅ Share */}
                    <TouchableOpacity
                        style={styles.engagementItem}
                        onPress={handleShare}
                        activeOpacity={0.7}
                    >
                        <Ionicons name='share-outline' size={22} color='dodgerblue' />
                        <Text style={styles.engagementText}>{shareCount}</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>

            {/* ✅ Full screen image modal — opens when image is tapped */}
            <Modal
                visible={imageModalVisible}
                transparent={true}
                animationType='fade'
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={styles.modalOverlay}>

                    {/* Close button */}
                    <TouchableOpacity
                        style={styles.modalCloseBtn}
                        onPress={() => setImageModalVisible(false)}
                    >
                        <Ionicons name='close-circle' size={36} color='#ffffff' />
                    </TouchableOpacity>

                    {/* ✅ Full screen image */}
                    <Image
                        source={{ uri: post.imageUrl }}
                        style={{
                            width: width,
                            height: height * 0.7,
                        }}
                        resizeMode='contain'
                    />

                </View>
            </Modal>

        </SafeAreaView>
    )
}

export default PostPreview

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e5e5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e1e1e',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    avatarCircle: {
        width: 44,
        height: 44,
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: '#d1d1d1',
    },
    authorName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e1e1e',
    },
    date: {
        fontSize: 12,
        color: '#9a9a9a',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1e1e1e',
        lineHeight: 32,
        marginBottom: 16,
    },
    body: {
        fontSize: 16,
        lineHeight: 28,
        color: '#3e3f40',
        marginTop: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e5e5',
        marginVertical: 24,
    },
    engagements: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    engagementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    engagementText: {
        fontSize: 15,
        color: '#636567',
        fontWeight: '500',
    },

    // ✅ Tap hint overlay on image
    tapHint: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tapHintText: {
        color: '#ffffff',
        fontSize: 11,
    },

    // ✅ Full screen image modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseBtn: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
    },
})