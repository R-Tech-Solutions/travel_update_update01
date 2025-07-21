import { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "../BackendUrl";


const ContactForm = () => {
  const [formData, setFormData] = useState({
    contact_number: "",
    instagram_link: "",
    facebook_link: "",
    whatsapp_link: "",

  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the latest contact on mount
  useEffect(() => {
    axios
      .get(`${BackendUrl}/api/contact/`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const last = res.data[res.data.length - 1];
          setFormData({
            contact_number: last.contact_number || "",
            instagram_link: last.instagram_link || "",
            facebook_link: last.facebook_link || "",
            whatsapp_link: last.whatsapp_link || "",
          });
          setEditId(last.id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `${BackendUrl}/api/contacts/${editId}/update`,
          formData
        );
        alert("Settings updated successfully");
      } else {
        const res = await axios.post(
          `${BackendUrl}/api/contacts/create`,
          formData
        );
        alert("Settings created successfully");
        setEditId(res.data.id); // Switch to update mode
      }
    } catch (error) {
      if (error.response) {
        console.log("Error response:", error.response.data);
        alert("Error: " + JSON.stringify(error.response.data));
      } else {
        alert("Error saving settings");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 w-full max-w-lg mx-auto bg-white rounded shadow-md"
    >
      <input
        type="text"
        name="contact_number"
        placeholder="Contact Number"
        value={formData.contact_number}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="url"
        name="instagram_link"
        placeholder="Instagram Link"
        value={formData.instagram_link}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="url"
        name="facebook_link"
        placeholder="Facebook Link"
        value={formData.facebook_link}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="url"
        name="whatsapp_link"
        placeholder="WhatsApp Link"
        value={formData.whatsapp_link}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editId ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default ContactForm;
