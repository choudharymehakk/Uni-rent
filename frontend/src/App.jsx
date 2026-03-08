import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import MyItems from "./pages/MyItems";
import MyBookings from "./pages/MyBookings";
import Requests from "./pages/Requests";
import ScanQR from "./pages/ScanQR";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/item/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
        <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;