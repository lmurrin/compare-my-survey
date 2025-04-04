"use client";

import { useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function SuccessAlert({ message }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="rounded-md bg-green-50 p-4 shadow-sm mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <button
            type="button"
            className="inline-flex rounded-md bg-green-50 text-green-700 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            onClick={() => setVisible(false)}
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
