import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, GeoPoint } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LocationPicker from '../components/LocationPicker'; // Import the new component

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    address: "",
    geolocation: null, // This will hold the coordinates
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelect = (coords) => {
    setFormData(prev => ({
      ...prev,
      geolocation: coords,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.userType) {
      alert("Please select a user type!");
      return;
    }
    if (
      (formData.userType === "store" || formData.userType === "restaurant") &&
      !formData.geolocation
    ) {
      alert("Please select your location on the map.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.name,
      });

      const userDocData = {
        name: formData.name,
        email: formData.email,
        userType: formData.userType,
        createdAt: new Date(),
      };

      if (formData.geolocation) {
        userDocData.address = formData.address;
        userDocData.geolocation = new GeoPoint(
          formData.geolocation.latitude,
          formData.geolocation.longitude
        );
      }

      await setDoc(doc(db, "users", user.uid), userDocData);

      alert("Signup successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error.message);
      alert("Signup failed: " + error.message);
    }
  };

  const isLocationRequired =
    formData.userType === "store" || formData.userType === "restaurant";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12">
      <div className="max-w-md w-full p-8 bg-green-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-green-900 font-semibold mb-2">Full Name</label>
            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-green-900 font-semibold mb-2">Email</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="password" className="block text-green-900 font-semibold mb-2">Password</label>
            <input type="password" id="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-green-900 font-semibold mb-2">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="userType" className="block text-green-900 font-semibold mb-2">I am a:</label>
            <select id="userType" name="userType" required value={formData.userType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select User Type</option>
              <option value="store">Store</option>
              <option value="ngo">NGO</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          {isLocationRequired && (
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-green-900 font-semibold mb-2">Address</label>
                <input type="text" id="address" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-green-900 font-semibold mb-2">Select Location on Map</label>
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {formData.geolocation && <p className="text-xs text-green-700 mt-1">Location selected!</p>}
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-2">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

