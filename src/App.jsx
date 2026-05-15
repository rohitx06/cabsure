// src/App.jsx
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white antialiased">
      <Navbar />
      <Dashboard />
    </div>
  );
}