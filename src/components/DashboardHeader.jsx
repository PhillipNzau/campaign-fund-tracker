import React from "react";
import { exportToExcel } from "../utils/excelExport";

export default function DashboardHeader({ active, data, onSync, onImport }) {
  const handleExport = () => {
    exportToExcel(data, active.name);
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{active.name}</h2>
        <p className="text-sm text-slate-500">Campaign Management & Analytics</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onSync}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium flex items-center gap-2"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-cloud-check-icon lucide-cloud-check"
            >
              <path d="m17 15-5.5 5.5L9 18" />
              <path d="M5.516 16.07A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 3.501 7.327" />
            </svg>
          </span>{" "}
          Sync Sheets
        </button>

        <button
          onClick={onImport}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium flex items-center gap-2"
        >
          <span>📥</span> Import
        </button>

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium flex items-center gap-2"
        >
          <span>📊</span> Export Excel
        </button>
      </div>
    </header>
  );
}
