import { useState } from "react";

// Accept props from parent
export default function Sidebar({ fundraisers, activeId, onSelect, onCreate, onDelete }) {
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName);
    setNewName("");
  };

  return (
    <aside className="w-72 bg-[#1E293B] text-white p-5 hidden md:flex flex-col">
      <div className="mb-5">
        <h2 className="text-lg font-bold">Campaigns</h2>
      </div>

      <div className="mb-5">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New campaign..."
          className="w-full p-2 rounded bg-slate-700 text-white outline-none"
        />
        <button onClick={handleCreate} className="w-full mt-2 bg-blue-600 py-2 rounded">
          + Add Campaign
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {fundraisers.map((f) => (
          <div
            key={f.id}
            onClick={() => onSelect(f.id)} // Use prop
            className={`flex justify-between items-center p-3 rounded cursor-pointer ${
              f.id === activeId ? "bg-blue-600/30 ring-1 ring-blue-500" : "hover:bg-slate-700"
            }`}
          >
            <span className="truncate text-sm">{f.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(f.id);
              }} // Use prop
              className="text-red-300 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
