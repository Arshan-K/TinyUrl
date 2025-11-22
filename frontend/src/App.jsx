import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Healthcheck from "./pages/Healthcheck";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats/:code" element={<Stats />} />
        <Route path="/health" element={<Healthcheck />} />
      </Routes>
    </BrowserRouter>
  );
}
