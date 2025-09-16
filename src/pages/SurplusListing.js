import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, GeoPoint } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const CLOUD_NAME = "dzoltbnxd";
const UPLOAD_PRESET = "Swaplink-preset";

export default function SurplusListing() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewURL, setPreviewURL] = useState(null);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().geolocation) {
          const userData = userDocSnap.data();
          setUserLocation(userData.geolocation);
          if (!formData.location && userData.address) {
            setFormData(prev => ({...prev, location: userData.address}));
          }
        }
        setLoading(false);
      } else {
        // If no user is logged in, redirect to login page
        navigate("/login");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate, formData.location]);


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
    
    if (!user) {
      console.error("You must be logged in to list an item.");
      navigate("/login");
      return;
    }
    
    if (!userLocation) {
        console.error("Your location is not set. Please update your profile.");
        return;
    }

    if (!imageFile) {
      console.error("Please select an image to upload!");
      return;
    }

    setUploading(true);

    try {
      const formDataCloud = new FormData();
      formDataCloud.append("file", imageFile);
      formDataCloud.append("upload_preset", UPLOAD_PRESET);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formDataCloud }
      );
      const data = await response.json();
      const imageURL = data.secure_url;

      await addDoc(collection(db, "surplus"), {
        ...formData,
        imageURL,
        timestamp: serverTimestamp(),
        claimedBy: null,
        createdBy: user.uid,
        creatorName: user.displayName || "Anonymous",
        geolocation: new GeoPoint(userLocation.latitude, userLocation.longitude),
      });
      
      console.log("✅ Surplus item listed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading/saving:", error);
    }

    setUploading(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="text-xl font-semibold text-green-700">Loading Form...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 py-12 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center">
            📦 List Surplus Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="border border-emerald-300 p-3 rounded-md w-full" name="title" value={formData.title} onChange={handleChange} placeholder="Item Name" required />
            <textarea className="border border-emerald-300 p-3 rounded-md w-full" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
            <input className="border border-emerald-300 p-3 rounded-md w-full" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required />
            <input className="border border-emerald-300 p-3 rounded-md w-full" name="location" value={formData.location} onChange={handleChange} placeholder="Pickup Address" required />
            <div className="mt-4">
              <label className="block text-emerald-800 font-medium mb-2">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200" required />
              {previewURL && (<img src={previewURL} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg shadow" />)}
            </div>
            <button type="submit" disabled={uploading || loading} className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-md transition duration-200 ${uploading || loading ? "opacity-60 cursor-not-allowed" : ""}`}>
              {uploading ? "Uploading..." : "List Item"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

