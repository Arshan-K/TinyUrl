import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import axiosClient from "../api/axiosClient";
import Loader from "../components/Loader";

export default function HealthCheck() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Checking...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/healthz")
      .then((res) => {
        setStatus("OK");
        setData(res.data);
      })
      .catch(() => {
        setStatus("DOWN");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Health Check</h1>
        {loading ? (
                    <div>
                    <Loader size={25} />
                    </div>
                ) : ( <>
        <p className={`text-lg font-semibold mb-4 ${status === "OK" ? "text-green-600" : "text-red-600"}`}>
          Status: {status}
        </p>

        {data && (
          <div className="space-y-3 bg-gray-800 text-white p-4 rounded shadow">
            <p><strong>Uptime:</strong> {Math.round(data.uptime)}s</p>
            <p><strong>Timestamp:</strong> {data.timestamp}</p>
            <p><strong>Node:</strong> {data.node_version}</p>
            <p><strong>Platform:</strong> {data.platform}</p>
            <p><strong>CPU:</strong> {data.cpu_arch}</p>
            <p><strong>Environment:</strong> {data.environment}</p>

            <p className="font-semibold mt-3">Memory Usage</p>
            <pre className="bg-black text-green-400 p-3 rounded">
              {JSON.stringify(data.memory, null, 2)}
            </pre>
          </div>
        )}

        {status === "DOWN" && (
          <p className="text-red-500 mt-4">Backend is unreachable</p>
        )}
        </>)}
      </div>
    </MainLayout>
  );
}
