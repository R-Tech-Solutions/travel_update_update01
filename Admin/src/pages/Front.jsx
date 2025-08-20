import React, { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "../Backendurl";

const Front = () => {
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");

  // Fetch existing company logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/front/`);
        const items = Array.isArray(response.data) ? response.data : [];
        const withCompanyLogo = items.find((it) => it && it.company_logo);
        setLogo(withCompanyLogo || null);
      } catch (err) {
        console.error("Error fetching company logo:", err);
      }
    };
    fetchLogo();
  }, []);

  // Upload company logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("company_logo", file);

    try {
      const response = await axios.post(
        `${BackendUrl}/api/front/create/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setLogo(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Error uploading company logo");
    }
  };

  // Update existing company logo
  const handleUpdateLogo = async (e) => {
    const file = e.target.files[0];
    if (!file || !logo) return;

    const formData = new FormData();
    formData.append("company_logo", file);

    try {
      const response = await axios.put(
        `${BackendUrl}/api/front/${logo.id}/update/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setLogo(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating company logo");
    }
  };

  // Delete company logo record
  const handleDeleteLogo = async () => {
    if (!logo) return;

    try {
      await axios.delete(`${BackendUrl}/api/front/${logo.id}/delete/`);
      setLogo(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Error deleting company logo");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Company Logo</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {!logo ? (
        <label className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
          Upload Logo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </label>
      ) : (
        <div>
          <img
            src={`${BackendUrl}${logo.company_logo}`}
            alt="Company Logo"
            className="h-24 object-contain mb-3"
          />

          <div className="flex gap-2">
            <label className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">
              Update
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpdateLogo}
              />
            </label>

            <button
              onClick={handleDeleteLogo}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Front;
