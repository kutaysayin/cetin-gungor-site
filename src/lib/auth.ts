/* NextAuth.js yapilandirmasi — Credentials ile email/sifre girisi */
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Sifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve sifre gereklidir");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Gecersiz email veya sifre");
        }

        if (!user.active) {
          throw new Error("Hesabiniz henuz aktif edilmemistir");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Gecersiz email veya sifre");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyName: user.companyName ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.companyName = (user as { companyName?: string }).companyName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { companyName?: string }).companyName = token.companyName as string | undefined;
      }
      return session;
    },
  },
};
