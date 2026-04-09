/* NextAuth tip genisletmeleri */
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      companyName?: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
    companyName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    companyName?: string;
  }
}
