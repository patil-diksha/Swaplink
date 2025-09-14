
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/navbar";

const CLOUD_NAME = "dzoltbnxd"; // ⬅ your Cloudinary cloud name
const UPLOAD_PRESET = "Swaplink-preset"; // ⬅ your preset name

export default function SurplusListing() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
    } else {
      setPreviewURL(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image to upload!");
      return;
    }

    setUploading(true);

    try {
      // ✅ Upload image to Cloudinary
      const formDataCloud = new FormData();
      formDataCloud.append("file", imageFile);
      formDataCloud.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
  {
    method: "POST",
    body: formDataCloud,
  }
);


      const data = await response.json();
      const imageURL = data.secure_url;

      // ✅ Save surplus item to Firestore
      await addDoc(collection(db, "surplus"), {
        ...formData,
        imageURL,
        timestamp: serverTimestamp(),
        claimedBy: null,
      });

      alert("✅ Surplus item listed successfully!");
      setFormData({ title: "", description: "", quantity: "", location: "" });
      setImageFile(null);
      setPreviewURL(null);
    } catch (error) {
      console.error("Error uploading/saving:", error);
      alert("❌ Upload failed: " + error.message);
    }

    setUploading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 py-12 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center">
            📦 List Surplus Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="border border-emerald-300 p-3 rounded-md w-full"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Item Name"
              required
            />
            <textarea
              className="border border-emerald-300 p-3 rounded-md w-full"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <input
              className="border border-emerald-300 p-3 rounded-md w-full"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              required
            />
            <input
              className="border border-emerald-300 p-3 rounded-md w-full"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
            />

            <div className="mt-4">
              <label className="block text-emerald-800 font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"
                required
              />
              {previewURL && (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded-lg shadow"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-md transition duration-200 ${
                uploading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "List Item"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
