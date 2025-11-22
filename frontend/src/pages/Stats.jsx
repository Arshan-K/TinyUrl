import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/Loader";

export default function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get(`/api/links/${code}`)
      .then((res) => setLink(res.data))
      .catch(() => setError("Code not found"));
  }, [code]);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Stats for {code}</h1>

        {error && <p className="text-red-500">{error}</p>}
        {!link && !error && <p><Loader size={25} /></p>}

        {link && (
          <div className="bg-gray-800 text-white p-4 rounded shadow space-y-2">
            <p><strong>Short Code:</strong> {link.code}</p>
            <p><strong>Target URL:</strong> {link.original_url}</p>
            <p><strong>Total Clicks:</strong> {link.click_count}</p>
            <p><strong>Created At:</strong> {new Date(link.created_at).toLocaleString()}</p>
            <p><strong>Last Clicked:</strong> 
              {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : "Never"}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
