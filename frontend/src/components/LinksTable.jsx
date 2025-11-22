import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";

export default function LinksTable({ links, loading, onDelete }) {
  if (loading) return <p className="text-gray-600">Loading links...</p>;

  if (!links.length)
    return (
      <p className="text-gray-500 bg-gray-100 p-4 rounded">No links yet. Create one above!</p>
    );

  return (
    <div className="bg-white p-4 sm:p-6 shadow rounded-lg border border-gray-200">
      {/* Table for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-left table-auto">
          <thead className="border-b font-medium">
            <tr>
              <th className="py-2">Code</th>
              <th className="py-2">URL</th>
              <th className="py-2">Clicks</th>
              <th className="py-2">Last Clicked</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id} className="border-b align-top">
                <td className="py-2 align-top font-mono">
                  <Link className="text-blue-600 hover:underline" to={`/code/${l.code}`}>
                    {l.code}
                  </Link>
                </td>

                <td className="py-2 max-w-md break-words">{l.url || l.original_url}</td>
                <td className="py-2">{l.clicks ?? l.click_count}</td>
                <td className="py-2">
                  {l.last_clicked ? new Date(l.last_clicked).toLocaleString() : "—"}
                </td>

                <td className="py-2 flex gap-3">
                  <button className="text-red-600 hover:underline" onClick={() => onDelete(l.id)}>
                    Delete
                  </button>

                  <button onClick={() => navigator.clipboard.writeText(l.code)} className="text-blue-600 hover:underline">
                    Copy Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card list for small screens */}
      <div className="sm:hidden space-y-3">
        {links.map((l) => (
          <div key={l.id} className="border p-3 rounded">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-sm text-blue-600 break-words">{l.code}</div>
                <div className="text-xs text-gray-600 break-words">{l.url || l.original_url}</div>
              </div>

              <div className="text-right text-sm">
                <div className="text-gray-800 font-medium">{l.clicks ?? l.click_count}</div>
                <div className="text-gray-500 text-xs">{l.last_clicked ? new Date(l.last_clicked).toLocaleString() : "—"}</div>
              </div>
            </div>

            <div className="mt-2 flex gap-3">
              <button className="text-red-600" onClick={() => onDelete(l.id)}>Delete</button>
              <button className="text-blue-600" onClick={() => navigator.clipboard.writeText(l.code)}>Copy Code</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
