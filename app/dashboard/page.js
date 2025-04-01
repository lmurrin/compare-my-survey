"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardHeading from "../components/dashboard/DashboardHeading";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/leads", {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_SEARCH_API_KEY,
          },
        });

        const data = await res.json();
        if (res.ok) {
          // Sort leads by createdAt descending (most recent first)
          const sortedLeads = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setLeads(sortedLeads);
        } else {
          console.error("Failed to load leads:", data.error);
        }        
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchLeads();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <p className="text-center text-gray-500 py-10">Loading dashboard...</p>;
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
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Service</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Your Quote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => {
                    const fullName = `${lead.firstName} ${lead.lastName}`;
                    const surveyType = lead.survey_type?.name || "—";

                    // Try to find the current surveyor's quote (if quotes are attached later)
                    // Currently not implemented: placeholder for "quote"
                    const yourQuote = "—";

                    return (
                      <tr key={`${lead.id}-${lead.email}`}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{fullName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">{lead.phone}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">{lead.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{surveyType}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{yourQuote}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!leads.length && (
                <p className="mt-4 text-sm text-gray-500">No leads available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
