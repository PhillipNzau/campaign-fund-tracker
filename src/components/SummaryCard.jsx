export default function SummaryCard({ total, count }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white">
      <p className="text-sm uppercase">Total Collection</p>
      <p className="text-4xl font-bold">KES {total.toLocaleString()}</p>
      <p className="text-xs mt-2">Based on {count} entries</p>
    </div>
  );
}
