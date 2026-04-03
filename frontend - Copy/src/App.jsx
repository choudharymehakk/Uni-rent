import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/LoginPage.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";
import AddItem from "./pages/AddItem.jsx";
import MyItems from "./pages/MyItems.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Requests from "./pages/Requests.jsx";
import ScanQR from "./pages/ScanQR.jsx";
import Profile from "./pages/Profile.jsx";
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/item/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
        <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/incoming-requests" element={<ProtectedRoute><IncomingRequests /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;