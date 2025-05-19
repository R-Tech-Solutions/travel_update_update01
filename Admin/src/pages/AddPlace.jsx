"use client";

import { useState } from "react";
import { Eye, Trash2, Edit, Plus, X } from "lucide-react";
import axios from "axios";
// import BackendUrl from "../Backendurl";

// Reusable UI Components
const Button = ({ children, onClick, className, variant = "default", size = "default", disabled = false, type = "button" }) => {
  const variantClasses = {
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100",
    default: "bg-indigo-600 text-white hover:bg-indigo-700"
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    lg: "text-base px-4 py-3",
    icon: "p-1",
    default: "text-sm px-3 py-2"
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

const Input = ({ id, name, value, onChange, className, placeholder, type = "text", readOnly = false }) => (
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
    className={`block text-sm font-medium text-gray-700 mb-1 ${className || ""}`}
  >
    {children}
  </label>
);

const Textarea = ({ id, name, value, onChange, rows = 3, className, readOnly = false }) => (
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
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => onOpenChange(false)}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className }) => (
  <div className={`flex flex-col ${className || ""}`}>{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="p-6 border-b">{children}</div>
);

const DialogTitle = ({ children, className }) => (
  <h2 className={`text-xl font-semibold ${className || ""}`}>{children}</h2>
);

const DialogFooter = ({ children }) => (
  <div className="flex justify-end space-x-2 p-6 border-t">{children}</div>
);

// Helper Components for Place Management
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
  addButtonText = "Add Item"
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

const PhotoUploader = ({ photos, onAddPhoto, onRemovePhoto, onPhotoChange }) => (
  <div>
    {photos.map((photo, index) => (
      <div key={index} className="mb-2 flex items-center">
        <div className="flex-1 flex items-center">
          {photo && (
            <div className="w-12 h-12 mr-2 border rounded overflow-hidden">
              <img
                src={photo instanceof File ? URL.createObjectURL(photo) : "/placeholder.svg?height=48&width=48"}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Input
            type="file"
            onChange={(e) => e.target.files?.[0] && onPhotoChange(index, e.target.files[0])}
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

// Main Component
function AddPlace() {
  // State Management
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Selected Place State
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  // New Place Form State
  const [newPlace, setNewPlace] = useState({
    id: 0,
    company: "",
    userId: "",
    type: "",
    industryType: "",
    subDescription: "",
    description: "",
    mainPhoto: null,
    photos: [],
    highlights: [],
    includeText: [],
    excludeText: [],
  });

  // Helper Functions
  const getImageUrl = (file) => file ? URL.createObjectURL(file) : "/placeholder.svg?height=200&width=300";

  const filteredPlaces = places.filter(place => 
    place.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CRUD Operations
  const handleAddPlace = () => {
    if (newPlace.company && newPlace.userId && newPlace.type && newPlace.industryType) {
      const newId = places.length > 0 ? Math.max(...places.map(p => p.id)) + 1 : 1;
      setPlaces([...places, { ...newPlace, id: newId }]);
      resetNewPlaceForm();
      setShowAddModal(false);
    }
  };

  const handleSaveEdit = () => {
    if (selectedPlace) {
      setPlaces(prev => prev.map(p => p.id === selectedPlace.id ? selectedPlace : p));
      setShowEditModal(false);
    }
  };

  const handleDeletePlace = (id) => {
    setPlaces(prev => prev.filter(p => p.id !== id));
  };

  const resetNewPlaceForm = () => {
    setNewPlace({
      id: 0,
      company: "",
      userId: "",
      type: "",
      industryType: "",
      subDescription: "",
      description: "",
      mainPhoto: null,
      photos: [],
      highlights: [],
      includeText: [],
      excludeText: [],
    });
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlace(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlace(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setNewPlace(prev => ({ ...prev, mainPhoto: e.target.files[0] }));
    }
  };

  const handleEditFileChange = (e) => {
    if (e.target.files?.[0] && selectedPlace) {
      setSelectedPlace(prev => ({ ...prev, mainPhoto: e.target.files[0] }));
    }
  };

  // Array Field Handlers (for highlights, include/exclude text, photos)
  const handleArrayFieldChange = (field, index, value) => {
    setNewPlace(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleAddArrayFieldItem = (field) => {
    setNewPlace(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ""]
    }));
  };

  const handleRemoveArrayFieldItem = (field, index) => {
    setNewPlace(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Edit Modal Array Field Handlers
  const handleEditArrayFieldChange = (field, index, value) => {
    if (selectedPlace) {
      setSelectedPlace(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }));
    }
  };

  const handleEditAddArrayFieldItem = (field) => {
    if (selectedPlace) {
      setSelectedPlace(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), ""]
      }));
    }
  };

  const handleEditRemoveArrayFieldItem = (field, index) => {
    if (selectedPlace) {
      setSelectedPlace(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  // Photo Handlers
  const handleAddPhoto = () => {
    setNewPlace(prev => ({
      ...prev,
      photos: [...(prev.photos || []), null]
    }));
  };

  const handleRemovePhoto = (index) => {
    setNewPlace(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoChange = (index, file) => {
    setNewPlace(prev => {
      const updatedPhotos = [...prev.photos];
      updatedPhotos[index] = file;
      return { ...prev, photos: updatedPhotos };
    });
  };

  // Edit Modal Photo Handlers
  const handleEditAddPhoto = () => {
    if (selectedPlace) {
      setSelectedPlace(prev => ({
        ...prev,
        photos: [...(prev.photos || []), null]
      }));
    }
  };

  const handleEditRemovePhoto = (index) => {
    if (selectedPlace) {
      setSelectedPlace(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    }
  };

  const handleEditPhotoChange = (index, file) => {
    if (selectedPlace) {
      setSelectedPlace(prev => {
        const updatedPhotos = [...prev.photos];
        updatedPhotos[index] = file;
        return { ...prev, photos: updatedPhotos };
      });
    }
  };

  // Modal Components
  const AddPlaceModal = () => (
    <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
      <DialogContent className="max-w-auto max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Add New Place</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 p-6">
          <PlaceFormSection title="Basic Information">
            <div>
              <Label htmlFor="company">Place Name</Label>
              <Input id="company" name="company" value={newPlace.company} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="userId">City</Label>
              <Input id="userId" name="userId" value={newPlace.userId} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="type">Category</Label>
              <Select name="type" value={newPlace.type} onValueChange={(value) => setNewPlace(prev => ({ ...prev, type: value }))}>
                <SelectItem value="default">Select Category</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="Reseller">Reseller</SelectItem>
              </Select>
            </div>
            <div>
              <Label htmlFor="industryType">Price</Label>
              <Input id="industryType" name="industryType" value={newPlace.industryType} onChange={handleInputChange} />
            </div>
          </PlaceFormSection>

          <PlaceFormSection title="Description">
            <div>
              <Label htmlFor="subDescription">Sub-description</Label>
              <Input id="subDescription" name="subDescription" value={newPlace.subDescription} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={newPlace.description} onChange={handleInputChange} rows={3} />
            </div>
          </PlaceFormSection>

          <PlaceFormSection title="Media">
            <div>
              <Label htmlFor="mainPhoto">Main Photo</Label>
              <div className="flex items-center">
                {newPlace.mainPhoto && (
                  <div className="w-16 h-16 mr-2 border rounded overflow-hidden">
                    <img src={getImageUrl(newPlace.mainPhoto)} alt="Main Photo Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <Input id="mainPhoto" type="file" onChange={handleFileChange} />
              </div>
            </div>
            <div>
              <Label>Additional Photos</Label>
              <PhotoUploader
                photos={newPlace.photos}
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
                onAddItem={() => handleAddArrayFieldItem('highlights')}
                onRemoveItem={(index) => handleRemoveArrayFieldItem('highlights', index)}
                onChangeItem={(index, value) => handleArrayFieldChange('highlights', index, value)}
                placeholderPrefix="Highlight"
                addButtonText="Add Highlight"
              />
            </div>
            <div>
              <Label>Include</Label>
              <ArrayInputManager
                items={newPlace.includeText}
                onAddItem={() => handleAddArrayFieldItem('includeText')}
                onRemoveItem={(index) => handleRemoveArrayFieldItem('includeText', index)}
                onChangeItem={(index, value) => handleArrayFieldChange('includeText', index, value)}
                placeholderPrefix="Include item"
                addButtonText="Add Include"
              />
            </div>
            <div>
              <Label>Exclude</Label>
              <ArrayInputManager
                items={newPlace.excludeText}
                onAddItem={() => handleAddArrayFieldItem('excludeText')}
                onRemoveItem={(index) => handleRemoveArrayFieldItem('excludeText', index)}
                onChangeItem={(index, value) => handleArrayFieldChange('excludeText', index, value)}
                placeholderPrefix="Exclude item"
                addButtonText="Add Exclude"
              />
            </div>
          </PlaceFormSection>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddPlace} className="bg-indigo-600 hover:bg-indigo-700">Add Place</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const ViewPlaceModal = () => (
    <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
      <DialogContent className="w-auto h-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">View Place Details</DialogTitle>
        </DialogHeader>
        {selectedPlace && (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 p-6">
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleDeletePlace(selectedPlace.id);
                  setShowViewModal(false);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>

            <PlaceFormSection title="Basic Information">
              <div>
                <Label>Place Name</Label>
                <Input value={selectedPlace.company} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label>City</Label>
                <Input value={selectedPlace.userId} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={selectedPlace.type} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label>Price</Label>
                <Input value={selectedPlace.industryType} readOnly className="bg-gray-50" />
              </div>
            </PlaceFormSection>

            <PlaceFormSection title="Description">
              <div>
                <Label>Sub-description</Label>
                <Input value={selectedPlace.subDescription || ""} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={selectedPlace.description || ""} readOnly className="bg-gray-50" rows={3} />
              </div>
            </PlaceFormSection>

            <PlaceFormSection title="Media">
              <div>
                <Label>Main Photo</Label>
                <div className="mt-1">
                  {selectedPlace.mainPhoto ? (
                    <div className="border rounded-md overflow-hidden">
                      <img
                        src={getImageUrl(selectedPlace.mainPhoto)}
                        alt={selectedPlace.company}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm mt-1">No file chosen</div>
                  )}
                </div>
              </div>
              <div>
                <Label>Additional Photos</Label>
                {selectedPlace.photos?.length > 0 ? (
                  <div className="space-y-2 mt-1">
                    {selectedPlace.photos.map((photo, index) => (
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
                              {photo instanceof File ? photo.name : `Photo ${index + 1}`}
                            </span>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">No file chosen</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm mt-1">No files chosen</div>
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
                  <div className="text-gray-500 text-sm mt-1">No include items</div>
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
                  <div className="text-gray-500 text-sm mt-1">No exclude items</div>
                )}
              </div>
            </PlaceFormSection>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => setShowViewModal(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const EditPlaceModal = () => (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Place</DialogTitle>
        </DialogHeader>
        {selectedPlace && (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 p-6">
            <PlaceFormSection title="Basic Information">
              <div>
                <Label htmlFor="edit-company">Place Name</Label>
                <Input id="edit-company" name="company" value={selectedPlace.company} onChange={handleEditChange} />
              </div>
              <div>
                <Label htmlFor="edit-userId">City</Label>
                <Input id="edit-userId" name="userId" value={selectedPlace.userId} onChange={handleEditChange} />
              </div>
              <div>
                <Label htmlFor="edit-type">Category</Label>
                <Select name="type" value={selectedPlace.type} onValueChange={(value) => setSelectedPlace(prev => ({ ...prev, type: value }))}>
                  <SelectItem value="default">Select Category</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                  <SelectItem value="Reseller">Reseller</SelectItem>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-industryType">Price</Label>
                <Input id="edit-industryType" name="industryType" value={selectedPlace.industryType} onChange={handleEditChange} />
              </div>
            </PlaceFormSection>

            <PlaceFormSection title="Description">
              <div>
                <Label htmlFor="edit-subDescription">Sub-description</Label>
                <Input id="edit-subDescription" name="subDescription" value={selectedPlace.subDescription} onChange={handleEditChange} />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" value={selectedPlace.description} onChange={handleEditChange} rows={3} />
              </div>
            </PlaceFormSection>

            <PlaceFormSection title="Media">
              <div>
                <Label htmlFor="edit-mainPhoto">Main Photo</Label>
                <div className="flex items-center">
                  {selectedPlace.mainPhoto && (
                    <div className="w-16 h-16 mr-2 border rounded overflow-hidden">
                      <img src={getImageUrl(selectedPlace.mainPhoto)} alt="Main Photo Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <Input id="edit-mainPhoto" type="file" onChange={handleEditFileChange} />
                </div>
              </div>
              <div>
                <Label>Additional Photos</Label>
                <PhotoUploader
                  photos={selectedPlace.photos}
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
                  onAddItem={() => handleEditAddArrayFieldItem('highlights')}
                  onRemoveItem={(index) => handleEditRemoveArrayFieldItem('highlights', index)}
                  onChangeItem={(index, value) => handleEditArrayFieldChange('highlights', index, value)}
                  placeholderPrefix="Highlight"
                  addButtonText="Add Highlight"
                />
              </div>
              <div>
                <Label>Include</Label>
                <ArrayInputManager
                  items={selectedPlace.includeText}
                  onAddItem={() => handleEditAddArrayFieldItem('includeText')}
                  onRemoveItem={(index) => handleEditRemoveArrayFieldItem('includeText', index)}
                  onChangeItem={(index, value) => handleEditArrayFieldChange('includeText', index, value)}
                  placeholderPrefix="Include item"
                  addButtonText="Add Include"
                />
              </div>
              <div>
                <Label>Exclude</Label>
                <ArrayInputManager
                  items={selectedPlace.excludeText}
                  onAddItem={() => handleEditAddArrayFieldItem('excludeText')}
                  onRemoveItem={(index) => handleEditRemoveArrayFieldItem('excludeText', index)}
                  onChangeItem={(index, value) => handleEditArrayFieldChange('excludeText', index, value)}
                  placeholderPrefix="Exclude item"
                  addButtonText="Add Exclude"
                />
              </div>
            </PlaceFormSection>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Main Render
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
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
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
                <td className="px-4 py-2">{place.company}</td>
                <td className="px-4 py-2">{place.userId}</td>
                <td className="px-4 py-2">{place.type}</td>
                <td className="px-4 py-2">{place.industryType}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPlace({ ...place });
                      setShowViewModal(true);
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

      {/* Modals */}
      <AddPlaceModal />
      <ViewPlaceModal />
      <EditPlaceModal />
    </div>
  );
}

export default AddPlace;