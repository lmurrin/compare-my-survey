"use client";

import DashboardHeading from "@/app/components/dashboard/DashboardHeading";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddSurveyorServiceModal from "@/app/components/dashboard/AddSurveyorServiceModal";

export default function DashboardServices() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [surveyTypes, setSurveyTypes] = useState([]);
    const [services, setServices] = useState([]);
    const availableSurveyTypes = surveyTypes.filter(
        (type) => !services.some((service) => service.surveyTypeId === type.id)
      );
    const [locationBasketId, setLocationBasketId] = useState("");

      

    const fetchServices = async (surveyorId) => {
        try {
            const response = await fetch(`/api/surveyor-services/by-id/${session.id}`);
            const data = await response.json();
            setServices(Array.isArray(data) ? data : [data]);
            console.log(data[0]);
        } catch (err) {
            console.error("Failed to fetch services:", err);
            setError("Failed to load services.");
        } finally {
            setLoading(false);
        }
    } 

    useEffect(() => {
        fetch("/api/survey-types")
          .then((res) => res.json())
          .then(setSurveyTypes)
          .catch((err) => console.error("Failed to fetch survey types", err));
      }, []);
      
      const handleAddService = async (surveyTypeId, locationBasketId) => {
        if (!session?.id) return;
      
        try {
          const res = await fetch("/api/surveyor-services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              surveyorId: session.id,
              surveyTypeId,
              locationBasketId,
            }),
          });
      
          const result = await res.json();
      
          if (!res.ok) {
            alert(result.error || "Failed to add service");
            return;
          }
      
          await fetchServices(session.id); // refresh list
          alert("Service added ✅");
        } catch (error) {
          console.error("Error adding service:", error);
        }
      };
      
      

    useEffect(() => {
        if (session?.id) {
          fetchServices(session.id); 
        }
      }, [session]);

      const handleEdit = (service) => {
        setSelectedService(service);       // set the service you're editing
        setIsModalOpen(true);              // open the modal
      };
      
      const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
      };

      const [locationBaskets, setLocationBaskets] = useState([]);

        const openModal = async () => {
        try {
            const res = await fetch(`/api/location-baskets/by-surveyor/${session.id}`);
            const baskets = await res.json();
            setLocationBaskets(baskets);
            setSelectedType("");
            setLocationBasketId(""); // clear selection
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching location baskets:", error);
        }
        };

      

    return  (
        <>
        <DashboardHeading 
        title="Services" 
        description="Add the services you offer to your profile."
        showEditButton={false}
        showPublishButton={false}
          />



          <div className="px-0 sm:px-6 lg:px-8">
            
        <div className="mt-8 flow-root">
            
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 cursor-pointer"
                >
                Add New Service
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
                        Service
                      </th>
                      
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Area
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                      <th className="relative py-3 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {service.surveyType}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.locationBasket}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.active ? "Active" : "Inactive"}</td>
                        
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                            onClick={() => handleEdit(service)}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                            >
                            Edit<span className="sr-only">, {service.companyName}</span>
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
      </div>
      <AddSurveyorServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddService}
        surveyTypes={availableSurveyTypes}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        locationBasketId={locationBasketId}
        setLocationBasketId={setLocationBasketId}
        locationBaskets={locationBaskets} 
        />



      </>
    )
}