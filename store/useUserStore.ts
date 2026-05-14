// store/useUserStore.ts
import { create } from 'zustand'

interface User {
    id: string
    username: string
    email: string
    profilePicUrl: string
}

interface UserState {
    user: User | null
    setUser: (user: User) => void
    clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
    user: null,

    // ✅ Called after login/signup to save user globally
    setUser: (user) => set({ user }),

    // ✅ Called on logout to clear user data
    clearUser: () => set({ user: null }),
}))