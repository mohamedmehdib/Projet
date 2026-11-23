"use client";

import { User, UserRole } from "@/types/schema";

const AUTH_USER_KEY = "auth_user";
const AUTH_TOKEN_KEY = "auth_token";

export type AuthUser = User | null;

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getSession(): AuthUser {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getUserRole(): UserRole | null {
  const user = getSession();
  return user ? user.role : null;
}

export function roleRedirectPath(role: UserRole): string {
  return "/dashboard";
}

export function isAuthorizedForDashboard(role: UserRole): boolean {
  return true;
}

export function isAuthorizedForAdmin(role: UserRole): boolean {
  return role === "SuperAdmin";
}
