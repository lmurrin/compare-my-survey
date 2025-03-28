"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Input } from "@headlessui/react";
import InputPropertyPriceSelect from "../components/InputPropertyPriceSelect";

import { useSearchParams } from "next/navigation";
import ResultsCards from "../components/compare/ResultsCards";

export default function CompareClient() {
  const [searchResults, setSearchResults] = useState([]);
  const [surveyTypes, setSurveyTypes] = useState([]);
  const [formData, setFormData] = useState({
    surveyType: "",
    propertyLocation: "",
    propertyPrice: 50000,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    agreeToTerms: false,
  });
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const locationFromQuery = searchParams.get("location");
    if (locationFromQuery) {
      setFormData((prev) => ({
        ...prev,
        propertyLocation: locationFromQuery,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchSurveyTypes() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/survey-types`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setSurveyTypes(data);
      } catch (error) {
        console.error("Error loading survey types:", error);
      }
    }

    fetchSurveyTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    setSearchResults([]);

    try {
      const queryParams = new URLSearchParams({
        surveyType: formData.surveyType,
        location: formData.propertyLocation,
        propertyPrice: formData.propertyPrice,
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search?${queryParams}`
      );

      const result = await response.json();
      setSearchResults(result.services || []);

      // ✅ Smooth scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById("search-results");
        if (resultsSection) {
          const yOffset = -200;
          const y =
            resultsSection.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }

        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // small delay to allow render
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Compare Survey Quotes</title>
        <meta
          name="description"
          content="Compare survey quotes from local surveyors"
        />
      </Head>
      <div className="mx-auto">
        <div className="bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-5xl font-semibold tracking-tight  sm:text-7xl">
              Compare Survey Quotes
            </h2>
            <p className="mt-8 text-pretty text-lg font-medium text-gray-100 sm:text-xl/8">
              Instantly find and compare local surveyor quotes online in
              seconds.
            </p>
          </div>
        </div>

        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-[700px] bg-white rounded-lg p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-12">
                  <div className="pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-full">
                        <label
                          htmlFor="surveyType"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Service
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                          <select
                            id="surveyType"
                            name="surveyType"
                            value={formData.surveyType}
                            onChange={handleInputChange}
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-lg text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                          >
                            <option value="" disabled>
                              Select a service...
                            </option>
                            {surveyTypes.map((type) => (
                              <option key={type.id} value={type.name}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="sm:col-span-full w-full">
                        <InputPropertyPriceSelect
                          onChange={handleInputChange}
                          value={formData.propertyPrice}
                        />
                      </div>

                      <div className="sm:col-span-full">
                        <label
                          htmlFor="propertyLocation"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Property postcode
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="propertyLocation"
                            id="propertyLocation"
                            value={formData.propertyLocation}
                            onChange={handleInputChange}
                            className="text-lg block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="firstName"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          First name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            autoComplete="given-name"
                            className="text-lg block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="lastName"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Last name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            autoComplete="family-name"
                            className="text-lg block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label
                          htmlFor="phone"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Phone
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            autoComplete="tel"
                            className="text-lg block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label
                          htmlFor="email"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            autoComplete="email"
                            className="text-lg block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 col-span-full">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id="agreeToTerms"
                              name="agreeToTerms"
                              type="checkbox"
                              checked={formData.agreeToTerms}
                              onChange={handleInputChange}
                              className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                className="opacity-0 group-has-[:checked]:opacity-100"
                                d="M3 8L6 11L11 3.5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                d="M3 7H11"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="text-sm/6">
                          <label
                            htmlFor="agreeToTerms"
                            className="text-gray-900"
                          >
                            I have read and agree to the terms of engagement &
                            privacy policy.
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="submit"
                      className="rounded-md bg-green-600 px-10 py-2 text-m font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
                    >
                      Compare Now
                    </button>
                  </div>
                </div>
              </form>

              {loading && (
                <div className="mt-8 text-center text-gray-500">
                  <div className="animate-spin h-6 w-6 mx-auto mb-2 border-4 border-indigo-600 border-t-transparent rounded-full" />
                  Searching for services...
                </div>
              )}

              {!loading && hasSearched && searchResults.length === 0 && (
                <div className="mt-8 text-center text-gray-500">
                  No surveyors found for the selected criteria.
                </div>
              )}

              {searchResults.length > 0 && (
                <div id="search-results" className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Search Results</h2>

                  <ResultsCards
                    surveyors={searchResults.map((service) => ({
                      name: service.surveyor.companyName,
                      title: `Survey Type: ${service.surveyType} · Description: ${service.surveyor.description}`,
                      role: "Surveyor",
                      email: service.surveyor.email,
                      telephone: service.surveyor.phone,
                      imageUrl: service.surveyor.imageUrl || null,
                      quote: service.applicableQuote,
                    }))}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
