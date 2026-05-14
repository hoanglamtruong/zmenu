import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "./db";

type DbUser = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: string;
  tenant_id: string | null;
  tenant_slug: string | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const { rows } = await pool.query<DbUser>(
            `SELECT u.id, u.email, u.password_hash, u.full_name, u.role,
                    u.tenant_id, t.slug AS tenant_slug
             FROM users u
             LEFT JOIN tenants t ON t.id = u.tenant_id
             WHERE u.email = $1 AND u.is_active = true`,
            [credentials.email]
          );
          if (rows.length === 0) return null;
          const user = rows[0];
          const ok = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );
          if (!ok) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            role: user.role,
            tenant_id: user.tenant_id,
            tenant_slug: user.tenant_slug,
          };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenant_id = user.tenant_id ?? null;
        token.tenant_slug = user.tenant_slug ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? undefined;
        session.user.role = token.role;
        session.user.tenant_id = token.tenant_id ?? null;
        session.user.tenant_slug = token.tenant_slug ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/vi/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
