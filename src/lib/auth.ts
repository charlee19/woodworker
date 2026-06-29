import { supabase } from "./supabase";
import { headers } from "next/headers";

export enum Role {
  CUSTOMER = "CUSTOMER",
  CREATOR = "CREATOR",
  ADMIN = "ADMIN",
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
  avatar?: string;
}

/**
 * Gets the current authenticated user from request context (via Supabase or fallback header).
 */
export async function getSessionUser(): Promise<JWTPayload | null> {
  try {
    // 1. Try to read from x-user-session header (immune to iframe cookie blocking)
    try {
      const reqHeaders = await headers();
      const headerVal = reqHeaders.get("x-user-session") || reqHeaders.get("X-User-Session");
      if (headerVal) {
        const decoded = decodeURIComponent(headerVal);
        const parsed = JSON.parse(decoded) as any;
        if (parsed && (parsed.userId || parsed.id) && parsed.email) {
          const uId = parsed.userId || parsed.id;
          return {
            userId: uId,
            email: parsed.email,
            role: parsed.role || Role.CUSTOMER,
            name: parsed.name || "User",
            avatar: parsed.avatar || "",
          };
        }
      }
    } catch (e) {
      // ignore headers check in static rendering
    }

    // 2. Try standard Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (!error && user) {
      return {
        userId: user.id,
        email: user.email!,
        role: (user.user_metadata?.role as Role) || Role.CUSTOMER,
        name: user.user_metadata?.name || "User",
        avatar: user.user_metadata?.avatar || "",
      };
    }
  } catch (error) {
    console.error("[Session extraction error]", error);
  }

  return null;
}
