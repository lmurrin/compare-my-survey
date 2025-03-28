"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditSurveyorService() {
  const { id } = useParams();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [active, setActive] = useState(false);
  const [quotes, setQuotes] = useState([]);

  const PROPERTY_BANDS = [
    { min: 0, max: 99999, label: "Up to £99,999" },
    { min: 100000, max: 199999, label: "£100,000 - £199,999" },
    { min: 200000, max: 299999, label: "£200,000 - £299,999" },
    { min: 300000, max: 399999, label: "£300,000 - £399,999" },
    { min: 400000, max: 499999, label: "£400,000 - £499,999" },
    { min: 500000, max: 599999, label: "£500,000 - £599,999" },
    { min: 600000, max: 699999, label: "£600,000 - £699,999" },
    { min: 700000, max: 799999, label: "£700,000 - £799,999" },
    { min: 800000, max: 899999, label: "£800,000 - £899,999" },
    { min: 900000, max: 999999, label: "£900,000 - £999,999" },
    { min: 1000000, max: 1099999, label: "£1m - £1.09m" },
    { min: 1100000, max: 1199999, label: "£1.1m - £1.19m" },
    { min: 1200000, max: 1299999, label: "£1.2m - £1.29m" },
    { min: 1300000, max: 1399999, label: "£1.3m - £1.39m" },
    { min: 1400000, max: 1499999, label: "£1.4m - £1.49m" },
    { min: 1500000, max: 1999999, label: "£1.5m - £1.99m" },
    { min: 2000000, max: 999999999, label: "£2m+" },
  ];

  useEffect(() => {
    if (!id) return;

    console.log("params id:", id);

    const fetchData = async () => {
      const serviceRes = await fetch(`/api/surveyor-services/${id}`);
      const serviceData = await serviceRes.json();
      setService(serviceData);
      setSelectedAreaId(serviceData.locationBasketId);
      setActive(serviceData.active);
      // Pre-fill all bands with defaults, then override with existing values
      const prefilledQuotes = PROPERTY_BANDS.map((band) => {
        const existing = serviceData.quotes?.find(
          (q) =>
            q.propertyMinValue === band.min && q.propertyMaxValue === band.max
        );

        return {
          propertyMinValue: band.min,
          propertyMaxValue: band.max,
          price: existing?.price || "",
        };
      });

      setQuotes(prefilledQuotes);

      // ✅ Only call this after serviceData is available
      const areasRes = await fetch(
        `/api/areas/by-surveyor/${serviceData.surveyorId}`
      );
      const areas = await areasRes.json();
      setAreas(areas);
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    const updatedQuotes = quotes.map((q) => ({
      ...q,
      price: q.price === "" ? null : parseFloat(q.price),
    }));

    const res = await fetch(`/api/surveyor-services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationBasketId: selectedAreaId,
        active,
        quotes: updatedQuotes,
      }),
    });

    if (res.ok) {
      alert("Service updated");
      router.push("/dashboard/services");
    } else {
      alert("Error updating service");
    }
  };

  if (!service) return <div>Loading...</div>;

  return (
    <>
      <div className="p-4 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          Edit Service {service?.surveyType || ""}
        </h2>

        <label className="block mb-2 font-medium">Assigned Area</label>
        <select
          value={selectedAreaId}
          onChange={(e) => setSelectedAreaId(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select an area</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active
        </label>

        <h3 className="text-lg font-semibold mt-6 mb-2">Quotes</h3>
        <p className="pt-2 pb-8">
          Enter your quotes for this service against each property value.
        </p>

        <div className="space-y-4">
          {PROPERTY_BANDS.map((band) => {
            const existing = quotes.find(
              (q) =>
                q.propertyMinValue === band.min &&
                q.propertyMaxValue === band.max
            );

            return (
              <div
                key={`${band.min}-${band.max}`}
                className="flex items-center justify-start gap-4"
              >
                <label className="text-sm font-medium text-gray-700 min-w-44">
                  {band.label}
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={existing?.price === 0 ? 0 : existing?.price || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : parseFloat(e.target.value);
                    setQuotes((prevQuotes) =>
                      prevQuotes.map((q) =>
                        q.propertyMinValue === band.min &&
                        q.propertyMaxValue === band.max
                          ? { ...q, price: value }
                          : q
                      )
                    );
                  }}
                  className="w-full max-w-[150px] border border-gray-300 rounded px-3 py-2"
                />
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSave}
          className="mt-8 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </>
  );
}
