// app/dashboard/page.js
"use client";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardHeading from '../components/dashboard/DashboardHeading';

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect unauthenticated users to login
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>; // Show a loading message while checking the session
  }

    return (
      <div>

        <DashboardHeading
          title={session?.isAdmin ? `Welcome to the admin dashboard` : `Welcome to the dashboard, ${session?.companyName}`}
          showEditButton={false}
          showPublishButton={false}
        />

        {session?.isAdmin && <p>You have admin access.</p>}

      <button onClick={() => signOut()}>Sign Out</button>
    </div>
    );
  }
  