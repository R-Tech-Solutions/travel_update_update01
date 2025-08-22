import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BackendUrl } from "../Backendurl";

const Front = () => {
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // Ref to manage file input
  const updateFileInputRef = useRef(null); // Ref for update file input

  // Cloudinary cloud name must match backend settings
  const CLOUDINARY_CLOUD_NAME = "djbf0hou3";

  // Normalize image URL from backend (Cloudinary or Django media)
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.svg";
    if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
      return img;
    }
    if (typeof img === "object" && img !== null) {
      if (img instanceof File) return URL.createObjectURL(img);
      if (typeof img.url === "string") return getImageUrl(img.url);
      if (typeof img.company_logo === "string") return getImageUrl(img.company_logo);
    }
    if (typeof img === "string") {
      const cleanPath = img.startsWith("/") ? img.substring(1) : img;
      if (cleanPath.startsWith("media/") || cleanPath.startsWith("static/")) {
        return `${BackendUrl}/${cleanPath}`;
      }
      const hasDeliveryPrefix = /^(image|video|raw)\//.test(cleanPath);
      const cloudinaryPath = hasDeliveryPrefix ? cleanPath : `image/upload/${cleanPath}`;
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${cloudinaryPath}`;
    }
    return "/placeholder.svg";
  };

  // Fetch existing company logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/front/`);
        console.log("Fetch logo response:", response.data);
        const items = Array.isArray(response.data) ? response.data : [response.data];
        const withCompanyLogo = items.find((it) => it && it.company_logo);
        if (withCompanyLogo) {
          console.log("Logo image URL:", getImageUrl(withCompanyLogo.company_logo));
        }
        setLogo(withCompanyLogo || null);
      } catch (err) {
        console.error("Error fetching company logo:", err.response || err.message);
        setError("Failed to fetch company logo. Please try again.");
      }
    };
    fetchLogo();
  }, []);

  // Upload company logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    console.log("Upload file selected:", file); // Debug file selection
    if (!file) {
      setError("No file selected. Please choose an image.");
      return;
    }

    // Validate file type and size (e.g., max 5MB)
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("company_logo", file);

    // Log FormData content
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    try {
      const response = await axios.post(
        `${BackendUrl}/api/front/create/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload response:", response.data);
      setLogo(response.data);
      setError("");
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading logo:", err.response || err.message);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.company_logo?.[0] ||
        "Error uploading company logo. Please try again.";
      setError(errorMessage);
    }
  };

  // Update existing company logo
  const handleUpdateLogo = async (e) => {
    const file = e.target.files[0];
    console.log("Update file selected:", file); // Debug file selection
    if (!file) {
      setError("No file selected. Please choose an image.");
      return;
    }
    if (!logo) {
      setError("No existing logo to update.");
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("company_logo", file);

    // Log FormData content
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    try {
      const response = await axios.put(
        `${BackendUrl}/api/front/${logo.id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Update response:", response.data);
      setLogo(response.data);
      setError("");
      // Reset file input
      if (updateFileInputRef.current) {
        updateFileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error updating logo:", err.response || err.message);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.company_logo?.[0] ||
        "Error updating company logo. Please try again.";
      setError(errorMessage);
    }
  };

  // Delete company logo record
  const handleDeleteLogo = async () => {
    if (!logo) {
      setError("No logo to delete.");
      return;
    }

    try {
      await axios.delete(`${BackendUrl}/api/front/${logo.id}/delete/`);
      setLogo(null);
      setError("");
    } catch (err) {
      console.error("Error deleting logo:", err.response || err.message);
      setError(err.response?.data?.detail || "Error deleting company logo.");
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
            ref={fileInputRef} // Attach ref
          />
        </label>
      ) : (
        <div>
          <img
            src={getImageUrl(logo.company_logo)}
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
                ref={updateFileInputRef} // Attach ref
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