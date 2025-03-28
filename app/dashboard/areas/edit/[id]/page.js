"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditAreaPage() {
  const { id: areaId } = useParams();

  const [area, setArea] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [name, setName] = useState("");
  const [totalUserAreas, setTotalUserAreas] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (!areaId) return;

    const fetchData = async () => {
      try {
        const areaRes = await fetch(`/api/areas/${areaId}`);
        const areaData = await areaRes.json();

        setArea(areaData);
        setName(areaData.name);
        setSelectedLocationIds(areaData.locations.map((l) => l.id));

        // ✅ Fetch all areas for this surveyor
        const allAreasRes = await fetch(
          `/api/areas/by-surveyor/${areaData.surveyorId}`
        );
        const allAreas = await allAreasRes.json();
        setTotalUserAreas(allAreas.map((a) => a.id));

        // ✅ Fetch all locations
        const allRes = await fetch(`/api/locations`);
        const all = await allRes.json();
        setAllLocations(all);
      } catch (error) {
        console.error("Failed to fetch area or locations", error);
      }
    };

    fetchData();
  }, [areaId]);

  const toggleLocation = (locId) => {
    setSelectedLocationIds((prev) =>
      prev.includes(locId)
        ? prev.filter((id) => id !== locId)
        : [...prev, locId]
    );
  };

  const handleSave = async () => {
    const res = await fetch(`/api/areas/${areaId}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        locationIds: selectedLocationIds,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Area updated!");
    } else {
      alert("Failed to update area.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this area?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/areas/${areaId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Area deleted!");
        router.push("/dashboard/areas");
      } else {
        const data = await res.json();
        alert(`Failed to delete area: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting area:", error);
      alert("An unexpected error occurred.");
    }
  };

  const isOnlyArea = totalUserAreas.length === 1;

  if (!area) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Edit Area</h2>

      <label className="block mb-2 font-medium">Area Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />

      <label className="block mb-2 font-medium">Select Locations</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {allLocations.map((loc) => (
          <label key={loc.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedLocationIds.includes(loc.id)}
              onChange={() => toggleLocation(loc.id)}
            />
            {loc.name}
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Save Changes
        </button>

        <button
          onClick={handleDelete}
          disabled={isOnlyArea}
          className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 ${
            isOnlyArea ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Delete Area
        </button>
      </div>
      {isOnlyArea && (
        <p className="text-sm text-red-500 mt-2">
          You must have at least one area. This area cannot be deleted.
        </p>
      )}
    </div>
  );
}
