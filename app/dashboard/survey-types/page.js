"use client";

import { useEffect, useState } from "react";
import DashboardHeading from "@/app/components/dashboard/DashboardHeading";

export default function DashboardSurveyTypes() {
  const [surveyTypes, setSurveyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveyTypes = async () => {
      try {
        const response = await fetch("/api/survey-types");
        const data = await response.json();

        // If it's an array of arrays (like MySQL2), get the first
        const types = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;
        setSurveyTypes(types);
      } catch (err) {
        console.error("Failed to fetch survey types:", err);
        setError("Failed to load survey types.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyTypes();
  }, []);

  return (
    <>
      <DashboardHeading
        title="Survey Types"
        showEditButton={false}
        showPublishButton={true}
        publishButtonText="Add New"
        publishButtonLink="/dashboard/drafts"
      />

      <div className="px-0 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              {loading ? (
                <div className="text-gray-500 text-sm">Loading...</div>
              ) : error ? (
                <div className="text-red-500 text-sm">{error}</div>
              ) : surveyTypes.length === 0 ? (
                <div className="text-gray-500 text-sm">No survey types found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0">
                        Name
                      </th>
                      <th className="relative py-3 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {surveyTypes.map((surveyType) => (
                      <tr key={surveyType.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {surveyType.name}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {surveyType.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
