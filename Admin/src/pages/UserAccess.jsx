import React, { useState, useEffect } from 'react';

const UserAccess = () => {
  const [items, setItems] = useState([{ title: '', description: '', imageFile: null }]);
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // New state for services title/description
  const [service, setService] = useState({ service_title: '', service_description: '' });
  const [serviceList, setServiceList] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState(null);
  const [serviceSuccess, setServiceSuccess] = useState(false);
  const [serviceEditingId, setServiceEditingId] = useState(null);

  // Fetch items and services on mount
  useEffect(() => {
    fetchItems();
    fetchServices();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/items/');
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItemsList(data);
    } catch (err) {
      setError('Failed to load items: ' + err.message);
    }
  };

  const fetchServices = async () => {
    try {
      // Make sure the endpoint matches your Django backend!
      const response = await fetch('http://127.0.0.1:8000/api/services/');
      if (!response.ok) {
        // Log the actual status for debugging
        throw new Error('Failed to fetch services: ' + response.status + ' ' + response.statusText);
      }
      const data = await response.json();
      setServiceList(data);
    } catch (err) {
      setServiceError('Failed to load services: ' + err.message);
      console.error('Service fetch error:', err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItems(prevItems => [{
      ...prevItems[0],
      [name]: value
    }]);
  };

  const handleFileChange = (event) => {
    setItems(prevItems => [{
      ...prevItems[0],
      imageFile: event.target.files[0]
    }]);
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/items/${id}/delete/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      await fetchItems(); // Refresh the list
      setSuccess('Item deleted successfully');
    } catch (err) {
      setError('Failed to delete item: ' + err.message);
    }
  };

  const handleEditItem = (item) => {
    setItems([{
      title: item.title,
      description: item.description,
      imageFile: null // We'll handle image separately
    }]);
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
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', currentItem.title);
    formData.append('description', currentItem.description);
    if (currentItem.imageFile) {
      formData.append('image', currentItem.imageFile);
    }

    try {
      let response;
      if (editingIndex) {
        // Update existing item
        response = await fetch(`http://127.0.0.1:8000/api/items/${editingIndex}/update/`, {
          method: 'POST',
          body: formData,
        });
      } else {
        // Create new item
        response = await fetch('http://127.0.0.1:8000/api/items/create/', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) throw new Error('Failed to save item');
      
      await fetchItems(); // Refresh the list
      setItems([{ title: '', description: '', imageFile: null }]);
      setEditingIndex(null);
      setSuccess(editingIndex ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (err) {
      setError('Failed to save item: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceEdit = (item) => {
    setService({ service_title: item.service_title, service_description: item.service_description });
    setServiceEditingId(item.id);
    setServiceError(null);
    setServiceSuccess(false);
  };

  const handleServiceDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/services/${id}/delete/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      await fetchServices();
      setServiceSuccess('Service deleted successfully');
    } catch (err) {
      setServiceError('Failed to delete service: ' + err.message);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setServiceLoading(true);
    setServiceError(null);
    setServiceSuccess(false);

    if (!service.service_title.trim() || !service.service_description.trim()) {
      setServiceError('Please fill in all required fields.');
      setServiceLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('service_title', service.service_title);
    formData.append('service_description', service.service_description);

    try {
      let response;
      if (serviceEditingId) {
        response = await fetch(`http://127.0.0.1:8000/api/services/${serviceEditingId}/update/`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('http://127.0.0.1:8000/api/services/create/', {
          method: 'POST',
          body: formData,
        });
      }
      if (!response.ok) throw new Error('Failed to save service');
      await fetchServices();
      setService({ service_title: '', service_description: '' });
      setServiceEditingId(null);
      setServiceSuccess(serviceEditingId ? 'Service updated successfully!' : 'Service added successfully!');
    } catch (err) {
      setServiceError('Failed to save service: ' + err.message);
    } finally {
      setServiceLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editingIndex ? 'Edit Item' : 'Welcome Page'}
      </h1>

      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md space-y-6 mb-8">
        <div className="border p-4 rounded-md relative">
          <h2 className="text-lg font-semibold mb-4">
            {editingIndex ? `Editing Item ${editingIndex}` : 'New Item'}
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
              Photo
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required={!editingIndex} // Only required for new items
            />
            {items[0].imageFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {items[0].imageFile.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (editingIndex ? 'Updating...' : 'Adding...') : (editingIndex ? 'Update Item' : 'Add Item')}
          </button>

          {editingIndex && (
            <button
              type="button"
              onClick={() => {
                setItems([{ title: '', description: '', imageFile: null }]);
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

      {itemsList.length === 0 ? (
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
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">
                    {item.image ? (
                      <img 
                        src={`http://127.0.0.1:8000${item.image}`} 
                        alt={item.title} 
                        className="w-16 h-16 object-cover"
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

      {/* --- New section for services --- */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Services Title & Description</h2>
        {serviceError && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-md">
            {serviceError}
          </div>
        )}
        {serviceSuccess && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-md">
            {serviceSuccess}
          </div>
        )}
        <form onSubmit={handleServiceSubmit} className="bg-white p-6 rounded-md shadow-md space-y-6 mb-8">
          <div className="border p-4 rounded-md relative">
            <h2 className="text-lg font-semibold mb-4">
              {serviceEditingId ? `Editing Service ${serviceEditingId}` : 'New Service'}
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
              {serviceLoading ? (serviceEditingId ? 'Updating...' : 'Adding...') : (serviceEditingId ? 'Update Service' : 'Add Service')}
            </button>
            {serviceEditingId && (
              <button
                type="button"
                onClick={() => {
                  setService({ service_title: '', service_description: '' });
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
        {serviceList.length === 0 ? (
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
                    <td className="px-4 py-2">{item.service_title}</td>
                    <td className="px-4 py-2">{item.service_description}</td>
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
      {/* --- End of new section --- */}
    </div>
  );
};

export default UserAccess;