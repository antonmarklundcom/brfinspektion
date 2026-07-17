import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "OWNER" | "PARTNER";
    partnerId: string | null;
  }

  interface Session {
    user: {
      role: "OWNER" | "PARTNER";
      partnerId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "OWNER" | "PARTNER";
    partnerId: string | null;
  }
}
