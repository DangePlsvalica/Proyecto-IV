"use client";

import { useSession } from "next-auth/react";

interface UserRole {
    id: string;
    name: string; // "Admin", "Secretaria", etc.
    routes: string[];
}

interface SessionUser {
    id: string;
    email: string;
    name: string;
    role: UserRole | null;
}

export const useCurrentUser = () => {
    const { data: session, status } = useSession();
    const currentUser = session?.user as SessionUser | undefined;

    const currentUserId = currentUser?.id;
    const isAdmin = currentUser?.role?.name === "Admin";
    const isSecretaria = currentUser?.role?.name === "Secretaria";

    return { 
        currentUser,
        currentUserId,
        isAdmin,
        isSecretaria,
        isLoading: status === 'loading',
        isAuthenticated: status === 'authenticated'
    };
};