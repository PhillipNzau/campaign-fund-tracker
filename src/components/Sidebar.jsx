import { useState } from "react";

export default function Sidebar({
  fundraisers,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  isOpen,
  setIsOpen,
}) {
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName);
    setNewName("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay - Closes sidebar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] text-white p-5 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Mobile Close Button */}
        <button
          className="md:hidden absolute top-4 right-4 text-2xl"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        <div className="mb-5">
          <h2 className="text-lg font-bold">Campaigns</h2>
          <p className="text-xs text-slate-400">Fundraiser list</p>
        </div>

        <div className="mb-5">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="New campaign..."
            className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreate}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold transition"
          >
            + Add Campaign
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {fundraisers.map((f) => (
            <div
              key={f.id}
              onClick={() => {
                onSelect(f.id);
                setIsOpen(false); // Close on mobile after selection
              }}
              className={`flex justify-between items-center p-3 rounded cursor-pointer transition ${
                f.id === activeId ? "bg-blue-600/30 ring-1 ring-blue-500" : "hover:bg-slate-700"
              }`}
            >
              <span className="truncate text-sm font-medium">{f.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(f.id);
                }}
                className="text-red-400 hover:text-red-600 px-2 text-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
