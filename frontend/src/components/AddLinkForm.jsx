import { useState } from "react";
import axiosClient from "../api/axiosClient";

export default function AddLinkForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axiosClient.post("/api/links", { url, code: code || undefined });
      setUrl("");
      setCode("");
      onCreated();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 bg-white shadow p-6 rounded-lg border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4">Create Short Link</h2>

      {error && (
        <p className="text-red-600 mb-3 text-sm bg-red-100 p-2 rounded">
          {error}
        </p>
      )}

      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Full URL *</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Custom Code (optional)</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="myCode123"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
      >
        {loading ? "Creating..." : "Create Link"}
      </button>
    </form>
  );
}
