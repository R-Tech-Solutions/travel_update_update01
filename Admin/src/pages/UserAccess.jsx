import React, { useState, useEffect } from "react";
import { BackendUrl } from "../BackendUrl.jsx"; // Fixed import

const UserAccess = () => {
  const [items, setItems] = useState([{ title: "", description: "", imageFile: null }]);
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [service, setService] = useState({ service_title: "", service_description: "" });
  const [serviceList, setServiceList] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState(null);
  const [serviceSuccess, setServiceSuccess] = useState(false);
  const [serviceEditingId, setServiceEditingId] = useState(null);

  // Cloudinary cloud name must match backend settings
  const CLOUDINARY_CLOUD_NAME = "djbf0hou3";

  // Normalize image URL from backend (Cloudinary or Django media)
  const getImageUrl = (img) => {
    if (!img) {
      console.warn("Image is null or undefined, using fallback");
      return "https://via.placeholder.com/150";
    }
    if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
      return img;
    }
    if (typeof img === "object" && img !== null) {
      if (img instanceof File) return URL.createObjectURL(img);
      if (typeof img.url === "string") return getImageUrl(img.url);
      if (typeof img.image === "string") return getImageUrl(img.image);
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
    console.warn("Image format invalid, using fallback");
    return "https://via.placeholder.com/150";
  };

  // Fetch items and services on mount
  useEffect(() => {
    fetchItems();
    fetchServices();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendUrl}/api/items/`);
      if (!response.ok) throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("Fetch items response:", data);
      const items = Array.isArray(data) ? data : [];
      items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          id: item.id,
          title: item.title,
          image: item.image,
          normalizedUrl: getImageUrl(item.image),
        });
      });
      setItemsList(items);
      setError(null);
    } catch (err) {
      setError("Failed to load items: " + err.message);
      console.error("Item fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setServiceLoading(true);
      const response = await fetch(`${BackendUrl}/api/services/`);
      if (!response.ok) throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("Fetch services response:", data);
      setServiceList(Array.isArray(data) ? data : []);
      setServiceError(null);
    } catch (err) {
      setServiceError("Failed to load services: " + err.message);
      console.error("Service fetch error:", err);
    } finally {
      setServiceLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItems((prevItems) => [
      {
        ...prevItems[0],
        [name]: value,
      },
    ]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected image file:", file);
    if (!file) {
      setError("No file selected. Please choose an image.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (e.g., JPG, PNG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please compress or resize the image using a tool like TinyPNG.");
      return;
    }
    setItems((prevItems) => [
      {
        ...prevItems[0],
        imageFile: file,
      },
    ]);
    setError(null);
  };

  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendUrl}/api/items/${id}/delete/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete item: ${response.status} ${response.statusText}`);
      await fetchItems();
      setSuccess("Item deleted successfully");
      setError(null);
    } catch (err) {
      setError("Failed to delete item: " + err.message);
      console.error("Error deleting item:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setItems([
      {
        title: item.title,
        description: item.description,
        imageFile: null, // Keep imageFile null, existing image is in item.image
      },
    ]);
    setEditingIndex(item.id);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const currentItem = items[0];
    if (!currentItem.title.trim() || !currentItem.description.trim()) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", currentItem.title);
    formData.append("description", currentItem.description);
    if (currentItem.imageFile) {
      formData.append("image", currentItem.imageFile);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    try {
      const response = await fetch(
        editingIndex
          ? `${BackendUrl}/api/items/${editingIndex}/update/`
          : `${BackendUrl}/api/items/create/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error(`Failed to save item: ${response.status} ${response.statusText}`);
      await fetchItems();
      setItems([{ title: "", description: "", imageFile: null }]);
      setEditingIndex(null);
      setSuccess(editingIndex ? "Item updated successfully!" : "Item added successfully!");
    } catch (err) {
      setError("Failed to save item: " + err.message);
      console.error("Error saving item:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceEdit = (item) => {
    setService({ service_title: item.service_title, service_description: item.service_description });
    setServiceEditingId(item.id);
    setServiceError(null);
    setServiceSuccess(false);
  };

  const handleServiceDelete = async (id) => {
    try {
      setServiceLoading(true);
      const response = await fetch(`${BackendUrl}/api/services/${id}/delete/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete service: ${response.status} ${response.statusText}`);
      await fetchServices();
      setServiceSuccess("Service deleted successfully");
      setServiceError(null);
    } catch (err) {
      setServiceError("Failed to delete service: " + err.message);
      console.error("Error deleting service:", err);
    } finally {
      setServiceLoading(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setServiceLoading(true);
    setServiceError(null);
    setServiceSuccess(false);

    if (!service.service_title.trim() || !service.service_description.trim()) {
      setServiceError("Please fill in all required fields.");
      setServiceLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("service_title", service.service_title);
    formData.append("service_description", service.service_description);

    try {
      const response = await fetch(
        serviceEditingId
          ? `${BackendUrl}/api/services/${serviceEditingId}/update/`
          : `${BackendUrl}/api/services/create/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error(`Failed to save service: ${response.status} ${response.statusText}`);
      await fetchServices();
      setService({ service_title: "", service_description: "" });
      setServiceEditingId(null);
      setServiceSuccess(serviceEditingId ? "Service updated successfully!" : "Service added successfully!");
    } catch (err) {
      setServiceError("Failed to save service: " + err.message);
      console.error("Error saving service:", err);
    } finally {
      setServiceLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{editingIndex ? "Edit Item" : "Welcome Page"}</h1>

      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-md">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-md">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md space-y-6 mb-8">
        <div className="border p-4 rounded-md relative">
          <h2 className="text-lg font-semibold mb-4">
            {editingIndex ? `Editing Item ${editingIndex}` : "New Item"}
          </h2>

          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={items[0].title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={items[0].description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
              Photo (JPG, PNG, up to 10MB)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required={!editingIndex}
            />
            {items[0].imageFile && (
              <div className="mt-2">
                <img
                  src={getImageUrl(items[0].imageFile)}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-md"
                  onError={(e) => {
                    console.error("Error loading preview image:", e);
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <p className="mt-2 text-sm text-gray-600">Selected file: {items[0].imageFile.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (editingIndex ? "Updating..." : "Adding...") : editingIndex ? "Update Item" : "Add Item"}
          </button>

          {editingIndex && (
            <button
              type="button"
              onClick={() => {
                setItems([{ title: "", description: "", imageFile: null }]);
                setEditingIndex(null);
                setError(null);
                setSuccess(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Items List</h2>

      {loading && !itemsList.length ? (
        <div className="text-center">Loading items...</div>
      ) : itemsList.length === 0 ? (
        <div className="text-center">No items available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-md shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Title</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Photo</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.title || "No Title"}</td>
                  <td className="px-4 py-2">{item.description || "No Description"}</td>
                  <td className="px-4 py-2">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title || "Item image"}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          console.error(`Error loading image for ${item.title || "item"}:`, e);
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    ) : (
                      <span>No Photo</span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditItem(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Services Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Services Title & Description</h2>
        {serviceError && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-md">{serviceError}</div>
        )}
        {serviceSuccess && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-md">{serviceSuccess}</div>
        )}
        <form onSubmit={handleServiceSubmit} className="bg-white p-6 rounded-md shadow-md space-y-6 mb-8">
          <div className="border p-4 rounded-md relative">
            <h2 className="text-lg font-semibold mb-4">
              {serviceEditingId ? `Editing Service ${serviceEditingId}` : "New Service"}
            </h2>
            <div className="mb-4">
              <label htmlFor="service-title" className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="service-title"
                name="service_title"
                value={service.service_title}
                onChange={handleServiceInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="service-description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="service-description"
                name="service_description"
                value={service.service_description}
                onChange={handleServiceInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                required
              ></textarea>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={serviceLoading}
            >
              {serviceLoading
                ? serviceEditingId
                  ? "Updating..."
                  : "Adding..."
                : serviceEditingId
                ? "Update Service"
                : "Add Service"}
            </button>
            {serviceEditingId && (
              <button
                type="button"
                onClick={() => {
                  setService({ service_title: "", service_description: "" });
                  setServiceEditingId(null);
                  setServiceError(null);
                  setServiceSuccess(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
        <h3 className="text-xl font-bold mb-2">Services List</h3>
        {serviceLoading && !serviceList.length ? (
          <div className="text-center">Loading services...</div>
        ) : serviceList.length === 0 ? (
          <div className="text-center">No services available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceList.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{item.service_title || "No Title"}</td>
                    <td className="px-4 py-2">{item.service_description || "No Description"}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => handleServiceEdit(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleServiceDelete(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccess;