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
const getImageUrl = (file) => {
  if (!file) return "/placeholder.svg?height=200&width=300";
  if (file instanceof File) return URL.createObjectURL(file);
  if (file.url) {
    // If url is already absolute, return as is
    if (file.url.startsWith("http")) return file.url;
    // If url is a media path, prepend backend URL
    if (file.url.startsWith("/media/") || file.url.startsWith("media/")) {
      return `http://127.0.0.1:8000${file.url.startsWith("/") ? "" : "/"}${
        file.url
      }`;
    }
    return file.url;
  }
  if (typeof file === "string") {
    if (file.startsWith("http")) return file;
    if (file.startsWith("/media/") || file.startsWith("media/")) {
      return `http://127.0.0.1:8000${file.startsWith("/") ? "" : "/"}${file}`;
    }
    return file;
  }
  return "/placeholder.svg?height=200&width=300";
};

// Move this OUTSIDE of the AddPlace function, or at least define it as a stable component
function AddModal({
  show,
  newPlace,
  handleInputChange,
  handleFileChange,
  handleAddPhoto,
  handleRemovePhoto,
  handlePhotoChange,
  handleAddArrayFieldItem,
  handleRemoveArrayFieldItem,
  handleArrayFieldChange,
  setShowAdd,
  handleAddPlace,
  setNewPlace,
  handleAddItineraryDay,
  handleRemoveItineraryDay,
  handleChangeItineraryDayField,
  handleAddItineraryPhoto,
  handleRemoveItineraryPhoto,
  handleChangeItineraryPhoto,
  handleDeleteItineraryPhoto,
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">Add New Place</h2>
        {/* Do NOT wrap the modal content in a <form> tag, just use divs */}
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
              <SelectItem value="Hiking">Hiking & Trekking Places</SelectItem>
              <SelectItem value="Leisure">Leisure Travel Places</SelectItem>
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
          <div>
            <Label htmlFor="package_title">Package Title</Label>
            <Input
              id="package_title"
              name="package_title"
              value={newPlace.package_title}
              onChange={handleInputChange}
              placeholder="Enter package title"
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
          <div>
            <Label htmlFor="price_title">Price Title</Label>
            <Input
              id="price_title"
              name="price_title"
              value={newPlace.price_title}
              onChange={handleInputChange}
              placeholder="Enter price title (e.g. Per Person, Per Night, etc.)"
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
              <Input id="main_image" type="file" onChange={handleFileChange} />
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
              items={newPlace.highlights || []}
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
              items={newPlace.includeText || []}
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
              items={newPlace.excludeText || []}
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
          <div>
            <Label>Itinerary</Label>
            <ItineraryManager
              itinerary={newPlace.itinerary}
              onAddDay={handleAddItineraryDay}
              onRemoveDay={handleRemoveItineraryDay}
              onChangeDayField={handleChangeItineraryDayField}
              onAddPhoto={handleAddItineraryPhoto}
              onRemovePhoto={handleRemoveItineraryPhoto}
              onPhotoChange={handleChangeItineraryPhoto}
              onDeletePhoto={handleDeleteItineraryPhoto}
            />
          </div>
        </PlaceFormSection>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddPlace}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Add Place
          </Button>
        </div>
      </div>
    </div>
  );
}

// Move EditModal OUTSIDE of AddPlace and make it a stable component
function EditModal({
  show,
  selectedPlace,
  handleEditInputChange,
  handleEditFileChange,
  handleEditAddPhoto,
  handleEditRemovePhoto,
  handleEditPhotoChange,
  handleEditAddArrayFieldItem,
  handleEditRemoveArrayFieldItem,
  handleEditArrayFieldChange,
  setShowEdit,
  handleEditPlace,
  handleEditAddItineraryDay,
  handleEditRemoveItineraryDay,
  handleEditChangeItineraryDayField,
  handleEditAddItineraryPhoto,
  handleEditRemoveItineraryPhoto,
  handleEditChangeItineraryPhoto,
  handleDeleteItineraryPhoto,
}) {
  if (!show || !selectedPlace) return null;
  
  // Convert itinerary_days to the format expected by the form
  const itineraryData = selectedPlace.itinerary_days?.map(day => ({
    id: day?.id || null,
    day: day?.day || '',
    sub_iterative_description: day?.sub_iterative_description || '',
    sub_description: day?.sub_description || '',
    photos: day?.photos?.map(photo => ({ 
      id: photo?.id || null,
      url: photo?.image || null
    })) || []
  })) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">Edit Place</h2>
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
                handleEditInputChange({ target: { name: "place_type", value } })
              }
            >
              <SelectItem value="">Select Category</SelectItem>
              <SelectItem value="trending">Trending Places</SelectItem>
              <SelectItem value="adventure">Adventure Places</SelectItem>
              <SelectItem value="honeymoon">Honeymoon Places</SelectItem>
              <SelectItem value="beach">Beach Places</SelectItem>
              <SelectItem value="historical">Historical Places</SelectItem>
              <SelectItem value="Hiking">Hiking & Trekking Places</SelectItem>
              <SelectItem value="Leisure">Leisure Travel Places</SelectItem>
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
          <div>
            <Label htmlFor="edit-package_title">Package Title</Label>
            <Input
              id="edit-package_title"
              name="package_title"
              value={selectedPlace.package_title}
              onChange={handleEditInputChange}
              placeholder="Enter package title"
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
              items={selectedPlace.highlights || []}
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
              items={selectedPlace.includeText || []}
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
              items={selectedPlace.excludeText || []}
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
          <div>
            <Label>Itinerary</Label>
            <ItineraryManager
              itinerary={itineraryData}
              onAddDay={handleEditAddItineraryDay}
              onRemoveDay={handleEditRemoveItineraryDay}
              onChangeDayField={handleEditChangeItineraryDayField}
              onAddPhoto={handleEditAddItineraryPhoto}
              onRemovePhoto={handleEditRemoveItineraryPhoto}
              onPhotoChange={handleEditChangeItineraryPhoto}
              onDeletePhoto={handleDeleteItineraryPhoto}
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
}

