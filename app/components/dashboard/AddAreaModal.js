"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";

export default function AddAreaModal({ isOpen, onClose, handleAddArea }) {
  const [areaName, setAreaName] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!isOpen) {
      setAreaName("");
      setSelectedLocations([]);
      setError(null);
    }
  }, [isOpen]);

  const handleAreaNameChange = (e) => {
    setAreaName(e.target.value);
  };

  const handleLocationChange = (e) => {
    const options = e.target.options;
    const value = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedLocations(value);
  };

  // Fetch all locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`/api/locations`);
        const locationsData = await res.json();

        if (res.ok) {
          setLocations(locationsData);
        } else {
          console.error("Error fetching locations:", locationsData.error);
          setError("Failed to load locations");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setError("Failed to load locations");
      }
    };

    fetchLocations();
  }, []);

  // Handle add area
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!areaName.trim()) {
      setError("Please provide a name for the area.");
      return;
    }

    if (selectedLocations.length === 0) {
      setError("Please select at least one location.");
      return;
    }

    // if (!session.id) {
    //     setError("User session not found. Please log in again.");
    //     return;
    //   }

    console.log(selectedLocations);
    console.log(`Session: ${session.id}`);

    try {
      const res = await fetch("/api/areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: areaName.trim(),
          locationIds: selectedLocations.map((id) => Number(id)),
          surveyorId: session.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error adding area");
        return;
      }

      handleAddArea(data.id);
      onClose();
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while creating the area");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Area
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="areaName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Area Name
                    </label>
                    <input
                      type="text"
                      id="areaName"
                      name="areaName"
                      value={areaName}
                      onChange={handleAreaNameChange}
                      required
                      className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="locations"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Select Locations
                    </label>
                    <select
                      id="locations"
                      name="locations"
                      multiple
                      value={selectedLocations}
                      onChange={handleLocationChange}
                      required
                      className="p-2 min-h-40 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {locations?.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                    {locations?.length === 0 && (
                      <p className="mt-1 text-sm text-red-500">
                        No locations available. Create locations first.
                      </p>
                    )}
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                    >
                      Add Area
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
