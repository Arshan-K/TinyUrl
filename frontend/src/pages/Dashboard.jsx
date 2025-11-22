import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");

  const loadLinks = () => {
    setLoading(true);
    axiosClient.get("/api/links").then((res) => {
      setLinks(res.data);
      setFiltered(res.data);
    }).finally(() => setLoading(false));
  };

  useEffect(loadLinks, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      links.filter(
        (l) =>
          l.code.toLowerCase().includes(s) ||
          l.original_url.toLowerCase().includes(s)
      )
    );
  }, [search, links]);

  const createLink = (e) => {
    e.preventDefault();
    setActionLoading(true);
    axiosClient
      .post("/api/links", { url, code })
      .then(() => {
        toast.success("Link created successfully!");
        loadLinks();
        setUrl("");
        setCode("");
      })
      .finally(() => setActionLoading(false))
      .catch((error) => toast.error(error.response?.data?.error || "Failed to create link"));
  };

  const deleteLink = (code) => {
    toast.custom(
        (t) => (
        <div
            className="fixed inset-[286px] flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="bg-gray-900 text-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-2">Delete Link?</h2>
            <p className="text-sm mb-4">Are you sure you want to delete this link?</p>

            <div className="flex justify-end gap-2">
                <button
                    className="px-4 py-2 bg-gray-600 rounded"
                    onClick={() => toast.dismiss(t.id)}
                >
                Cancel
                </button>

                <button
                className="px-4 py-2 bg-red-600 rounded"
                onClick={async () => {
                    toast.custom(
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-900 text-white p-4 rounded-lg flex items-center gap-2">
                        <span className="loader border-2 border-t-transparent border-white rounded-full w-5 h-5 animate-spin"></span>
                        Deleting...
                        </div>
                    </div>,
                    { id: "delete-loader" }
                    );

                    toast.dismiss(t.id);

                    try {
                    await axiosClient.delete(`/api/links/${code}`);
                    toast.dismiss("delete-loader");
                    toast.success("Deleted successfully!", { duration: 5000 });
                    loadLinks();
                    } catch {
                    toast.dismiss("delete-loader");
                    toast.error("Failed to delete");
                    }
                }}
                >
                Yes
                </button>
            </div>
            </div>
        </div>
        ),
        {
            duration: Infinity,
        }
    );
    };

  return (
    <MainLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                {loading ? (
                    <div>
                        <Loader size={25} />
                    </div>
                ) : (
                    <>
                        <div className="relative">
                            <input
                                className="border p-2 w-full mb-4 rounded"
                                placeholder="Search by code or URL..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search.length > 0 && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-2 top-1/2 -translate-y-5 text-gray-400 hover:text-gray-700 font-bold"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <form onSubmit={createLink} className="space-y-3 mb-6 bg-gray-800 text-white p-4 rounded">
                            <input
                                className="w-full p-2 rounded text-black"
                                placeholder="Target URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />

                            <input
                                className="w-full p-2 rounded text-black"
                                placeholder="Custom code (optional)"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />

                            <button className="bg-blue-600 px-4 py-2 rounded text-white" disabled={actionLoading}>
                                {actionLoading ? "Working..." : "Create Link"}
                            </button>
                        </form>

                        {/* Responsive list: table on sm+, cards on small */}
                        <div className="bg-white p-2 sm:p-4 rounded shadow">
                            {/* Table for sm+ */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-900 text-white">
                                            <th className="p-2">Code</th>
                                            <th className="p-2">URL</th>
                                            <th className="p-2">Clicks</th>
                                            <th className="p-2">Last Clicked</th>
                                            <th className="p-2">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center p-4 text-gray-400">
                                                    No links found.
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {filtered.map((l) => (
                                                    <tr key={l.code} className="bg-gray-800 text-white border-b">
                                                        <td className="p-2">
                                                            <a href={l.shortUrl || l.code} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                                                {l.shortUrl || l.code}
                                                            </a>
                                                        </td>
                                                        <td className="p-2 truncate max-w-xs break-words">{l.original_url}</td>
                                                        <td className="p-2">{l.click_count ?? l.clicks}</td>
                                                        <td className="p-2">
                                                            {l.last_clicked ? new Date(l.last_clicked).toLocaleString() : "Never"}
                                                        </td>

                                                        <td className="p-2 gap-3 flex">
                                                            <button title="View Stats" onClick={() => navigate(`/stats/${l.id}`)} className="bg-blue-600 px-3 py-1 rounded">
                                                                ⓘ
                                                            </button>
                                                            <button onClick={() => deleteLink(l.id)} className="bg-red-600 px-3 py-1 rounded">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Card list for small screens */}
                            <div className="sm:hidden space-y-3">
                                {filtered.length === 0 ? (
                                    <div className="text-center p-4 text-gray-400">No links found.</div>
                                ) : (
                                    filtered.map((l) => (
                                        <div key={l.code} className="bg-gray-800 text-white p-3 rounded">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <a href={l.shortUrl || l.code} target="_blank" rel="noreferrer" className="text-blue-400 font-mono break-words">
                                                        {l.shortUrl || l.code}
                                                    </a>

                                                    <div className="text-sm text-gray-200 break-words mt-1">{l.original_url}</div>
                                                </div>

                                                <div className="ml-3 text-right text-sm">
                                                    <div className="font-medium">{l.click_count ?? l.clicks}</div>
                                                    <div className="text-xs text-gray-300">{l.last_clicked ? new Date(l.last_clicked).toLocaleString() : "—"}</div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex gap-3">
                                                <button title="View Stats" onClick={() => navigate(`/stats/${l.id}`)} className="bg-blue-600 px-3 py-1 rounded">
                                                    ⓘ
                                                </button>
                                                <button onClick={() => deleteLink(l.id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
      </div>
    </MainLayout>
  );
}
