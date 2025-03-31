import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Surveyor } from '@/models/Surveyor';


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        
        // Fetch the user by email from the database
        const user = await Surveyor.findOne({ where: { email } });
        
        // Check if the user exists and if the password matches
        if (user && bcrypt.compareSync(password, user.password)) {
          // Return user details if password matches
          return {
            id: user.id,
            email: user.email,
            companyName: user.companyName,
            isAdmin: user.isAdmin,
            phone: user.phone,
            address: user.address,
            description: user.description,
          };
        }

        // Return null for invalid credentials
        return null;
      },
    }),
  ],
  pages: {
    error: '/auth/error', // Redirect to a custom error page on failure
  },
  session: {
    strategy: 'jwt', // Use JWT session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.companyName = user.companyName;
        token.isAdmin = user.isAdmin;
        token.phone = user.phone;
        token.address = user.address;
        token.description = user.description;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.companyName = token.companyName;
      session.isAdmin = token.isAdmin;
      session.phone = token.phone;
      session.address = token.address;
      session.description = token.description;
      return session;
    },
  },
  secret: process.env.JWT_SECRET, // Ensure you have a JWT secret
});

export { handler as GET, handler as POST };
