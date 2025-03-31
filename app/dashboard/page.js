// app/dashboard/page.js
"use client";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardHeading from '../components/dashboard/DashboardHeading';

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const leads = [
    { name: 'Lindsay Walton', service: 'Building Survey', phone:"01234567890", email: 'lindsay.walton@example.com', quote: '£775' },
    { name: 'John Smith', service: 'Homebuyer Report', phone:"01234567890", email: 'john.smith@example.com', quote: '£625' },
    { name: 'Jane Clark', service: 'Homebuyer Report', phone:"01234567890", email: 'jane.clark@example.com', quote: '£675' },
  ]

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
          title={session?.isAdmin ? `Welcome to the admin dashboard` : `Welcome, ${session?.companyName}`}
          showEditButton={false}
          showPublishButton={false}
        />

        {session?.isAdmin && <p>You have admin access.</p>}

        <div className="py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-lg font-semibold text-gray-900">Latest Leads</h1>
              <p className="mt-2 text-sm text-gray-600">
                Your latest leads are below. After 10 days, all personal details will be permanently deleted automatically. Please ensure you contact the lead promptly.
              </p>
            </div>
          
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Phone
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Service
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Your quote
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.email}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {lead.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">{lead.phone}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">{lead.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.service}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.quote}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-sm text-gray-500">Note: This content is automatically generated for the purposes of the demo site.</p>

              </div>
            </div>
          </div>
        </div>
    </div>
    );
  }
  