// Add this new component above AddPlace
const ItineraryManager = ({
  itinerary,
  onAddDay,
  onRemoveDay,
  onChangeDayField,
  onAddPhoto,
  onRemovePhoto,
  onPhotoChange,
  onDeletePhoto,
}) => (
  <div>
    {itinerary.map((day, idx) => (
      <div key={idx} className="border rounded-md p-4 mb-4">
        <div className="flex items-center mb-2">
          <Label className="mr-2">Day</Label>
          <Input
            type="number"
            min={1}
            value={day.day}
            onChange={(e) => onChangeDayField(idx, "day", e.target.value)}
            className="w-20 mr-4"
            placeholder="Day"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveDay(idx)}
            className="ml-2 text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-2 flex items-center">
          <Label className="mr-2">Sub Iterative Description</Label>
          <Input
            type="text"
            value={day.sub_iterative_description || ""}
            onChange={(e) => onChangeDayField(idx, "sub_iterative_description", e.target.value)}
            className="flex-1"
            placeholder="Sub Iterative Description"
          />
        </div>
        <div className="mb-2">
          <Label>Sub Description</Label>
          <Textarea
            value={day.sub_description}
            onChange={(e) => onChangeDayField(idx, "sub_description", e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <Label>Photos</Label>
          <div>
            {day.photos.map((photo, pIdx) => (
              <div key={pIdx} className="flex items-center mb-2">
                {photo && (
                  <div className="w-12 h-12 mr-2 border rounded overflow-hidden">
                    <img
                      src={
                        photo instanceof File
                          ? URL.createObjectURL(photo)
                          : photo?.url
                          ? getImageUrl(photo)
                          : "/placeholder.svg?height=48&width=48"
                      }
                      alt={`Itinerary Photo ${pIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    onPhotoChange(idx, pIdx, e.target.files[0])
                  }
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (photo?.id) {
                      // If photo has an ID, it's an existing photo in the database
                      onDeletePhoto(day.id, photo.id);
                    } else {
                      // If no ID, it's a new photo that hasn't been saved yet
                      onRemovePhoto(idx, pIdx);
                    }
                  }}
                  className="ml-2 text-red-500"
                  disabled={day.photos.length <= 1}
                  title={
                    day.photos.length <= 1
                      ? "At least one photo required"
                      : "Remove"
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddPhoto(idx)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </div>
        </div>
      </div>
    ))}
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onAddDay}
      className="mt-2"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Itinerary Day
    </Button>
  </div>
);

// itinerative end

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
    price_title: "",
    package_title: "",
    main_image: null,
    sub_images: [],
    highlights: [],
    includeText: [],
    excludeText: [],
    itinerary: [],
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
    if (!newPlace.title || !newPlace.subtitle || !newPlace.place_type || !newPlace.price) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Append text fields
      formData.append("title", newPlace.title);
      formData.append("subtitle", newPlace.subtitle);
      formData.append("price", newPlace.price === "" ? "" : Number(newPlace.price));
      formData.append("about_place", newPlace.about_place);
      formData.append("place_type", newPlace.place_type);
      formData.append("tour_highlights", JSON.stringify(newPlace.highlights));
      formData.append("include", JSON.stringify(newPlace.includeText));
      formData.append("exclude", JSON.stringify(newPlace.excludeText));
      formData.append("price_title", newPlace.price_title);
      formData.append("package_title", newPlace.package_title);

      // Handle main image
      if (newPlace.main_image && newPlace.main_image.file) {
        formData.append("main_image", newPlace.main_image.file);
      }

      // Handle sub images
      newPlace.sub_images
        .filter((imgObj) => imgObj && imgObj.file)
        .forEach((imgObj) => {
          formData.append("sub_images", imgObj.file);
        });

      // Handle itinerary data
      const itineraryData = newPlace.itinerary.map(day => ({
        day: day.day,
        sub_iterative_description: day.sub_iterative_description,
        sub_description: day.sub_description
      }));
      formData.append("itinerary", JSON.stringify(itineraryData));

      // Handle itinerary photos
      newPlace.itinerary.forEach((day) => {
        (day.photos || []).forEach((photo, pIdx) => {
          if (photo && photo.file) {
            formData.append(
              "itinerary_photos",
              photo.file,
              `day${day.day}_${pIdx}_${photo.file.name}`
            );
          }
        });
      });

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
        price_title: "",
        package_title: "",
        sub_images: [],
        highlights: [],
        includeText: [],
        excludeText: [],
        itinerary: [],
      });
    } catch (err) {
      setError(err.message);
      alert("Failed to add place: " + (err.response?.data?.detail || err.message));
      console.error("Error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Edit main image handler: store as { file, url }
  const handleEditFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setSelectedPlace((prev) => ({
      ...prev,
      main_image: { file, url: URL.createObjectURL(file) },
    }));
  };

  // Edit additional photo handler: store as { file, url }
  const handleEditPhotoChange = (index, file) => {
    if (!file) return;
    setSelectedPlace((prev) => {
      const updated = [...prev.sub_images];
      updated[index] = { file, url: URL.createObjectURL(file) };
      return { ...prev, sub_images: updated };
    });
  };

  // Edit place: only send files for images that have .file
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
      formData.append("price_title", selectedPlace.price_title);

      // Handle main image
      if (selectedPlace.main_image && selectedPlace.main_image.file) {
        formData.append("main_image", selectedPlace.main_image.file);
      }

      // Handle sub images
      if (selectedPlace.sub_images && selectedPlace.sub_images.length > 0) {
        selectedPlace.sub_images
          .filter((imgObj) => imgObj && imgObj.file)
          .forEach((imgObj) => {
            formData.append("sub_images", imgObj.file);
          });
      }

      // Handle itinerary data
      const itineraryData = selectedPlace.itinerary_days.map(day => ({
        id: day.id,
        day: day.day,
        sub_iterative_description: day.sub_iterative_description,
        sub_description: day.sub_description
      }));
      formData.append("itinerary", JSON.stringify(itineraryData));

      // Handle itinerary photos
      selectedPlace.itinerary_days.forEach((day) => {
        (day.photos || []).forEach((photo, pIdx) => {
          if (photo && photo.file) {
            formData.append(
              "itinerary_photos",
              photo.file,
              `day${day.day}_${pIdx}_${photo.file.name}`
            );
          }
        });
      });

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
      console.error("Error details:", err.response?.data);
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
    setNewPlace((prev) => ({
      ...prev,
      main_image: { file, url: URL.createObjectURL(file) },
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlace((prev) => ({ ...prev, [name]: value }));
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
    setNewPlace((prev) => {
      const updated = [...prev.sub_images];
      updated[index] = { file, url: URL.createObjectURL(file) };
      return { ...prev, sub_images: updated };
    });
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

  // Itinerary handlers for add
  const handleAddItineraryDay = () =>
    setNewPlace((prev) => ({
      ...prev,
      itinerary: [
        ...(prev.itinerary || []),
        { day: (prev.itinerary?.length || 0) + 1, title: "", description: "", photos: [null] },
      ],
    }));

  const handleRemoveItineraryDay = idx =>
    setNewPlace(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== idx),
    }));

  const handleChangeItineraryDayField = (idx, field, value) =>
    setNewPlace(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((d, i) =>
        i === idx ? { ...d, [field]: value } : d
      ),
    }));

  const handleAddItineraryPhoto = idx =>
    setNewPlace(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((d, i) =>
        i === idx ? { ...d, photos: [...(d.photos || []), null] } : d
      ),
    }));

  const handleRemoveItineraryPhoto = (idx, pIdx) =>
    setNewPlace(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((d, i) =>
        i === idx
          ? {
              ...d,
              photos: d.photos.length > 1
                ? d.photos.filter((_, j) => j !== pIdx)
                : d.photos,
            }
          : d
      ),
    }));

  const handleChangeItineraryPhoto = (idx, pIdx, file) =>
    setNewPlace(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((d, i) =>
        i === idx
          ? {
              ...d,
              photos: d.photos.map((p, j) =>
                j === pIdx ? { file, url: URL.createObjectURL(file), isNew: true } : p
              ),
            }
          : d
      ),
    }));

  // Itinerary handlers for edit
  const handleEditAddItineraryDay = () =>
    setSelectedPlace((prev) => ({
      ...prev,
      itinerary_days: [
        ...(prev.itinerary_days || []),
        {
          day: (prev.itinerary_days?.length || 0) + 1,
          sub_iterative_description: '',
          sub_description: '',
          photos: []
        }
      ]
    }));

  const handleEditRemoveItineraryDay = (idx) =>
    setSelectedPlace((prev) => ({
      ...prev,
      itinerary_days: prev.itinerary_days.filter((_, i) => i !== idx)
    }));

  const handleEditChangeItineraryDayField = (idx, field, value) =>
    setSelectedPlace((prev) => ({
      ...prev,
      itinerary_days: prev.itinerary_days.map((d, i) =>
        i === idx ? { ...d, [field]: value } : d
      )
    }));

  const handleEditAddItineraryPhoto = (idx) =>
    setSelectedPlace((prev) => ({
      ...prev,
      itinerary_days: prev.itinerary_days.map((d, i) =>
        i === idx ? { ...d, photos: [...(d.photos || []), null] } : d
      )
    }));

  const handleEditRemoveItineraryPhoto = (idx, pIdx) =>
    setSelectedPlace((prev) => ({
      ...prev,
      itinerary_days: prev.itinerary_days.map((d, i) =>
        i === idx
          ? {
              ...d,
              photos: d.photos.length > 1
                ? d.photos.filter((_, j) => j !== pIdx)
                : d.photos
          }
        : d
      )
    }));

  const handleEditChangeItineraryPhoto = (idx, pIdx, file) =>
    setSelectedPlace((prev) => ({
      ...prev,
      itinerary_days: prev.itinerary_days.map((d, i) =>
        i === idx
          ? {
              ...d,
              photos: d.photos.map((p, j) =>
                j === pIdx ? { file, url: URL.createObjectURL(file), isNew: true } : p
              )
            }
          : d
      )
    }));

  // Add this new function to handle photo deletion
  const handleDeleteItineraryPhoto = async (dayId, photoId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/places/itinerary-photo/${photoId}/delete/`);
      // Refresh the place data after deletion
      fetchPlaces();
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err.message);
    }
  };

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
                setSelectedPlace((prev) => ({
                  ...prev,
                  sub_images: Array.isArray(prev.sub_images)
                    ? prev.sub_images.map((imgObj) =>
                        imgObj && imgObj.url
                          ? imgObj
                          : imgObj && imgObj.image
                          ? { url: imgObj.image }
                          : null
                      )
                    : [],
                }));
                setShowEdit(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeletePlace(selectedPlace.id)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
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
            <div>
              <Label>Package Title</Label>
              <Input
                value={selectedPlace.package_title}
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

            <div>
              <Label>Price</Label>
              <Input
                value={selectedPlace.price_title}
                readOnly
                className="bg-gray-50"
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
              {/* Show highlights as a comma-separated string if all are empty */}
              {Array.isArray(selectedPlace.highlights) &&
              selectedPlace.highlights.length > 0 &&
              selectedPlace.highlights.some((h) => h && h.trim()) ? (
                <div className="space-y-2 mt-1">
                  {selectedPlace.highlights.map((highlight, index) =>
                    highlight && highlight.trim() ? (
                      <div key={index} className="border rounded-md p-2">
                        <span>{highlight}</span>
                      </div>
                    ) : null
                  )}
                </div>
              ) : // Show the raw value if it's a string (backend bug fallback)
              typeof selectedPlace.highlights === "string" &&
                selectedPlace.highlights.trim() !== "" ? (
                <div className="space-y-2 mt-1">
                  <div className="border rounded-md p-2">
                    <span>{selectedPlace.highlights}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">No highlights</div>
              )}
            </div>
            <div>
              <Label>Include</Label>
              {Array.isArray(selectedPlace.includeText) &&
              selectedPlace.includeText.length > 0 &&
              selectedPlace.includeText.some((i) => i && i.trim()) ? (
                <div className="space-y-2 mt-1">
                  {selectedPlace.includeText.map((text, index) =>
                    text && text.trim() ? (
                      <div key={index} className="border rounded-md p-2">
                        <div className="flex items-center">
                          <div className="mr-2 text-green-500">✓</div>
                          <span>{text}</span>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              ) : typeof selectedPlace.includeText === "string" &&
                selectedPlace.includeText.trim() !== "" ? (
                <div className="space-y-2 mt-1">
                  <div className="border rounded-md p-2">
                    <span>{selectedPlace.includeText}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">
                  No include items
                </div>
              )}
            </div>
            <div>
              <Label>Exclude</Label>
              {Array.isArray(selectedPlace.excludeText) &&
              selectedPlace.excludeText.length > 0 &&
              selectedPlace.excludeText.some((i) => i && i.trim()) ? (
                <div className="space-y-2 mt-1">
                  {selectedPlace.excludeText.map((text, index) =>
                    text && text.trim() ? (
                      <div key={index} className="border rounded-md p-2">
                        <div className="flex items-center">
                          <div className="mr-2 text-red-500">✕</div>
                          <span>{text}</span>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              ) : typeof selectedPlace.excludeText === "string" &&
                selectedPlace.excludeText.trim() !== "" ? (
                <div className="space-y-2 mt-1">
                  <div className="border rounded-md p-2">
                    <span>{selectedPlace.excludeText}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">
                  No exclude items
                </div>
              )}
            </div>
            <div>
              <Label>Itinerary</Label>
              <ItineraryManager
                itinerary={selectedPlace.itinerary}
                onAddDay={handleEditAddItineraryDay}
                onRemoveDay={handleEditRemoveItineraryDay}
                onChangeDayField={handleEditChangeItineraryDayField}
                onAddPhoto={handleEditAddItineraryPhoto}
                onRemovePhoto={handleEditRemoveItineraryPhoto}
                onPhotoChange={handleEditChangeItineraryPhoto}
                onDeletePhoto={handleDeleteItineraryPhoto}
              />
            </div>
          </PlaceFormSection>
          <PlaceFormSection title="Itinerary">
            {selectedPlace.itinerary_days && selectedPlace.itinerary_days.length > 0 ? (
              selectedPlace.itinerary_days.map((day, idx) => (
                <div key={idx} className="border rounded-md p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Label className="mr-2">Day {day.day}</Label>
                  </div>
                  <div className="mb-2">
                    <Label>Sub Iterative Description</Label>
                    <Input
                      value={day.sub_iterative_description || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="mb-2">
                    <Label>Sub Description</Label>
                    <Textarea
                      value={day.sub_description || ""}
                      readOnly
                      className="bg-gray-50"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Photos</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {day.photos && day.photos.map((photo, pIdx) => (
                        <div key={pIdx} className="border rounded-md p-2">
                          <img
                            src={getImageUrl(photo.image)}
                            alt={`Day ${day.day} Photo ${pIdx + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm mt-1">No itinerary data available</div>
            )}
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
                      setSelectedPlace({
                        ...place,
                        main_image: place.main_image
                          ? { url: place.main_image }
                          : null,
                        sub_images: Array.isArray(place.sub_images)
                          ? place.sub_images.map((imgObj) =>
                              imgObj && imgObj.image
                                ? { url: imgObj.image }
                                : null
                            )
                          : [],
                        // Parse the JSON strings if they exist
                        highlights: place.tour_highlights
                          ? typeof place.tour_highlights === "string"
                            ? JSON.parse(place.tour_highlights)
                            : place.tour_highlights
                          : [],
                        includeText: place.include
                          ? typeof place.include === "string"
                            ? JSON.parse(place.include)
                            : place.include
                          : [],
                        excludeText: place.exclude
                          ? typeof place.exclude === "string"
                            ? JSON.parse(place.exclude)
                            : place.exclude
                          : [],
                        itinerary: Array.isArray(place.itinerary)
                          ? place.itinerary.map((day) => ({
                              day: day.day,
                              title: day.title,
                              description: day.description,
                              photos: Array.isArray(day.photos)
                                ? day.photos.map((photo) =>
                                    photo && photo.image ? { url: photo.image } : null
                                  )
                                : [],
                            }))
                          : [],
                      });
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
      <AddModal
        show={showAdd}
        newPlace={newPlace}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleAddPhoto={handleAddPhoto}
        handleRemovePhoto={handleRemovePhoto}
        handlePhotoChange={handlePhotoChange}
        handleAddArrayFieldItem={handleAddArrayFieldItem}
        handleRemoveArrayFieldItem={handleRemoveArrayFieldItem}
        handleArrayFieldChange={handleArrayFieldChange}
        setShowAdd={setShowAdd}
        handleAddPlace={handleAddPlace}
        setNewPlace={setNewPlace}
        handleAddItineraryDay={handleAddItineraryDay}
        handleRemoveItineraryDay={handleRemoveItineraryDay}
        handleChangeItineraryDayField={handleChangeItineraryDayField}
        handleAddItineraryPhoto={handleAddItineraryPhoto}
        handleRemoveItineraryPhoto={handleRemoveItineraryPhoto}
        handleChangeItineraryPhoto={handleChangeItineraryPhoto}
        handleDeleteItineraryPhoto={handleDeleteItineraryPhoto}
      />
      <EditModal
        show={showEdit}
        selectedPlace={selectedPlace}
        handleEditInputChange={handleEditInputChange}
        handleEditFileChange={handleEditFileChange}
        handleEditAddPhoto={handleEditAddPhoto}
        handleEditRemovePhoto={handleEditRemovePhoto}
        handleEditPhotoChange={handleEditPhotoChange}
        handleEditAddArrayFieldItem={handleEditAddArrayFieldItem}
        handleEditRemoveArrayFieldItem={handleEditRemoveArrayFieldItem}
        handleEditArrayFieldChange={handleEditArrayFieldChange}
        setShowEdit={setShowEdit}
        handleEditPlace={handleEditPlace}
        handleEditAddItineraryDay={handleEditAddItineraryDay}
        handleEditRemoveItineraryDay={handleEditRemoveItineraryDay}
        handleEditChangeItineraryDayField={handleEditChangeItineraryDayField}
        handleEditAddItineraryPhoto={handleEditAddItineraryPhoto}
        handleEditRemoveItineraryPhoto={handleEditRemoveItineraryPhoto}
        handleEditChangeItineraryPhoto={handleEditChangeItineraryPhoto}
        handleDeleteItineraryPhoto={handleDeleteItineraryPhoto}
      />
      <ViewModal />
    </div>
  );
}

export default AddPlace;









// **How to fix:**
// 1. In your Django model for the Place or sub_images, the file/image field has a max_length (default is 100).
// 2. The filename you are uploading is too long for this field.
// 3. Solution: In your Django model, set max_length=255 (or higher) for the ImageField/FileField for sub_images and main_image.

// Example Django model fix:
//
// class Place(models.Model):
//     # ...existing fields...
//     main_image = models.ImageField(upload_to='places/main_images/', max_length=255, blank=True, null=True)
//     sub_images = models.ImageField(upload_to='places/sub_images/', max_length=255, blank=True, null=True)
//     # or if using a related model for sub_images, set max_length=255 there too.
//
// After changing the model, run:
//   python manage.py makemigrations
//   python manage.py migrate

// This will resolve the 400/500 error when uploading images with long filenames.
