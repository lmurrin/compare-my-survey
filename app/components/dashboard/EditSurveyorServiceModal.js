"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Switch } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function EditSurveyorServiceModal({ isOpen, onClose, serviceData }) {
  const router = useRouter();
  const [locationBaskets, setLocationBaskets] = useState([]);
  const [formData, setFormData] = useState({
    locationBasketId: "",
    active: true,
  });

  useEffect(() => {
    if (serviceData) {
      setFormData({
        locationBasketId: serviceData.locationBasketId,
        active: serviceData.active,
      });
    }
  }, [serviceData]);

  useEffect(() => {
    const fetchLocationBaskets = async () => {
      if (serviceData && serviceData.surveyorId) {
        const res = await fetch(`/api/areas/by-surveyor/${serviceData.surveyorId}`);
        const data = await res.json();
        setLocationBaskets(data);
      }
    };
    if (serviceData) {
      fetchLocationBaskets();
    }
  }, [serviceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to update surveyor service
    await fetch(`/api/surveyor-services/${serviceData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    onClose();
    setFormData({ locationBasketId: "", active: true });
  };

  if (!isOpen || !serviceData) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Edit Surveyor Service
            </Dialog.Title>
            <button onClick={onClose}>
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="locationBasketId"
                className="block text-sm font-medium text-gray-700"
              >
                Area
              </label>
              <div className="flex items-center gap-2 mt-1">
                <select
                  id="locationBasketId"
                  name="locationBasketId"
                  value={formData.locationBasketId}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select area...</option>
                  {locationBaskets.map((basket) => (
                    <option key={basket.id} value={basket.id}>
                      {basket.name}
                    </option>
                  ))}
                </select>
                {formData.locationBasketId && (
                  <a
                    href={`/dashboard/areas/edit/${formData.locationBasketId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Edit areas
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Status:</span>
              <Switch
                checked={formData.active}
                onChange={handleToggle}
                className={`${
                  formData.active ? "bg-indigo-600" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    formData.active ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="mt-6 text-right">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}