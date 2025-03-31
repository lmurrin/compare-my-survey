"use client";

import DashboardHeading from "@/app/components/dashboard/DashboardHeading";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddAreaModal from "@/app/components/dashboard/AddAreaModal";
import { useRouter } from "next/navigation";
import EmptyPlaceholder from "@/app/components/EmptyPlaceholder";

export default function DashboardAreas() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationBaskets, setLocationBaskets] = useState([]);

  const router = useRouter();

  // Fetch location baskets for the current surveyor
  useEffect(() => {
    const fetchLocationBaskets = async () => {
      try {
        const res = await fetch(`/api/areas/by-surveyor/${session.id}`);
        const baskets = await res.json();

        if (res.ok) {
          setLocationBaskets(baskets);
        } else {
          console.error("Error fetching location baskets:", baskets);
        }
      } catch (error) {
        console.error("Error fetching location baskets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.id) {
      fetchLocationBaskets();
    }
  }, [session?.id]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Add this inside your DashboardAreas component
const handleAddArea = async (newAreaId) => {
  try {
    const res = await fetch(`/api/areas/by-surveyor/${session.id}`);
    if (!res.ok) throw new Error("Failed to fetch updated areas");

    const updatedAreas = await res.json();
    setLocationBaskets(updatedAreas);
  } catch (err) {
    console.error("Error reloading areas:", err);
    setError("Failed to reload areas after adding.");
  }
};


  return (
    <>
      <DashboardHeading
        title="Areas"
        description="Areas are groups of postcodes where you'd like to receive leads. By assigning an area to a service, you'll begin receiving leads for that service from all postcodes within the selected area."
        showEditButton={false}
        showPublishButton={false}
      />

{loading ? (
      <div className="text-center text-gray-500 py-12">
        <div className="animate-spin h-6 w-6 mx-auto mb-2 border-4 border-indigo-600 border-t-transparent rounded-full" />
        Loading your areas...
      </div>
    ) : locationBaskets.length ? (<div className="px-0 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 cursor-pointer"
            >
              Add Area
            </button>
            <div className="inline-block min-w-full py-2 align-middle">
              {loading ? (
                <div className="text-gray-500 text-sm">Loading...</div>
              ) : error ? (
                <div className="text-red-500 text-sm">{error}</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0">
                        Area Name
                      </th>

                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Locations
                      </th>
                      <th className="relative py-3 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {locationBaskets.map((locationBasket) => (
                      <tr key={locationBasket.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {locationBasket.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {locationBasket.locations?.length > 0 ? (
                            <>
                              {locationBasket.locations
                                .slice(0, 3)
                                .map((loc) => loc.name)
                                .join(", ")}
                              {locationBasket.locations.length > 3 && (
                                <span className="text-gray-400">
                                  {" "}
                                  +{locationBasket.locations.length - 3} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 italic">
                              No locations
                            </span>
                          )}
                        </td>

                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/areas/edit/${locationBasket.id}`
                              )
                            }
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          >
                            Edit
                            <span className="sr-only">
                              , {locationBasket.name}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
          </div>
        </div>
      </div> ) : (
      <EmptyPlaceholder
        title="No areas yet"
        description="Create an area to assign to your services."
        buttonText="Add Area"
        onClick={() => setIsModalOpen(true)}
      />
    )}
      
      {/* AddAreasModal */}
      <AddAreaModal
  isOpen={isModalOpen}
  onClose={closeModal}
  handleAddArea={handleAddArea}
/>


    </>
  );
}
