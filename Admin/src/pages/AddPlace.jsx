"use client";

import { useState, useEffect } from "react";
import { Eye, Trash2, Edit, Plus, X } from "lucide-react";
import axios from "axios";

// Reusable UI Components
const Button = ({
  children,
  onClick,
  className,
  variant = "default",
  size = "default",
  disabled = false,
  type = "button",
}) => {
  const variantClasses = {
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100",
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    lg: "text-base px-4 py-3",
    icon: "p-1",
    default: "text-sm px-3 py-2",
  };

  return (
    <button
      type={type}
      className={`rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
        ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({
  id,
  name,
  value,
  onChange,
  className,
  placeholder,
  type = "text",
  readOnly = false,
}) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
      ${readOnly ? "bg-gray-50" : ""} 
      ${className || ""}`}
  />
);

const Label = ({ htmlFor, children, className }) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium text-gray-700 mb-1 ${
      className || ""
    }`}
  >
    {children}
  </label>
);

const Textarea = ({
  id,
  name,
  value,
  onChange,
  rows = 3,
  className,
  readOnly = false,
}) => (
  <textarea
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    rows={rows}
    readOnly={readOnly}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
      ${readOnly ? "bg-gray-50" : ""} 
      ${className || ""}`}
  />
);

const Select = ({ name, value, onValueChange, children }) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
);

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const PlaceFormSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const ArrayInputManager = ({
  items,
  onAddItem,
  onRemoveItem,
  onChangeItem,
  placeholderPrefix = "Item",
  addButtonText = "Add Item",
}) => (
  <div>
    {items.map((item, index) => (
      <div key={index} className="flex items-center mb-2">
        <Input
          type="text"
          value={item}
          onChange={(e) => onChangeItem(index, e.target.value)}
          placeholder={`${placeholderPrefix} ${index + 1}`}
          className="flex-1"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(index)}
          className="ml-2 text-red-500"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onAddItem}
      className="mt-2"
    >
      <Plus className="h-4 w-4 mr-2" />
      {addButtonText}
    </Button>
  </div>
);

const PhotoUploader = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
  onPhotoChange,
}) => (
  <div>
    {photos.map((photo, index) => (
      <div key={index} className="mb-2 flex items-center">
        <div className="flex-1 flex items-center">
          {photo && (
            <div className="w-12 h-12 mr-2 border rounded overflow-hidden">
              <img
                src={
                  photo instanceof File
                    ? URL.createObjectURL(photo)
                    : "/placeholder.svg?height=48&width=48"
                }
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Input
            type="file"
            onChange={(e) =>
              e.target.files?.[0] && onPhotoChange(index, e.target.files[0])
            }
            className="flex-1"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemovePhoto(index)}
          className="ml-2 text-red-500"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onAddPhoto}
      className="mt-2"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Photo
    </Button>
  </div>
);

// Helper: get image URL for preview
const getImageUrl = (file) =>
  file
    ? file instanceof File
      ? URL.createObjectURL(file)
      : file.url || "/placeholder.svg?height=200&width=300"
    : "/placeholder.svg?height=200&width=300";

// Main Component
function AddPlace() {
  // --- State ---
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);

  // Selected place for view/edit
  const [selectedPlace, setSelectedPlace] = useState(null);

  // New place form state
  const [newPlace, setNewPlace] = useState({
    title: "",
    subtitle: "",
    price: "",
    about_place: "",
    place_type: "",
    main_image: null,
    sub_images: [],
    highlights: [],
    includeText: [],
    excludeText: [],
  });

  // --- CRUD Functions ---

  // Fetch all places
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/places/");
      setPlaces(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Add new place
  const handleAddPlace = async () => {
    if (
      !newPlace.title ||
      !newPlace.subtitle ||
      !newPlace.place_type ||
      !newPlace.price
    )
      return;

    try {
      setLoading(true);
      const formData = new FormData();

      // Append text fields
      formData.append("title", newPlace.title);
      formData.append("subtitle", newPlace.subtitle);
      // Ensure price is sent as a number if not empty
      formData.append("price", newPlace.price === '' ? '' : Number(newPlace.price));
      formData.append("about_place", newPlace.about_place);
      formData.append("place_type", newPlace.place_type);
      formData.append("tour_highlights", JSON.stringify(newPlace.highlights));
      formData.append("include", JSON.stringify(newPlace.includeText));
      formData.append("exclude", JSON.stringify(newPlace.excludeText));

      // Send main_image as JSON with base64 url
      formData.append(
        "main_image",
        JSON.stringify(newPlace.main_image ? newPlace.main_image : {})
      );

      // Send sub_images as array of base64 objects
      formData.append(
        "sub_images",
        JSON.stringify(
          newPlace.sub_images.filter(Boolean).map((img) =>
            img && img.url ? img : { url: "" }
          )
        )
      );

      await axios.post("http://127.0.0.1:8000/api/places/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchPlaces();
      setShowAdd(false);
      setNewPlace({
        title: "",
        subtitle: "",
        price: "",
        about_place: "",
        place_type: "",
        main_image: null,
        sub_images: [],
        highlights: [],
        includeText: [],
        excludeText: [],
      });
    } catch (err) {
      setError(err.message);
      console.error("Error details:", err.response?.data); // Log detailed error
    } finally {
      setLoading(false);
    }
  };

  // Edit place
  const handleEditPlace = async () => {
    if (!selectedPlace) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", selectedPlace.title);
      formData.append("subtitle", selectedPlace.subtitle);
      formData.append("price", selectedPlace.price);
      formData.append("about_place", selectedPlace.about_place);
      formData.append("place_type", selectedPlace.place_type);
      if (selectedPlace.main_image)
        formData.append("main_image", selectedPlace.main_image);
      selectedPlace.sub_images.forEach(
        (img) => img && formData.append("sub_images", img)
      );
      formData.append("highlights", JSON.stringify(selectedPlace.highlights));
      formData.append("includeText", JSON.stringify(selectedPlace.includeText));
      formData.append("excludeText", JSON.stringify(selectedPlace.excludeText));
      await axios.put(
        `http://127.0.0.1:8000/api/places/${selectedPlace.id}/update/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      fetchPlaces();
      setShowEdit(false);
      setSelectedPlace(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete place
  const handleDeletePlace = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://127.0.0.1:8000/api/places/${id}/delete/`);
      fetchPlaces();
      setShowView(false);
      setShowEdit(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPlace((prev) => ({
        ...prev,
        main_image: { url: reader.result },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlace((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditFileChange = (e) => {
    if (e.target.files?.[0])
      setSelectedPlace((prev) => ({ ...prev, main_image: e.target.files[0] }));
  };

  // Array fields for add
  const handleArrayFieldChange = (field, index, value) => {
    setNewPlace((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };
  const handleAddArrayFieldItem = (field) => {
    setNewPlace((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };
  const handleRemoveArrayFieldItem = (field, index) => {
    setNewPlace((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Array fields for edit
  const handleEditArrayFieldChange = (field, index, value) => {
    setSelectedPlace((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };
  const handleEditAddArrayFieldItem = (field) => {
    setSelectedPlace((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };
  const handleEditRemoveArrayFieldItem = (field, index) => {
    setSelectedPlace((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Photo handlers for add
  const handleAddPhoto = () =>
    setNewPlace((prev) => ({
      ...prev,
      sub_images: [...(prev.sub_images || []), null],
    }));
  const handleRemovePhoto = (index) =>
    setNewPlace((prev) => ({
      ...prev,
      sub_images: prev.sub_images.filter((_, i) => i !== index),
    }));
  const handlePhotoChange = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPlace((prev) => {
        const updated = [...prev.sub_images];
        updated[index] = { url: reader.result };
        return { ...prev, sub_images: updated };
      });
    };
    reader.readAsDataURL(file);
  };

  // Photo handlers for edit
  const handleEditAddPhoto = () =>
    setSelectedPlace((prev) => ({
      ...prev,
      sub_images: [...(prev.sub_images || []), null],
    }));
  const handleEditRemovePhoto = (index) =>
    setSelectedPlace((prev) => ({
      ...prev,
      sub_images: prev.sub_images.filter((_, i) => i !== index),
    }));
  const handleEditPhotoChange = (index, file) =>
    setSelectedPlace((prev) => {
      const updated = [...prev.sub_images];
      updated[index] = file;
      return { ...prev, sub_images: updated };
    });
  const AddModal = () =>
    showAdd && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <h2 className="text-xl font-bold mb-4">Add New Place</h2>
          {/* ...existing code for Add form fields, use newPlace state and handlers... */}
          <PlaceFormSection title="Basic Information">
            {/* ...existing code... */}
            <div>
              <Label htmlFor="title">Place Name</Label>
              <Input
                id="title"
                name="title"
                value={newPlace.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">City</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={newPlace.subtitle}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="place_type">Category</Label>
              <Select
                name="place_type"
                value={newPlace.place_type}
                onValueChange={(value) =>
                  setNewPlace((prev) => ({ ...prev, place_type: value }))
                }
              >
                <SelectItem value="">Select Category</SelectItem>
                <SelectItem value="trending">Trending Places</SelectItem>
                <SelectItem value="adventure">Adventure Places</SelectItem>
                <SelectItem value="honeymoon">Honeymoon Places</SelectItem>
                <SelectItem value="beach">Beach Places</SelectItem>
                <SelectItem value="historical">Historical Places</SelectItem>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                value={newPlace.price}
                onChange={handleInputChange}
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Description">
            <div>
              <Label htmlFor="about_place">About Place</Label>
              <Textarea
                id="about_place"
                name="about_place"
                value={newPlace.about_place}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Media">
            <div>
              <Label htmlFor="main_image">Main Photo</Label>
              <div className="flex items-center">
                {newPlace.main_image && (
                  <div className="w-16 h-16 mr-2 border rounded overflow-hidden">
                    <img
                      src={getImageUrl(newPlace.main_image)}
                      alt="Main"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  id="main_image"
                  type="file"
                  onChange={handleFileChange}
                />
               
              </div>
            </div>
            <div>
              <Label>Additional Photos</Label>
              <PhotoUploader
                photos={newPlace.sub_images}
                onAddPhoto={handleAddPhoto}
                onRemovePhoto={handleRemovePhoto}
                onPhotoChange={handlePhotoChange}
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Features">
            <div>
              <Label>Highlights</Label>
              <ArrayInputManager
                items={newPlace.highlights}
                onAddItem={() => handleAddArrayFieldItem("highlights")}
                onRemoveItem={(index) =>
                  handleRemoveArrayFieldItem("highlights", index)
                }
                onChangeItem={(index, value) =>
                  handleArrayFieldChange("highlights", index, value)
                }
                placeholderPrefix="Highlight"
                addButtonText="Add Highlight"
              />
            </div>
            <div>
              <Label>Include</Label>
              <ArrayInputManager
                items={newPlace.includeText}
                onAddItem={() => handleAddArrayFieldItem("includeText")}
                onRemoveItem={(index) =>
                  handleRemoveArrayFieldItem("includeText", index)
                }
                onChangeItem={(index, value) =>
                  handleArrayFieldChange("includeText", index, value)
                }
                placeholderPrefix="Include item"
                addButtonText="Add Include"
              />
            </div>
            <div>
              <Label>Exclude</Label>
              <ArrayInputManager
                items={newPlace.excludeText}
                onAddItem={() => handleAddArrayFieldItem("excludeText")}
                onRemoveItem={(index) =>
                  handleRemoveArrayFieldItem("excludeText", index)
                }
                onChangeItem={(index, value) =>
                  handleArrayFieldChange("excludeText", index, value)
                }
                placeholderPrefix="Exclude item"
                addButtonText="Add Exclude"
              />
            </div>
          </PlaceFormSection>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddPlace}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Add Place
            </Button>
          </div>
        </div>
      </div>
    );

  // Edit Modal
  const EditModal = () =>
    showEdit &&
    selectedPlace && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <h2 className="text-xl font-bold mb-4">Edit Place</h2>
          {/* ...existing code for Edit form fields, use selectedPlace state and handlers... */}
          <PlaceFormSection title="Basic Information">
            <div>
              <Label htmlFor="edit-title">Place Name</Label>
              <Input
                id="edit-title"
                name="title"
                value={selectedPlace.title}
                onChange={handleEditInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-subtitle">City</Label>
              <Input
                id="edit-subtitle"
                name="subtitle"
                value={selectedPlace.subtitle}
                onChange={handleEditInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-place_type">Category</Label>
              <Select
                name="place_type"
                value={selectedPlace.place_type}
                onValueChange={(value) =>
                  setSelectedPlace((prev) => ({ ...prev, place_type: value }))
                }
              >
                <SelectItem value="">Select Category</SelectItem>
                <SelectItem value="trending">Trending Places</SelectItem>
                <SelectItem value="adventure">Adventure Places</SelectItem>
                <SelectItem value="honeymoon">Honeymoon Places</SelectItem>
                <SelectItem value="beach">Beach Places</SelectItem>
                <SelectItem value="historical">Historical Places</SelectItem>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                name="price"
                value={selectedPlace.price}
                onChange={handleEditInputChange}
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Description">
            <div>
              <Label htmlFor="edit-about_place">About Place</Label>
              <Textarea
                id="edit-about_place"
                name="about_place"
                value={selectedPlace.about_place}
                onChange={handleEditInputChange}
                rows={3}
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Media">
            <div>
              <Label htmlFor="edit-main_image">Main Photo</Label>
              <div className="flex items-center">
                {selectedPlace.main_image && (
                  <div className="w-16 h-16 mr-2 border rounded overflow-hidden">
                    <img
                      src={getImageUrl(selectedPlace.main_image)}
                      alt="Main"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  id="edit-main_image"
                  type="file"
                  onChange={handleEditFileChange}
                />
              </div>
            </div>
            <div>
              <Label>Additional Photos</Label>
              <PhotoUploader
                photos={selectedPlace.sub_images}
                onAddPhoto={handleEditAddPhoto}
                onRemovePhoto={handleEditRemovePhoto}
                onPhotoChange={handleEditPhotoChange}
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Features">
            <div>
              <Label>Highlights</Label>
              <ArrayInputManager
                items={selectedPlace.highlights}
                onAddItem={() => handleEditAddArrayFieldItem("highlights")}
                onRemoveItem={(index) =>
                  handleEditRemoveArrayFieldItem("highlights", index)
                }
                onChangeItem={(index, value) =>
                  handleEditArrayFieldChange("highlights", index, value)
                }
                placeholderPrefix="Highlight"
                addButtonText="Add Highlight"
              />
            </div>
            <div>
              <Label>Include</Label>
              <ArrayInputManager
                items={selectedPlace.includeText}
                onAddItem={() => handleEditAddArrayFieldItem("includeText")}
                onRemoveItem={(index) =>
                  handleEditRemoveArrayFieldItem("includeText", index)
                }
                onChangeItem={(index, value) =>
                  handleEditArrayFieldChange("includeText", index, value)
                }
                placeholderPrefix="Include item"
                addButtonText="Add Include"
              />
            </div>
            <div>
              <Label>Exclude</Label>
              <ArrayInputManager
                items={selectedPlace.excludeText}
                onAddItem={() => handleEditAddArrayFieldItem("excludeText")}
                onRemoveItem={(index) =>
                  handleEditRemoveArrayFieldItem("excludeText", index)
                }
                onChangeItem={(index, value) =>
                  handleEditArrayFieldChange("excludeText", index, value)
                }
                placeholderPrefix="Exclude item"
                addButtonText="Add Exclude"
              />
            </div>
          </PlaceFormSection>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditPlace}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );

  // View Modal
  const ViewModal = () =>
    showView &&
    selectedPlace && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <h2 className="text-xl font-bold mb-4">View Place Details</h2>
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowView(false);
                setShowEdit(true);
              }}
            >
              {" "}
              <Edit className="w-4 h-4 mr-2" /> Edit{" "}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeletePlace(selectedPlace.id)}
              className="text-red-600"
            >
              {" "}
              <Trash2 className="w-4 h-4 mr-2" /> Delete{" "}
            </Button>
          </div>
          <PlaceFormSection title="Basic Information">
            <div>
              <Label>Place Name</Label>
              <Input
                value={selectedPlace.title}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={selectedPlace.subtitle}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={selectedPlace.place_type}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                value={selectedPlace.price}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Description">
            <div>
              <Label>About Place</Label>
              <Textarea
                value={selectedPlace.about_place || ""}
                readOnly
                className="bg-gray-50"
                rows={3}
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Media">
            <div>
              <Label>Main Photo</Label>
              <div className="mt-1">
                {selectedPlace.main_image ? (
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={getImageUrl(selectedPlace.main_image)}
                      alt={selectedPlace.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm mt-1">
                    No file chosen
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>Additional Photos</Label>
              {selectedPlace.sub_images?.length > 0 ? (
                <div className="space-y-2 mt-1">
                  {selectedPlace.sub_images.map((photo, index) => (
                    <div key={index} className="border rounded-md p-2">
                      {photo ? (
                        <div className="flex items-center">
                          <div className="w-12 h-12 mr-2 border rounded overflow-hidden">
                            <img
                              src={getImageUrl(photo)}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-700">
                            {photo instanceof File
                              ? photo.name
                              : `Photo ${index + 1}`}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No file chosen
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">
                  No files chosen
                </div>
              )}
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Features">
            <div>
              <Label>Highlights</Label>
              {selectedPlace.highlights?.length > 0 ? (
                <div className="space-y-2 mt-1">
                  {selectedPlace.highlights.map((highlight, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">No highlights</div>
              )}
            </div>
            <div>
              <Label>Include</Label>
              {selectedPlace.includeText?.length > 0 ? (
                <div className="space-y-2 mt-1">
                  {selectedPlace.includeText.map((text, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <div className="flex items-center">
                        <div className="mr-2 text-green-500">✓</div>
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">
                  No include items
                </div>
              )}
            </div>
            <div>
              <Label>Exclude</Label>
              {selectedPlace.excludeText?.length > 0 ? (
                <div className="space-y-2 mt-1">
                  {selectedPlace.excludeText.map((text, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <div className="flex items-center">
                        <div className="mr-2 text-red-500">✕</div>
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">
                  No exclude items
                </div>
              )}
            </div>
          </PlaceFormSection>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowView(false)}>Close</Button>
          </div>
        </div>
      </div>
    );

  // --- Main Render ---
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const filteredPlaces = places.filter(
    (place) =>
      place.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.place_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Place</h1>
      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Input
            type="text"
            className="w-80 h-11 pl-12 pr-5 py-2.5 text-base rounded-full"
            placeholder="Search for place"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Place
        </Button>
      </div>
      {/* Place Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaces.map((place) => (
              <tr key={place.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{place.title}</td>
                <td className="px-4 py-2">{place.subtitle}</td>
                <td className="px-4 py-2">{place.place_type}</td>
                <td className="px-4 py-2">{place.price}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPlace({ ...place });
                      setShowView(true);
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modals as Divs */}
      <AddModal />
      <EditModal />
      <ViewModal />
    </div>
  );
}

export default AddPlace;
