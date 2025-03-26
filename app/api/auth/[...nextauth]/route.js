import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Surveyor } from "@/models"; // Adjust based on your ORM setup

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Received credentials:", credentials); // Log the credentials
        const user = await Surveyor.findOne({ where: { email: credentials.email } });
      
        if (user) {
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log("Password match:", isPasswordValid); // Log password comparison result
      
          if (isPasswordValid) {
            return {
              id: user.id,
              email: user.email,
              companyName: user.companyName,
              isAdmin: user.isAdmin,
            };
          }
        }
        return null; // Invalid credentials
      }
      ,
    }),
  ],
  pages: {
    error: "/auth/error", // Redirect to a custom error page
  },
  session: {
    strategy: "jwt", // Using JWT strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.companyName = user.companyName;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.companyName = token.companyName;
      session.isAdmin = token.isAdmin;
      return session;
    },
  },
  secret: process.env.JWT_SECRET, // Ensure you have a JWT secret
});

export { handler as GET, handler as POST };
