import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Surveyor } from '@/models';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await Surveyor.findOne({ where: { email } });

        if (user && bcrypt.compareSync(password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            companyName: user.companyName,
            isAdmin: user.isAdmin,
            phone: user.phone,
            address: user.address,
            description: user.description,
            balance: user.balance,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
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
        token.balance = user.balance;
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
      session.balance = token.balance;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
