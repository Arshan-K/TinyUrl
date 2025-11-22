export default function Loader({ size = 30 }) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin border-4 border-gray-300 border-t-blue-600 rounded-full"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
