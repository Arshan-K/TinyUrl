export default function StatCard({ label, value }) {
  return (
    <div className="p-4 border rounded-lg shadow bg-white text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
