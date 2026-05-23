// services/postService.ts

import { apiRequest } from './api'
import { getAccessToken } from './tokenStorage'

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

export interface UploadImageResponse {
    url: string
    key: string
}

// ─── UPLOAD IMAGE ─────────────────────────────────────────────────────────────
export const uploadImage = async (imageUri: string): Promise<UploadImageResponse> => {
    const token = await getAccessToken()

    // ✅ Use FormData for binary file upload
    const formData = new FormData()

    const filename = imageUri.split('/').pop() || 'image.jpg'
    const match = /\.(\w+)$/.exec(filename)
    const type = match ? `image/${match[1]}` : 'image/jpeg'

    formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
    } as any)

    formData.append('folder', 'posts')  // ✅ folder field from API docs

    const response = await fetch('https://blog-api-ten-eosin.vercel.app/api/uploads', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // ✅ Don't set Content-Type manually — fetch sets it automatically for FormData
        },
        body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || 'Image upload failed')
    }

    return data
}

// ─── DELETE IMAGE ─────────────────────────────────────────────────────────────
export const deleteImage = async (url: string, key: string): Promise<void> => {
    return apiRequest('/api/uploads', {
        method: 'DELETE',
        body: { url, key },
        requiresAuth: true,
    })
}

// ─── CREATE POST ─────────────────────────────────────────────────────────────
export const createPost = async (
    title: string,
    content: string,
    imageUrl?: string       // ✅ accepts imageUrl from upload response
): Promise<Post> => {
    return apiRequest<Post>('/api/posts', {
        method: 'POST',
        body: {
            title,
            content,
            ...(imageUrl && { imageUrl }),  // ✅ only include if image was uploaded
        },
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

// ─── UNSAVE / UNBOOKMARK A POST ──────────────────────────────────────────────
export const unsavePost = async (postId: string): Promise<SavePostResponse> => {
    return apiRequest<SavePostResponse>(`/api/posts/${postId}/save`, {
        method: 'DELETE',       // ✅ DELETE to unsave
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
export const likePost = async (postId: string): Promise<LikePostResponse> => {
    return apiRequest<LikePostResponse>(`/api/posts/${postId}/like`, {
        method: 'POST',
        requiresAuth: true,
    })
}

// ─── UNLIKE A POST ───────────────────────────────────────────────────────────
export const unlikePost = async (postId: string): Promise<LikePostResponse> => {
    return apiRequest<LikePostResponse>(`/api/posts/${postId}/like`, {
        method: 'DELETE',
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

// ─── GET SINGLE POST ──────────────────────────────────────────────────────────
export const getPost = async (postId: string): Promise<Post> => {
    return apiRequest<Post>(`/api/posts/${postId}`, {
        method: 'GET',
        requiresAuth: true,
    })
}

// // ─── DELETE POST ──────────────────────────────────────────────────────────────
export const deletePost = async (postId: string): Promise<{message:string}> => {
    return apiRequest<{message:string}>(`/api/posts/${postId}`, {
        method: 'DELETE',
        requiresAuth: true,
    })
}
