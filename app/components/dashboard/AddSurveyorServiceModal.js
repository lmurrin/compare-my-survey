import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function AddSurveyorServiceModal({
    isOpen,
    onClose,
    onAdd,
    surveyTypes,
    selectedType,
    setSelectedType,
    locationBaskets
}) {
    const [locationBasketId, setLocationBasketId] = useState("");



    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedType && locationBasketId) {
          onAdd(selectedType, locationBasketId); 
          onClose();
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
                  Add New Surveyor Service
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="surveyType" className="block text-sm font-medium text-gray-700">
                      Select a survey type
                    </label>
                    <select
                      id="surveyType"
                      name="surveyType"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>Select a type...</option>
                      {surveyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="locationBasket" className="block text-sm font-medium text-gray-700">
                        Select a location basket
                    </label>
                    <select
                        id="locationBasket"
                        name="locationBasket"
                        value={locationBasketId}
                        onChange={(e) => setLocationBasketId(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                        <option value="" disabled>Select a location...</option>
                        {locationBaskets.map((basket) => (
                            <option key={basket.id} value={basket.id}>
                            {basket.name}
                            </option>
                        ))}
                        </select>
                    </div>


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
                      Add
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
