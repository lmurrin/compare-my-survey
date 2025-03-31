"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import heroImage from "../public/hero-image-house.jpg";
import Image from "next/image";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      router.push(`/compare?location=${encodeURIComponent(location.trim())}`);
    }
  };

  return (
    <div className="bg-white">
      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>

            <div className="relative px-6 py-12 sm:py-40 lg:px-8 lg:py-40 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <h1 className="text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                  Compare local surveyor quotes
                </h1>
                <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                  Enter a postcode below to quickly find and compare quotes from
                  reputable local surveyors.
                </p>
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-x-6">
                  <form onSubmit={handleSubmit} className="mt-2 max-w-md">
                  <div className="flex flex-col sm:flex-row sm:gap-x-4 gap-4">
                      <label htmlFor="email-address" className="sr-only">
                        Postcode
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="location"
                        required
                        placeholder="Enter a postcode to start"
                        autoComplete="location"
                        className="text-lg lg:min-w-100 font-semibold flex-auto rounded-md bg-white px-3.5 py-2.5 text-indigo-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        value={location}
                        onChange={(e) => setLocation(e.target.value.toUpperCase())}

                      />
                      
                      <button
                        type="submit"
                        className="cursor-pointer flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Compare Now
                      </button>
                    </div>
                    <p className="text-sm mt-4 text-pink-500">For the purposes of this demo site, please use a London postcode.</p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            alt=""
            src={heroImage.src}
            className="aspect-[3/2] object-cover lg:aspect-auto lg:size-full"
            
          />
        </div>
      </div>
    </div>
  );
}
