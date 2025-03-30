"use client";

import DashboardHeading from "@/app/components/dashboard/DashboardHeading";
import SurveyorProfile from "@/app/components/dashboard/SurveyorProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardProfile() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    surveyType: "",
    surveyorServices: [],
    surveyorServiceLocations: [],
    companyName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    logo: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.id) return;

    try {
      const res = await fetch(`/api/surveyors/${session.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update surveyor");

      await fetchSurveyor();

      alert("Profile updated successfully! ✅");
      localStorage.setItem("surveyorFormData", JSON.stringify(formData));
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong while saving.");
    }
  };

  const fetchSurveyor = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/surveyors/${session.id}`);
      if (!res.ok) throw new Error("Failed to fetch surveyor");

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        companyName: data.companyName || "",
      }));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchSurveyor();
    } else {
      const stored = localStorage.getItem("surveyorFormData");
      if (stored) {
        setFormData(JSON.parse(stored));
        setLoading(false);
      }
    }
  }, [session]);

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch(`/api/upload/logo`, {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        logo: data.url,
      }));
    } catch (err) {
      console.error("Logo upload failed:", err);
      alert("Failed to upload logo.");
    }
  };

  return (
    <div>
      <DashboardHeading
        title="Your Profile"
        showEditButton={false}
        showPublishButton={false}
      />

      {loading ? (
        <div className="text-center text-gray-500 py-12">
          <div className="animate-spin h-6 w-6 mx-auto mb-2 border-4 border-indigo-600 border-t-transparent rounded-full" />
          Loading your profile...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <SurveyorProfile
            formData={formData}
            handleInputChange={handleInputChange}
            handleLogoChange={handleLogoChange}
            disabled={loading}
          />

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm/6 font-semibold text-gray-900"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              disabled={loading}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
