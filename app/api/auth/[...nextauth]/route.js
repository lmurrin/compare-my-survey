export const dynamic = 'force-dynamic';

import NextAuth from 'next-auth';

const handler = async (...args) => {
  const { authOptions } = await import('@/lib/authOptions');
  return NextAuth(authOptions)(...args);
};

export { handler as GET, handler as POST };
