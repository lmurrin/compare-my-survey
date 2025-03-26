"use client"

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import DashboardHeading from '@/app/components/dashboard/DashboardHeading'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import EditSurveyorServiceModal from '@/app/components/dashboard/EditSurveyorServiceModal';
import SurveyorProfile from '@/app/components/dashboard/SurveyorProfile';




export default function DashboardSurveyorEdit() {
    const params = useSearchParams();
    const id = params.get('id');
    const [surveyTypes, setSurveyTypes] = useState([]);
    const [formData, setFormData] = useState({
        surveyType: '',
        surveyorServices: [],
        surveyorServiceLocations: [],
        companyName: '',
        email: '',
        phone: '',
        address: '',
        description: '',
      });
    const [loading, setLoading] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

      

    useEffect(() => {
        async function fetchSurveyTypes() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/survey-types`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const data = await response.json();
                setSurveyTypes(data);
            } catch (error) {
                console.error('Error loading survey types:', error);
            }
        }

        fetchSurveyTypes();
    }, []);

  // Fetch surveyor data by ID
  useEffect(() => {
    const fetchSurveyor = async () => {
      try {
        const res = await fetch(`/api/surveyors/${id}`);
        const data = await res.json();

        console.log("Surveyor data:", data);
  
        if (!res.ok) {
          throw new Error(data.error || "Failed to load surveyor");
        }
  
        setFormData(prev => ({
            ...prev,
            companyName: data.companyName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            description: data.description || ""
          }));
          
      } catch (err) {
        console.error("Surveyor fetch error:", err);
      } finally {
        setLoading(false); // ✅ This will now work as it's inside useEffect
      }
    };
  
    if (id) fetchSurveyor();
  }, [id]);

  useEffect(() => {
    const fetchSurveyorServices = async () => {
      try {
        const res = await fetch(`/api/surveyor-services/by-id/${id}`);
        const data = await res.json();
  
        console.log("Surveyor services data:", data);
  
        if (!res.ok) {
          throw new Error(data.error || "Failed to load surveyor services");
        }
  
        setFormData((prev) => ({
          ...prev,
          surveyorServices: data || [],
        }));
      } catch (err) {
        console.error("Surveyor services fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchSurveyorServices();
    }
  }, [id]);
  
  
  
      
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Function to handle the Edit button click
  const handleEditClick = (e, service) => {
    e.preventDefault(); // Prevent any default action
    e.stopPropagation(); // Stop the event from bubbling up
    setSelectedService(service);
    setIsModalOpen(true);
};


// Function to close the modal
const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
};
  

  return (
    <>
    <DashboardHeading
        title="Edit Surveyor"
        showEditButton={false}
        showPublishButton={false}
        />



    <div className="px-0 py-8">
    <SurveyorProfile formData={formData} handleInputChange={handleInputChange} />
    <form>
      <div className="space-y-12">
        

        {/* Surveyor Services Section */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">Your Services</h2>
            <p className="mt-1 text-sm/6 text-gray-600">Set up and manage the services you want to receive leads for.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            

            <div className="sm:col-span-3">
            <label htmlFor="surveyType" className="block text-sm/6 font-medium text-gray-900">Select a service to add</label>
                <div className="mt-2 grid grid-cols-1">
                    <select
                        id="surveyType"
                        name="surveyType"
                        value={formData.surveyType}
                        onChange={handleInputChange}
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                        <option value="" disabled>Select a service...</option>
                        {surveyTypes.map((type) => (
                            <option key={type.id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <div className="col-span-full">
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                Service
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Area
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                <span className="sr-only">Edit</span>
                            </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {formData.surveyorServices.map((service, index) => (
                            <tr key={index}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                {service.surveyType}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {service.status || "Active"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {service.locationBasket} —{" "}
                                {Array.isArray(service.locations) && service.locations.length > 0
                                    ? `${service.locationBasket}`
                                    : "N/A"
                                    }
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <button
                                    onClick={(e) => handleEditClick(e, service)} 
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Edit
                                </button>

                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>

                    </div>
                    </div>
                </div>
                </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
    </div>

    {/* Edit Surveyor Service Modal */}
    {isModalOpen && selectedService && (
            <EditSurveyorServiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                serviceData={selectedService}
            />
        )}

    </>
  )
}
