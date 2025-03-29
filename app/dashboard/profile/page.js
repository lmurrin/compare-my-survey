"use client";
import DashboardHeading from "@/app/components/dashboard/DashboardHeading";
import SurveyorProfile from "@/app/components/dashboard/SurveyorProfile";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardProfile() {
    
    const { data: session } = useSession();

    const [formData, setFormData] = useState({
      surveyType: '',
      surveyorServices: [],
      surveyorServiceLocations: [],
      companyName: '',
      email: '',
      phone: '',
      address: '',
      description: '',
      logo: '', 
    });
    

    // Populate form data from storage
    useEffect(() => {
        const storedFormData = localStorage.getItem('surveyorFormData');
        if (storedFormData) {
          setFormData(JSON.parse(storedFormData));
        }
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
      
        if (!session?.id) return;
      
        try {
          const res = await fetch(`/api/surveyors/${session.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
      
          if (!res.ok) throw new Error("Failed to update surveyor");

            await fetchSurveyor();
      
          alert("Profile updated successfully! ✅");
          // Optionally save to localStorage too:
          localStorage.setItem("surveyorFormData", JSON.stringify(formData));
      
        } catch (err) {
          console.error("Update error:", err);
          alert("Something went wrong while saving.");
        }
      };

      const fetchSurveyor = async () => {
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
        }
      };
      
      useEffect(() => {
        if (session) {
          // Fetch latest surveyor info on mount (preferred over localStorage)
          fetchSurveyor();
        } else {
          const stored = localStorage.getItem("surveyorFormData");
          if (stored) {
            setFormData(JSON.parse(stored));
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

      <form onSubmit={handleSubmit}>
        <SurveyorProfile formData={formData} handleInputChange={handleInputChange} handleLogoChange={handleLogoChange} />

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
  );
}