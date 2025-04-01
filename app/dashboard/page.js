"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardHeading from "../components/dashboard/DashboardHeading";
import Pagination from "../components/dashboard/Pagination";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(leads.length / itemsPerPage);
  const paginatedLeads = leads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


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

        console.log(session.id)

        const data = await res.json();
        if (res.ok) {
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
    return (
      <div className="text-center text-gray-500 py-12">
      <div className="animate-spin h-6 w-6 mx-auto mb-2 border-4 border-indigo-600 border-t-transparent rounded-full" />
      Loading your leads...
    </div>
  )
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
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fee</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {paginatedLeads.map((lead) => {
                  const fullName = `${lead.firstName} ${lead.lastName}`;
                  const surveyType = lead.survey_type?.name || "—";

                  const surveyorRecord = lead.surveyors?.find(
                    (s) => String(s.id) === String(session?.id)
                  );

                  const yourQuote = surveyorRecord?.lead_surveyors?.quote
                    ? `£${surveyorRecord.lead_surveyors.quote}`
                    : "—";

                  const yourCharge = surveyorRecord?.lead_surveyors?.chargeAmount
                    ? `£${surveyorRecord.lead_surveyors.chargeAmount}`
                    : "—";


                  return (
                    <tr key={`${lead.id}-${lead.email}`}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{fullName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">{lead.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600">{lead.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{surveyType}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{yourQuote}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{yourCharge}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}

                      </td>
                    </tr>
                  );
                })}


                </tbody>
              </table>
              {leads.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={leads.length}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}


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
