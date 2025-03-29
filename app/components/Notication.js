"use client";

import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function Notification() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("notificationDismissed");
    if (!dismissed) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("notificationDismissed", "true");
  };

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end justify-start px-4 py-6 sm:items-start sm:justify-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition show={show}>
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-900 shadow-lg ring-1 ring-black/5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
            <div className="p-4">
              <div className="flex items-start">
                <div className="shrink-0">
                  <ExclamationCircleIcon
                    aria-hidden="true"
                    className="size-6 text-amber-400"
                  />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-m font-medium text-white">
                    This site is under development
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    This site is a work in progress, and some features are not working yet.
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    You can test the search feature using postcodes
                    &quot;DA4&quot; &amp; &quot;BR1&quot;. This will return comparison results.
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    Feel free to create an account and log in to set up your fake surveying business, services, areas, and quotes.
                  </p>
                </div>
                <div className="ml-4 flex shrink-0">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex rounded-md bg-black text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
