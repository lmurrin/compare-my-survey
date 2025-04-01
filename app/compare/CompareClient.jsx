"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Input } from "@headlessui/react";
import InputPropertyPriceSelect from "../components/InputPropertyPriceSelect";

import { useSearchParams } from "next/navigation";
import ResultsCards from "../components/compare/ResultsCards";
import CompareHero from "./CompareHero";
import { HomeIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Provide details.',
    description:
      'Tell us the type of survey you want and some details about the property to be surveyed.',
    icon: HomeIcon,
  },
  {
    name: 'Compare now.',
    description: 'Click on Compare and we will find you quotes from trusted surveyors in the area.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Book your survey.',
    description: 'Review the surveyors and find one you like, then book the survey directly with them.',
    icon: CheckIcon,
  },
]

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

  const getOutwardCode = (postcode) => {
    if (!postcode) return "";
  
    const clean = postcode.trim().toUpperCase().replace(/\s+/g, "");
  
    // If it's a full postcode (6–8 characters), extract outward code
    const fullPostcodeMatch = clean.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\d[A-Z]{2}$/);
    if (fullPostcodeMatch) {
      return fullPostcodeMatch[1];
    }
  
    // If it looks like a valid outward code, allow it
    const outwardCodeMatch = clean.match(/^[A-Z]{1,2}\d{1,2}[A-Z]?$/);
    if (outwardCodeMatch) {
      return clean;
    }
  
    // Fallback
    return "";
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    setSearchResults([]);
  
    try {
      const outwardCode = getOutwardCode(formData.propertyLocation);

      console.log(outwardCode)
  
      const queryParams = new URLSearchParams({
        surveyType: formData.surveyType,
        location: outwardCode,
        propertyPrice: formData.propertyPrice,
      }).toString();

      console.log("API Key sent:", process.env.NEXT_PUBLIC_SEARCH_API_KEY);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search?${queryParams}`,{
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_SEARCH_API_KEY,
          },
        }
      );

  
      const result = await response.json();
      const numberOfSurveyors = result.services?.length || 0;
      setSearchResults(result.services || []);

      if (result.services && result.services.length > 0) {
        try {
          const surveyors = result.services
            .filter(service => service.surveyor?.id && service.applicableQuote?.price)
            .map(service => ({
              id: service.surveyor.id,
              quote: parseFloat(service.applicableQuote.price),
            }));

            
            const matchedSurveyType = surveyTypes.find(
              (type) => type.name === formData.surveyType
            );
            
            if (!matchedSurveyType) {
              throw new Error("Invalid survey type selected");
            }            

            const leadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leads`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_SEARCH_API_KEY,
              },
              body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                surveyTypeId: matchedSurveyType.id,
                surveyors: result.services.map((s) => ({
                  id: s.surveyor.id,
                  quote: s.applicableQuote?.price,
                })),
                numberOfSurveyors,
              }),
              
            });
            
      
          const leadData = await leadResponse.json();
      
          if (!leadResponse.ok) {
            console.error('Lead API error response:', leadData);
            throw new Error(leadData.error || 'Failed to create lead');
          }
      
          console.log("Lead successfully created:", leadData.leadId);
        } catch (error) {
          console.error("Error creating lead:", error);
        }
      }
      
  
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
      }, 100);
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
      <CompareHero />
      <div className="mx-auto">
      <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:grid-cols-[1fr_2fr]">

          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600">Find a surveyor</h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Compare now
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                To find and compare local surveyor quotes, simply complete the form.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute left-1 top-1 size-5 text-indigo-600" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-4xl w-full">
          <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-[700px] bg-white rounded-lg py-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-12">
                  <div>
                    <div className="w-full mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="max-w-50 sm:col-span-full">
                        <label
                          htmlFor="propertyLocation"
                          className="block text-base/7 font-medium text-indigo-600"
                        >
                          Property postcode
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="propertyLocation"
                            id="propertyLocation"
                            placeholder="e.g. WC1N 2AA"
                            value={formData.propertyLocation}
                            onChange={handleInputChange}
                            className="text-lg block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label
                          htmlFor="surveyType"
                          className="block text-base/7 font-medium text-indigo-600"
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

                     

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="firstName"
                          className="block text-base/7 font-medium text-indigo-600"
                        >
                          First name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="John"
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
                          className="block text-base/7 font-medium text-indigo-600"
                        >
                          Last name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Smith"
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
                          className="block text-base/7 font-medium text-indigo-600"
                        >
                          Phone
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="Optional"
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
                          className="block text-base/7 font-medium text-indigo-600"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@smith.com"
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
                              required
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
                  <div className="mt-6">
                  <button
                    type="submit"
                    className="cursor-pointer w-full rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                  <p className="mb-8">
                    Showing surveyors offering{" "}
                    <span className="font-semibold text-gray-900">{formData.surveyType}s</span>{" "}
                    in{" "}
                    <span className="font-semibold text-gray-900">{formData.propertyLocation}</span>:
                  </p>


                  <ResultsCards
                    surveyors={searchResults
                      .sort((a, b) => a.applicableQuote.price - b.applicableQuote.price)
                      .map((service) => ({
                        name: service.surveyor.companyName,
                        surveyType: service.surveyType,
                        description: service.surveyor.description,
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
        </div>
      </div>
    </div>

        
    </>
  );
}
