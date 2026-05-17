// services/postService.ts

import { apiRequest } from './api'

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface Post {
    id: string
    title: string
    content: string
    imageUrl: string
    authorId: string
    authorName: string
    createdAt: string
    updatedAt: string
    viewCount: number
    likeCount: number
    shareCount: number
    likedByMe: boolean
    savedByMe: boolean
    sharedFromId: string
    sharedFrom: {
        id: string
        title: string
        authorId: string
        authorName: string
    }
}

export interface SavePostResponse {
    message: string
    savedByMe: boolean
}

export interface LikePostResponse {
    message: string
    likeCount: number
    likedByMe: boolean
}

export interface ViewsResponse {
    views: number
}

// ─── CREATE POST ─────────────────────────────────────────────────────────────
export const createPost = async (
    title: string,
    content: string
): Promise<Post> => {
    return apiRequest<Post>('/api/posts', {
        method: 'POST',
        body: { title, content },
        requiresAuth: true,
    })
}

// ─── GET ALL POSTS ────────────────────────────────────────────────────────────
export const getPosts = async (): Promise<Post[]> => {
    return apiRequest<Post[]>('/api/posts', {
        method: 'GET',
        requiresAuth: true,
    })
}

// ─── SAVE / BOOKMARK A POST ──────────────────────────────────────────────────
export const savePost = async (postId: string): Promise<SavePostResponse> => {
    return apiRequest<SavePostResponse>(`/api/posts/${postId}/save`, {
        method: 'POST',
        requiresAuth: true,
    })
}

// ─── GET SAVED POSTS ─────────────────────────────────────────────────────────
export const getSavedPosts = async (): Promise<Post[]> => {
    return apiRequest<Post[]>('/api/posts/saved', {
        method: 'GET',
        requiresAuth: true,
    })
}

// ─── GET POST VIEWS ──────────────────────────────────────────────────────────
export const getPostViews = async (postId: string): Promise<ViewsResponse> => {
    return apiRequest<ViewsResponse>(`/api/posts/${postId}/views`, {
        method: 'GET',
        requiresAuth: true,
    })
}

// ─── LIKE A POST ─────────────────────────────────────────────────────────────
// ✅ Changed from GET to POST
export const likePost = async (postId: string): Promise<LikePostResponse> => {
    return apiRequest<LikePostResponse>(`/api/posts/${postId}/like`, {
        method: 'POST',         // ✅ POST — not GET
        requiresAuth: true,
    })
}

// ─── UNLIKE A POST ───────────────────────────────────────────────────────────
// ✅ Unchanged — DELETE is correct
export const unlikePost = async (postId: string): Promise<LikePostResponse> => {
    return apiRequest<LikePostResponse>(`/api/posts/${postId}/like`, {
        method: 'DELETE',
        requiresAuth: true,
    })
}

// ─── GET LIKE COUNT (read only) ───────────────────────────────────────────────
// ✅ This is separate — just for reading the count
export const getPostLikes = async (postId: string): Promise<LikePostResponse> => {
    return apiRequest<LikePostResponse>(`/api/posts/${postId}/likes`, {
        method: 'GET',
        requiresAuth: true,
    })
}

// ─── SHARE A POST ────────────────────────────────────────────────────────────
export const sharePost = async (postId: string, content: string): Promise<Post> => {
    return apiRequest<Post>(`/api/posts/${postId}/share`, {
        method: 'POST',
        body: { content },
        requiresAuth: true,
    })
}