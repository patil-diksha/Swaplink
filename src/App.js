import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from "./pages/login";
import Signup from "./pages/signup";
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import SurplusListing from "./pages/SurplusListing";
import SurplusList from "./pages/SurplusList";
import SurplusSwipe from "./pages/SurplusSwipe";
import Dashboard from './pages/Dashboard';
import MembersList from './pages/MembersList';
import SurplusMap from './pages/SurplusMap'; // Import the new map page
import React from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/list-surplus" element={<SurplusListing />} />
        <Route path="/surplus-list" element={<SurplusList />} />
        <Route path="/swipe-surplus" element={<SurplusSwipe />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members/:userType" element={<MembersList />} />
        <Route path="/surplus-map" element={<SurplusMap />} /> {/* Add the new map route */}
      </Routes>
    </Router>
  );
}

export default App;

